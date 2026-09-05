import { API_URL } from "./constants";

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
    tags.some((t) => t.id === tag.id) ? tags : [...tags, tag],
  );

  setName("");
}

export async function deleteTag(
  tagId: string,
  setTags: (_: (...any) => any[]) => void,
) {
  const res = await fetch(`${API_URL}/api/tag/${tagId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete tag");
  }

  setTags((tags) => tags.filter((tag) => tag.id !== tagId));
}
