import { useAlbums } from "@/context/AlbumContext";
import styles from "./AlbumTable.module.css";
import Loading from "../Loading";
import AlbumRow from "./AlbumRow";
import { useState } from "react";

export default function AlbumTable() {
  const { processedAlbums, loading } = useAlbums();

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.albumTable}>
      {processedAlbums && processedAlbums.length ? (
        processedAlbums.map((album) => (
          <AlbumRow album={album} key={album.id} />
        ))
      ) : (
        <p style={{ marginInline: "1em" }}>
          You don't have any albums yet. Go and get some!
        </p>
      )}
    </div>
  );
}
