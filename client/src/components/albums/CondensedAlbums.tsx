import { useAlbums } from "@/context/AlbumContext";
import styles from "./CondensedAlbums.module.css";
import Loading from "../Loading";
import AlbumCard from "./AlbumCard";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { NoAlbumsExist } from "../NoAlbums";

export default function () {
  const { albums, loading } = useAlbums();
  const navigate = useNavigate();

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.condensedAlbums}>
      <h2 style={{ marginBottom: "0.5em" }}>Your albums at a glance:</h2>
      <div className={styles.albumContainer}>
        {albums.length ? (
          albums
            .slice(0, 10)
            .map((album) => <AlbumCard album={album} key={album.id} />)
        ) : (
          <NoAlbumsExist />
        )}
        {albums.length ? (
          <Button
            onClick={() => navigate("/albums")}
            style={{ minWidth: "initial" }}
            // style={{ marginTop: "1em" }}
          >
            View all
          </Button>
        ) : null}
      </div>
    </div>
  );
}
