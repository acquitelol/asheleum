import type { Tag } from "@/context/TagContext";
import { API_URL } from "./constants.ts";
import type { Dispatch, SetStateAction } from "react";
import type { Album } from "@/context/AlbumContext";
import { insertAlphabetically } from "./utils";

export async function getTags() {
  return fetch(`${API_URL}/api/tags`, {
    credentials: "include",
  }).then((res) => res.json());
}

export async function addTag(
  e: React.FormEvent | null,
  name: string,
  tags: Tag[],
  setName: (_: string) => void,
  setTags: Dispatch<SetStateAction<Tag[]>>,
) {
  e?.preventDefault();
  const prevTags = tags;
  const dummyTag = {
    id: `optimistic-${crypto.randomUUID()}`,
    name,
    userId: "N/A",
    createdAt: "N/A",
  } satisfies Tag;

  setTags((tags) => insertAlphabetically(tags, dummyTag));
  setName("");

  try {
    const res = await fetch(`${API_URL}/api/tag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Failed to add new tag");

    const tag: Tag = await res.json();
    setTags((tags) => tags.map((t) => (t.id === dummyTag.id ? tag : t)));
    return tag;
  } catch (error) {
    setTags(prevTags);
    throw error;
  }
}

export async function deleteTagsBulk(
  tagIdsToDelete: string[],
  tags: Tag[],
  albums: Album[],
  setTags: Dispatch<SetStateAction<Tag[]>>,
  setAlbums: Dispatch<SetStateAction<Album[]>>,
  setTagIdsToDelete: Dispatch<SetStateAction<string[]>>,
  setDeleting: Dispatch<SetStateAction<boolean>>,
) {
  tagIdsToDelete.map((tagId) =>
    deleteTag(tagId, tags, albums, setTags, setAlbums),
  );

  setTagIdsToDelete([]);
  setDeleting(false);
}

export async function deleteTag(
  tagId: string,
  tags: Tag[],
  albums: Album[],
  setTags: Dispatch<SetStateAction<Tag[]>>,
  setAlbums: Dispatch<SetStateAction<Album[]>>,
) {
  const prevTags = tags;
  const prevAlbums = albums;

  setTags((tags) => tags.filter((tag) => tag.id !== tagId));
  setAlbums((albums) =>
    albums.map((album) => ({
      ...album,
      tags: album.tags.filter((tag) => tag.id !== tagId),
    })),
  );

  try {
    const res = await fetch(`${API_URL}/api/tag/${tagId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete tag");
  } catch (error) {
    setTags(prevTags);
    setAlbums(prevAlbums);
    throw error;
  }
}

export async function setAlbumTag(
  tagId: string,
  albumId: string,
  albums: Album[],
  tags: Tag[],
  setAlbums: Dispatch<SetStateAction<Album[]>>,
) {
  const prevAlbums = albums;

  const tag = tags.find((tag) => tag.id === tagId);
  if (!tag) throw new Error("Tag not found");

  setAlbums((albums) =>
    albums.map((album) => {
      if (album.id !== albumId) return album;

      if (album.tags.some((tag) => tag.id === tagId)) {
        return album;
      }

      return {
        ...album,
        tags: [...album.tags, tag],
      };
    }),
  );

  try {
    const res = await fetch(`${API_URL}/api/album_tag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ tagId, albumId }),
    });

    if (!res.ok) throw new Error("Failed to add tag");
  } catch (error) {
    setAlbums(prevAlbums);
    throw error;
  }
}

export async function deleteAlbumTag(
  tagId: string,
  albumId: string,
  albums: Album[],
  setAlbums: Dispatch<SetStateAction<Album[]>>,
) {
  const prevAlbums = albums;

  setAlbums((albums) =>
    albums.map((album) =>
      album.id === albumId
        ? {
            ...album,
            tags: album.tags.filter((tag) => tag.id !== tagId),
          }
        : album,
    ),
  );

  try {
    const res = await fetch(`${API_URL}/api/album_tag`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        albumId,
        tagId,
      }),
    });

    if (!res.ok) throw new Error("Failed to delete album tag");
  } catch (error) {
    setAlbums(prevAlbums);
    throw error;
  }
}
