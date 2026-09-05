import { useAlbums } from "@/context/AlbumContext";
import styles from "./AlbumTable.module.css";
import Loading from "../Loading";
import AlbumRow from "./AlbumRow";
import { createElement } from "react";
import { NoAlbumsExist, NoAlbumsFound } from "../NoAlbums";

export default function AlbumTable() {
  const { albums, processedAlbums, loading } = useAlbums();

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.albumTable}>
      {processedAlbums && processedAlbums.length
        ? processedAlbums.map((album) => (
            <AlbumRow album={album} key={album.id} />
          ))
        : createElement(
            albums && albums.length ? NoAlbumsFound : NoAlbumsExist,
            { style: { margin: "1em" } },
          )}
    </div>
  );
}
