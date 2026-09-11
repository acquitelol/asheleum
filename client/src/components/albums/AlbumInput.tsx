import { useAlbums } from "@/context/AlbumContext";
import styles from "./AlbumInput.module.css";
import { useState } from "react";
import Button from "@/components/Button";
import { addAlbum } from "@/lib/albums";
import AlbumAddIcon from "../icons/AlbumAddIcon";
import LoadingIcon from "../icons/LoadingIcon";
import { useModal } from "@/context/ModalContext";

export default function AlbumInput() {
  const [loading, setLoading] = useState(false);
  const [albumUrl, setAlbumUrl] = useState("");
  const { setAlbums, editing, setNewAlbumId } = useAlbums();
  const { setData } = useModal();

  return (
    <>
      <h3>Add a new album:</h3>
      <form
        className={styles.inputForm}
        onSubmit={async (e) => {
          const album = await addAlbum(
            e,
            albumUrl,
            setLoading,
            setAlbumUrl,
            setAlbums,
          );

          setNewAlbumId({ id: album.id });
          editing &&
            setData({ show: true, albumId: album.id, kind: "editing" });
        }}
      >
        <input
          className={styles.textInput}
          type="text"
          value={albumUrl}
          onChange={(e) => setAlbumUrl(e.target.value)}
          placeholder="Album URL"
          style={{
            pointerEvents: loading ? "none" : "auto",
            opacity: loading ? 0.5 : 1,
          }}
          disabled={loading}
        />
        <Button
          type="submit"
          border
          className={styles.button}
          style={{
            pointerEvents: loading ? "none" : "auto",
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? (
            <>
              <LoadingIcon size={18} />
              Loading
            </>
          ) : (
            <>
              <AlbumAddIcon size={18} />
              Add
            </>
          )}
        </Button>
      </form>
    </>
  );
}
