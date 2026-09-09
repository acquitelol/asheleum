import type { Album } from "@/context/AlbumContext";
import type { Tag } from "@/context/TagContext";

export const exportData = (albums: Album[], tags: Tag[]) => {
  const blob = new Blob([JSON.stringify({ albums, tags })], {
    type: "application/json",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `asheleum-${new Date()
    .toLocaleString()
    .replace(/\//g, "-")
    .replace(/, /g, "-")}.json`;
  link.click();
};
