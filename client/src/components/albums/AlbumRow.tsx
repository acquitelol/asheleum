import { useAlbums, type Album } from "@/context/AlbumContext";
import styles from "./AlbumRow.module.css";
import Button from "../Button";
import ConfirmIcon from "../icons/ConfirmIcon";
import TagPile from "../tags/TagPile";
import { useTags } from "@/context/TagContext";

export default function AlbumRow({ album }: { album: Album }) {
  const { deleting, albumIdsToDelete, setAlbumIdsToDelete } = useAlbums();
  const { tagFilter } = useTags();

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

      <div className={styles.albumRow__trailing}>
        <TagPile
          tags={album.tags}
          selected={(tag) => tagFilter.some((t) => t.id == tag.id)}
        />
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
    </div>
  );
}
