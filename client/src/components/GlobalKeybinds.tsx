import { useAlbums } from "@/context/AlbumContext";
import { useTags } from "@/context/TagContext";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function GlobalKeybinds() {
  const { setEditing, setDeleting: setAlbumsDeleting } = useAlbums();
  const { setDeleting: setTagsDeleting } = useTags();
  const location = useLocation();

  const handleKeyDown = useCallback(
    (event) => {
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
            if (location.pathname.startsWith("/albums"))
              setAlbumsDeleting((p) => !p);
            if (location.pathname.startsWith("/tags"))
              setTagsDeleting((p) => !p);
          }
          break;
        case "KeyE":
          {
            event.preventDefault();
            setEditing((p) => !p);
          }
          break;
      }
    },
    [location],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
}
