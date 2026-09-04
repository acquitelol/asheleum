import { useAlbums } from "@/context/AlbumContext";
import styles from "./AlbumTable.module.css";
import Loading from "../Loading";
import AlbumRow from "./AlbumRow";

export default function AlbumTable() {
  const { albums, loading } = useAlbums();

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.albumTable}>
      {albums.length ? (
        albums.map((album) => <AlbumRow album={album} key={album.id} />)
      ) : (
        <p style={{ marginInline: "1em" }}>
          You don't have any albums yet. Go and get some!
        </p>
      )}
    </div>
  );
}
