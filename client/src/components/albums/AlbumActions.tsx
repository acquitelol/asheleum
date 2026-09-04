import { createElement, useRef, useState } from "react";
import Button from "../Button";
import FilterIcon from "../icons/FilterIcon";
import styles from "./AlbumActions.module.css";
import SortAscIcon from "@/components/icons/SortAscIcon";
import { useAlbums } from "@/context/AlbumContext";
import SortDescIcon from "../icons/SortDescIcon";
import TrashIcon from "../icons/TrashIcon";
import CancelIcon from "../icons/CancelIcon";
import ConfirmIcon from "../icons/ConfirmIcon";
import { deleteAlbum } from "@/lib/albums";

export default function AlbumActions() {
  const {
    setAlbums,
    sortDir,
    setSortDir,
    deleting,
    setDeleting,
    albumIdsToDelete,
    setAlbumIdsToDelete,
  } = useAlbums();
  const [showFilter, setShowFilter] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const filterHeight = filterRef.current?.scrollHeight ?? 0;

  return (
    <div className={styles.actionsContainer}>
      <div className={styles.actions}>
        <Button
          onClick={() => setShowFilter((p) => !p)}
          kind="neutral"
          className={styles.button}
        >
          <FilterIcon size={16} /> Filter
        </Button>

        <Button
          onClick={() => setSortDir((p) => !p)}
          kind="neutral"
          className={styles.button}
        >
          {createElement(sortDir ? SortDescIcon : SortAscIcon, { size: 18 })}{" "}
          Sort
        </Button>

        <Button
          onClick={() =>
            setDeleting((p) => {
              if (p) {
                setAlbumIdsToDelete([]);
              }

              return !p;
            })
          }
          kind={deleting ? "neutral" : "negative"}
          className={`${styles.button} ${styles.squareButton}`}
        >
          {createElement(deleting ? CancelIcon : TrashIcon, {
            size: deleting ? 20 : 18,
          })}
        </Button>

        {deleting && (
          <Button
            onClick={() => {
              albumIdsToDelete.map((albumId) =>
                deleteAlbum(albumId, setAlbums),
              );

              setAlbumIdsToDelete([]);
              setDeleting(false);
            }}
            kind={"positive"}
            className={`${styles.button}`}
            style={{
              opacity: albumIdsToDelete.length ? 1 : 0.5,
              pointerEvents: albumIdsToDelete.length ? "all" : "none",
            }}
          >
            <ConfirmIcon size={20} /> {albumIdsToDelete.length}
          </Button>
        )}
      </div>
      <div
        className={styles.filterSectionWrapper}
        style={{
          height: showFilter ? filterHeight : 0,
          opacity: showFilter ? 1 : 0,
          marginBottom: showFilter ? "1em" : 0,
          pointerEvents: showFilter ? "all" : "none",
        }}
      >
        <div ref={filterRef} className={styles.filterSection}></div>
      </div>
    </div>
  );
}
