import type { Express } from "express";
import { auth } from "../auth.ts";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "../db/index.ts";
import { tag } from "../db/schema.ts";
import { and, eq } from "drizzle-orm";

export async function registerTags(app: Express) {
  app.get("/api/tags", async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tags = await db
      .select()
      .from(tag)
      .where(eq(tag.userId, session.user.id));

    return res.json(tags);
  });

  app.post("/api/tag", async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({ error: "Tag name is required" });
    }

    const [newTag] = await db
      .insert(tag)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        name,
      })
      .returning();

    return res.json(newTag);
  });

  app.delete("/api/tag/:id", async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [deletedTag] = await db
      .delete(tag)
      .where(and(eq(tag.id, req.params.id), eq(tag.userId, session.user.id)))
      .returning();

    if (!deletedTag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    return res.json(deletedTag);
  });
}
