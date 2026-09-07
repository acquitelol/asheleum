import type { Tag } from "@/context/TagContext";
import { API_URL } from "./constants";
import type { Dispatch, SetStateAction } from "react";
import type { Album } from "@/context/AlbumContext";
import { insertAlphabetically } from "./utils";

export async function getTags() {
  return fetch(`${API_URL}/api/tags`, {
    credentials: "include",
  }).then((res) => res.json());
}

export async function addTag(
  e: React.FormEvent,
  name: string,
  setName: (string) => void,
  setTags: (_: (...any) => any[]) => void,
) {
  e.preventDefault();

  const res = await fetch("http://localhost:3000/api/tag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to add new album");
  }

  const tag = await res.json().catch(console.error);

  setTags((tags) =>
    tags.some((t) => t.id === tag.id) ? tags : insertAlphabetically(tags, tag),
  );

  setName("");
}

export async function deleteTag(
  tagId: string,
  setTags: (_: (...any) => any[]) => void,
  setAlbums: Dispatch<SetStateAction<Album[]>>,
) {
  const res = await fetch(`${API_URL}/api/tag/${tagId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete tag");
  }

  setTags((tags) => tags.filter((tag) => tag.id !== tagId));
  setAlbums((albums) =>
    albums.map((album) => ({
      ...album,
      tags: album.tags.filter((tag) => tag.id !== tagId),
    })),
  );
}

export async function setAlbumTag(
  tagId: string,
  albumId: string,
  tags: Tag[],
  setAlbums: Dispatch<SetStateAction<Album[]>>,
) {
  const res = await fetch(`${API_URL}/api/album_tag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ tagId, albumId }),
  });

  if (!res.ok) {
    throw new Error("Failed to add tag");
  }

  const tag = tags.find((tag) => tag.id === tagId);

  if (!tag) {
    throw new Error("Tag not found");
  }

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
}

export async function deleteAlbumTag(
  tagId: string,
  albumId: string,
  setAlbums: Dispatch<SetStateAction<Album[]>>,
) {
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

  if (!res.ok) {
    throw new Error("Failed to delete album tag");
  }

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
}
