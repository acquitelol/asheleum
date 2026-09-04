import { type Express } from "express";
import { auth } from "../auth.ts";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "../db/index.ts";
import { album, albumTag, tag, userAlbum } from "../db/schema.ts";
import { and, eq } from "drizzle-orm";
import { decodeHtml } from "../utils.ts";

async function extractMetadata(url: string) {
  const res = await fetch(url);
  const text = await res.text();

  const metaRegex = /<title>(.*?)<\/title>/;
  const imageRegex =
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/;

  const metaRes = metaRegex.exec(text)?.[1]?.split(" | Spotify")!;
  const imageRes = imageRegex.exec(text)?.[1];
  const id = url?.match(/\/(playlist|album)\/([^?]+)/)?.[2] as string;

  if (metaRes[1] === " Playlist") {
    return {
      id,
      name: decodeHtml(metaRes[0]!),
      type: "Playlist",
      artist: "Spotify",
      cover: imageRes,
      url,
    };
  }

  const parts = (metaRes[0] as string).match(/(.*) - (EP|Album) by (.*)/)!;

  return {
    id,
    name: decodeHtml(parts[1]!),
    type: parts[2],
    artist: decodeHtml(parts[3]!),
    cover: imageRes,
    url,
  };
}

export async function registerAlbums(app: Express) {
  app.post("/api/album", async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const url = req.body.url?.trim();

    if (!url) {
      return res.status(400).json({ error: "Album URL is required" });
    }

    type NonNullableFields<T extends Record<string, unknown>> = {
      [K in keyof T]-?: NonNullable<T[K]>;
    };

    const meta = (await extractMetadata(url)) as NonNullableFields<
      ReturnType<typeof extractMetadata> extends Promise<infer T> ? T : never
    >;

    const [newAlbum] = await db
      .insert(album)
      .values(meta)
      .onConflictDoNothing()
      .returning();

    await db
      .insert(userAlbum)
      .values({ userId: session.user.id, albumId: meta.id })
      .onConflictDoNothing();

    return res.json(
      newAlbum ??
        (await db.select().from(album).where(eq(album.id, meta.id)))[0],
    );
  });

  app.get("/api/albums", async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const albums = await db
      .select({ album })
      .from(userAlbum)
      .innerJoin(album, eq(userAlbum.albumId, album.id))
      .where(eq(userAlbum.userId, session.user.id));

    const tags = await db
      .select({
        albumId: albumTag.albumId,
        tag,
      })
      .from(albumTag)
      .innerJoin(tag, eq(albumTag.tagId, tag.id))
      .where(eq(albumTag.userId, session.user.id));

    return res.json(
      albums.map(({ album }) => ({
        ...album,
        tags: tags
          .filter(({ albumId }) => albumId === album.id)
          .map(({ tag }) => tag),
      })),
    );
  });

  app.delete("/api/album/:id", async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [deletedAlbum] = await db
      .delete(userAlbum)
      .where(
        and(
          eq(userAlbum.albumId, req.params.id),
          eq(userAlbum.userId, session.user.id),
        ),
      )
      .returning();

    if (!deletedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    return res.json(deletedAlbum);
  });

  app.post("/api/album_tag", async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { tagId, albumId } = req.body;

    if (!tagId || !albumId) {
      return res
        .status(400)
        .json({ error: "Tag ID and Album ID are required" });
    }

    const [newAlbumTag] = await db
      .insert(albumTag)
      .values({
        userId: session.user.id,
        tagId,
        albumId,
      })
      .onConflictDoNothing()
      .returning();

    if (newAlbumTag) {
      return res.json(newAlbumTag);
    }

    const [existingAlbumTag] = await db
      .select()
      .from(albumTag)
      .where(
        and(
          eq(albumTag.userId, session.user.id),
          eq(albumTag.albumId, albumId),
          eq(albumTag.tagId, tagId),
        ),
      );

    return res.json(existingAlbumTag);
  });

  app.delete("/api/album_tag", async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { albumId, tagId } = req.body;

    if (!albumId || !tagId) {
      return res.status(400).json({
        error: "Album ID and tag ID are required",
      });
    }

    const [deleted] = await db
      .delete(albumTag)
      .where(
        and(
          eq(albumTag.userId, session.user.id),
          eq(albumTag.albumId, albumId),
          eq(albumTag.tagId, tagId),
        ),
      )
      .returning();

    if (!deleted) {
      return res.status(404).json({
        error: "Album tag not found",
      });
    }

    return res.json(deleted);
  });
}
