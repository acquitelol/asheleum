import { API_URL } from "./constants";

export async function getAlbums() {
  return fetch(`${API_URL}/api/albums`, {
    credentials: "include",
  }).then((res) => res.json());
}

export async function addAlbum(
  e: React.FormEvent,
  albumUrl: string,
  setAlbumUrl: (string) => void,
  setAlbums: (_: (...any) => any[]) => void,
) {
  e.preventDefault();

  const res = await fetch("http://localhost:3000/api/album", {
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
      : [...albums, { ...album, tags: [] }],
  );

  setAlbumUrl("");
}

export async function deleteAlbum(
  albumId: string,
  setAlbums: (_: (...any) => any[]) => void,
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
