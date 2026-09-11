import { useAlbums } from "@/context/AlbumContext";
import { useTags } from "@/context/TagContext";
import { deleteAlbumsBulk } from "@/lib/albums";
import { deleteTagsBulk } from "@/lib/tags";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function GlobalKeybinds() {
  const {
    albums,
    setAlbums,
    editing,
    setEditing,
    deleting: deletingAlbums,
    setDeleting: setAlbumsDeleting,
    albumIdsToDelete,
    setAlbumIdsToDelete,
  } = useAlbums();
  const {
    tags,
    setTags,
    deleting: deletingTags,
    setDeleting: setTagsDeleting,
    tagIdsToDelete,
    setTagIdsToDelete,
  } = useTags();
  const location = useLocation();

  const handleKeyDown = useCallback(
    (event: any) => {
      const { target, code, altKey } = event;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable ||
        !altKey
      ) {
        return;
      }

      switch (code) {
        case "KeyD":
          {
            event.preventDefault();
            if (location.pathname.startsWith("/albums") && !editing)
              setAlbumsDeleting((p) => !p);
            else if (location.pathname.startsWith("/tags"))
              setTagsDeleting((p) => !p);
          }
          break;
        case "KeyE":
          {
            event.preventDefault();
            !deletingAlbums && setEditing((p) => !p);
          }
          break;
        case "KeyC": {
          event.preventDefault();

          if (location.pathname.startsWith("/albums") && deletingAlbums)
            deleteAlbumsBulk(
              albumIdsToDelete,
              albums,
              setAlbums,
              setAlbumIdsToDelete,
              setAlbumsDeleting,
            );
          else if (location.pathname.startsWith("/tags") && deletingTags)
            deleteTagsBulk(
              tagIdsToDelete,
              tags,
              albums,
              setTags,
              setAlbums,
              setTagIdsToDelete,
              setTagsDeleting,
            );
        }
      }
    },
    [
      location,
      editing,
      albumIdsToDelete,
      tagIdsToDelete,
      tags,
      albums,
      deletingAlbums,
      deletingTags,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
}
