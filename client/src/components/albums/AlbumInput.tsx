import { useAlbums } from "@/context/AlbumContext";
import styles from "./AlbumInput.module.css";
import { useState } from "react";
import Button from "@/components/Button";
import { addAlbum } from "@/lib/albums";
import AlbumIcon from "../icons/AlbumIcon";
import AlbumAddIcon from "../icons/AlbumAddIcon";

export default function AlbumInput() {
  const [albumUrl, setAlbumUrl] = useState("");
  const { setAlbums } = useAlbums();

  return (
    <>
      <h3>Add a new album:</h3>
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
        <Button type="submit" border className={styles.button}>
          <AlbumAddIcon size={18} />
          Add
        </Button>
      </form>
    </>
  );
}
