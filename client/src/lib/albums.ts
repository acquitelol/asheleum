import type { Album } from "@/context/AlbumContext";
import type { Dispatch, SetStateAction } from "react";
import { API_URL } from "./constants.ts";
import { insertAlphabetically } from "./utils";

export async function getAlbums() {
  return fetch(`${API_URL}/api/albums`, {
    credentials: "include",
  }).then((res) => res.json());
}

export async function addAlbum(
  e: React.FormEvent,
  albumUrl: string,
  setAlbumUrl: (_: string) => void,
  setAlbums: Dispatch<SetStateAction<Album[]>>,
) {
  e.preventDefault();

  const res = await fetch(`${API_URL}/api/album`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ url: albumUrl }),
  });

  if (!res.ok) {
    throw new Error("Failed to add new album");
  }

  const album = await res.json().catch(console.error);

  setAlbums((albums) =>
    albums.some((a) => a.id === album.id)
      ? albums
      : insertAlphabetically(albums, album),
  );

  setAlbumUrl("");
}

export async function deleteAlbum(
  albumId: string,
  setAlbums: Dispatch<SetStateAction<Album[]>>,
) {
  const res = await fetch(`${API_URL}/api/album/${albumId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete album");
  }

  setAlbums((albums) => albums.filter((album) => album.id !== albumId));
}
