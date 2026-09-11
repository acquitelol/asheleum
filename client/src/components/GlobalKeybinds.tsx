import { useAlbums } from "@/context/AlbumContext";
import { useModal } from "@/context/ModalContext";
import { useTags } from "@/context/TagContext";
import { deleteAlbumsBulk } from "@/lib/albums";
import { deleteTagsBulk } from "@/lib/tags";
import { randomChoice } from "@/lib/utils";
import { useMatch } from "react-router-dom";
import { useEffect } from "react";

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
    processedAlbums,
  } = useAlbums();
  const {
    tags,
    setTags,
    deleting: deletingTags,
    setDeleting: setTagsDeleting,
    tagIdsToDelete,
    setTagIdsToDelete,
  } = useTags();
  const { data, setData } = useModal();
  const isAlbumsPage = useMatch("/albums/*");
  const isTagsPage = useMatch("/tags/*");

  const handleKeyDown = (event: any) => {
    const { target, code, altKey } = event;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable
    ) {
      return;
    }

    if (code === "Escape" && data?.show) setData({ show: false });
    if (!altKey) return;

    switch (code) {
      case "KeyD":
        {
          event.preventDefault();
          if (isAlbumsPage && !editing) setAlbumsDeleting((p) => !p);
          else if (isTagsPage) setTagsDeleting((p) => !p);
        }
        break;
      case "KeyE":
        {
          event.preventDefault();
          !deletingAlbums &&
            setEditing((p) => {
              const editing = !p;

              if (!editing && data?.show && data?.kind === "editing") {
                setData({ show: false });
              }

              return editing;
            });
        }
        break;
      case "KeyR":
        {
          if (deletingAlbums || editing) break;
          event.preventDefault();

          const album = randomChoice(processedAlbums);
          setData({ show: true, albumId: album.id, kind: "viewing" });
        }
        break;
      case "KeyC": {
        event.preventDefault();

        if (isAlbumsPage && deletingAlbums)
          deleteAlbumsBulk(
            albumIdsToDelete,
            albums,
            setAlbums,
            setAlbumIdsToDelete,
            setAlbumsDeleting,
          );
        else if (isTagsPage && deletingTags)
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
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
}
