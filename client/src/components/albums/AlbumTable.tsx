import { useAlbums } from "@/context/AlbumContext";
import styles from "./AlbumTable.module.css";
import Loading from "../Loading";
import AlbumRow from "./AlbumRow";
import { createElement } from "react";
import { NoExist, NoFound } from "../NoExist";

export default function AlbumTable() {
  const { albums, processedAlbums, loading } = useAlbums();

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.albumTable}>
      {processedAlbums.length
        ? processedAlbums.map((album) => (
            <AlbumRow album={album} key={album.id} />
          ))
        : createElement(albums.length ? NoFound : NoExist, {
            style: { margin: "1em" },
          })}
    </div>
  );
}
