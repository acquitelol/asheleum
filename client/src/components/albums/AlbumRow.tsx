import { useAlbums, type Album } from "@/context/AlbumContext";
import styles from "./AlbumRow.module.css";
import Button from "../Button";
import TrashIcon from "@/components/icons/TrashIcon";
import { deleteAlbum } from "@/lib/albums";
import ConfirmIcon from "../icons/ConfirmIcon";

export default function AlbumRow({ album }: { album: Album }) {
  const { deleting, albumIdsToDelete, setAlbumIdsToDelete } = useAlbums();

  return (
    <div className={styles.albumRow}>
      <img
        className={styles.albumRow__cover}
        src={album.cover}
        alt={`${album.name} cover`}
      />

      <div className={styles.albumRow__content}>
        <div
          className={styles.albumRow__title}
          onClick={() => window.open(album.url, "_blank")}
        >
          {album.name} ⇗
        </div>

        <div className={styles.albumRow__artist}>
          {album.type} | {album.artist}
        </div>
        {/*<div className={styles.albumRow__tags}>
          {album.tags.slice(0, 3).map((tag) => (
            <TagPill name={tag.name} size={0.5} key={tag.id} />
          ))}
        </div>*/}
      </div>

      {deleting && (
        <Button
          className={styles.albumRow__delete}
          onClick={() =>
            setAlbumIdsToDelete((albums) =>
              albums.includes(album.id)
                ? albums.filter((albumId) => albumId !== album.id)
                : [...albums, album.id],
            )
          }
          kind={"neutral"}
          border
        >
          {albumIdsToDelete.includes(album.id) && <ConfirmIcon />}
        </Button>
      )}
    </div>
  );
}
