import { useAlbums, type Album } from "@/context/AlbumContext";
import styles from "./AlbumRow.module.css";
import Button from "../Button";
import ConfirmIcon from "../icons/ConfirmIcon";
import TagPile from "../tags/TagPile";
import { useTags } from "@/context/TagContext";
import { useModal } from "@/context/ModalContext";

export default function AlbumRow({ album }: { album: Album }) {
  const { deleting, editing, albumIdsToDelete, setAlbumIdsToDelete } =
    useAlbums();
  const { setData } = useModal();
  const { tagFilter } = useTags();

  return (
    <div
      className={`${styles.albumRow} ${editing ? styles.editing : ""}`}
      style={{
        cursor: editing ? "pointer" : "auto ",
      }}
      onClick={() =>
        editing && setData({ show: true, albumId: album.id, kind: "editing" })
      }
    >
      <img
        className={styles.albumRow__cover}
        src={album.cover}
        alt={`${album.name} cover`}
        onClick={() =>
          setData({ show: true, albumId: album.id, kind: "viewing" })
        }
      />

      <div className={styles.albumRow__content}>
        <div
          className={styles.albumRow__title}
          onClick={() => !editing && window.open(album.url, "_blank")}
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
        <div className={styles.albumRow__tags}>
          <TagPile
            tags={album.tags}
            sortBySelected
            selected={(tag) => tagFilter.some((t) => t.id == tag.id)}
            showState
          />
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
    </div>
  );
}
