import { API_URL } from "./constants";

export default async function getAlbums() {
  return fetch(`${API_URL}/api/albums`, {
    credentials: "include",
  }).then((res) => res.json());
}
