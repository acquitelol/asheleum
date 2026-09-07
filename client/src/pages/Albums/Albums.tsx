import Navigation from "@/components/navigation/Navigation";
import styles from "./Albums.module.css";
import AlbumInput from "@/components/albums/AlbumInput";
import AlbumTable from "@/components/albums/AlbumTable";
import AlbumActions from "@/components/albums/AlbumActions";
import TagTable from "@/components/tags/TagTable";
import TagActions from "@/components/tags/TagActions";
import { useModal } from "@/context/ModalContext";
import { deleteAlbumTag, setAlbumTag } from "@/lib/tags";
import { useAlbums } from "@/context/AlbumContext";
import { useTags } from "@/context/TagContext";

export default function () {
  const { show, data: albumId } = useModal();
  const { albums, setAlbums } = useAlbums();
  const { tags } = useTags();

  const album = albums.find((album) => album.id === albumId);

  return (
    <div>
      <main>
        <div className={styles.titleContainer}>
          <h1>Albums</h1>
        </div>
        <div className={styles.addAlbumContainer}>
          <AlbumInput />
        </div>
        <AlbumActions />
        <AlbumTable />
      </main>
      <div
        className={styles.modalOverlay}
        style={{
          opacity: show ? 1 : 0,
          pointerEvents: show ? "auto" : "none",
        }}
      >
        <div className={styles.modal}>
          <h2>Editing {album?.name ?? ""}:</h2>
          <TagTable
            style={{
              marginBottom: 0,
              width: "calc(100vw - 4em)",
              maxWidth: "60em",
            }}
            showState
            showIcon
            selectable={() => show}
            clickable={() => false}
            selected={(tag) => album?.tags?.some((t) => t.id === tag.id)}
            quantity={false}
            onClick={(tag) => {
              album?.tags?.some((t) => t.id === tag.id)
                ? deleteAlbumTag(tag.id, album.id, setAlbums)
                : setAlbumTag(tag.id, album.id, tags, setAlbums);
            }}
          />
          <TagActions style={{ marginBottom: "4em" }} popout={false} modal />
        </div>
      </div>
      <Navigation />
    </div>
  );
}
