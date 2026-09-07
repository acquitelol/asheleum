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
import { NoFiltered } from "@/components/NoExist";

export default function () {
  const {
    data: { show, albumId, kind },
  } = useModal();
  const { albums, setAlbums } = useAlbums();
  const { tags } = useTags();

  const album = albums.find((album) => album.id === albumId)!;

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
          {kind === "editing" && (
            <>
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
                selected={(tag) =>
                  album?.tags?.some((t) => t.id === tag.id) ?? false
                }
                quantity={false}
                onClick={(tag) => {
                  album?.tags?.some((t) => t.id === tag.id)
                    ? deleteAlbumTag(tag.id, album.id, albums, setAlbums)
                    : setAlbumTag(tag.id, album.id, albums, tags, setAlbums);
                }}
              />
              <TagActions
                style={{ marginBottom: "4em" }}
                popout={false}
                modal
              />
            </>
          )}
          {kind === "viewing" && (
            <div className={styles.viewModal}>
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
              </div>

              <h2>Applied tags:</h2>
              <TagTable
                style={{
                  marginBottom: 0,
                  width: "calc(100vw - 4em)",
                  maxWidth: "60em",
                }}
                selectable={() => false}
                clickable={() => false}
                selected={() => false}
                customTagFilter={(tag) =>
                  album.tags.some((t) => t.id === tag.id)
                }
                quantity={false}
                CustomMissingComponent={NoFiltered}
              />

              <TagActions
                style={{ marginBottom: "4em" }}
                popout={false}
                modal
              />
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
}
