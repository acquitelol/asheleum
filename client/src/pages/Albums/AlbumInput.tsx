import { useAlbums } from "@/context/AlbumContext";
import styles from "./AlbumInput.module.css";
import { useState } from "react";
import Button from "@/components/Button";
import { addAlbum } from "@/lib/albums";

export default function AlbumInput() {
  const [albumUrl, setAlbumUrl] = useState("");
  const { setAlbums } = useAlbums();

  return (
    <>
      <h3 style={{ padding: 0, margin: 0 }}>Add a new album:</h3>
      <form
        className={styles.inputForm}
        onSubmit={(e) => addAlbum(e, albumUrl, setAlbumUrl, setAlbums)}
      >
        <input
          className={styles.textInput}
          type="text"
          value={albumUrl}
          onChange={(e) => setAlbumUrl(e.target.value)}
          placeholder="Album URL"
        />
        <Button type="submit">Add album</Button>
      </form>
    </>
  );
}
