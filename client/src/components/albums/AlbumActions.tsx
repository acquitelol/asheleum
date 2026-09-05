import { createElement, useLayoutEffect, useRef, useState } from "react";
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
import SearchIcon from "../icons/SearchIcon";
import { useTags } from "@/context/TagContext";
import TagPill from "../tags/TagPill";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AlbumKindFilter from "./AlbumKindFilter";

export default function AlbumActions() {
  const {
    setAlbums,
    sortDir,
    deleting,
    setDeleting,
    albumIdsToDelete,
    setAlbumIdsToDelete,
  } = useAlbums();
  const { tags, loading: tagsLoading, tagFilter, setTagFilter } = useTags();
  const [searchParams, setSearchParams] = useSearchParams();
  const showFilter = searchParams.get("filter") === "true";

  const navigate = useNavigate();
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterHeight, setFilterHeight] = useState(0);

  useLayoutEffect(() => {
    if (filterRef.current) {
      setFilterHeight(filterRef.current.scrollHeight);
    }

    const observer = new ResizeObserver(() => {
      setFilterHeight(filterRef.current!.scrollHeight);
    });

    observer.observe(filterRef.current);

    return () => observer.disconnect();
  }, []);

  const searchQuery = searchParams.get("search") ?? "";
  const formatQuery = (searchParams.get("format") ?? "")
    .split(",")
    .filter(Boolean);
  const isFiltering =
    tagFilter.length || searchQuery !== "" || formatQuery.length;

  return (
    <div className={styles.actionsContainer}>
      <div className={styles.actions}>
        <Button
          onClick={() =>
            setSearchParams((p) => {
              p.set("filter", p.get("filter") === "true" ? "false" : "true");
              return p;
            })
          }
          kind="neutral"
          className={styles.button}
        >
          {createElement(isFiltering ? ConfirmIcon : FilterIcon, {
            size: isFiltering ? 18 : 16,
          })}
          Filter
        </Button>

        <Button
          onClick={() =>
            setSearchParams((p) => {
              p.set("sort", p.get("sort") === "asc" ? "desc" : "asc");
              return p;
            })
          }
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
          pointerEvents: showFilter ? "auto" : "none",
        }}
      >
        <div ref={filterRef} className={styles.filterSection}>
          <div className={styles.searchInput}>
            <SearchIcon />
            <input
              className={styles.textInput}
              type="text"
              value={searchParams.get("search")}
              onChange={(e) =>
                setSearchParams((p) => {
                  p.set("search", e.target.value);
                  return p;
                })
              }
              placeholder="Search..."
            />
          </div>

          <div className={styles.tagFilterAndClear}>
            <h3>Format filters:</h3>
            <Button
              kind="negative"
              border
              className={styles.clearFilters}
              onClick={() => {
                setSearchParams({});
                setTagFilter([]);
              }}
            >
              <TrashIcon size={18} /> Clear
            </Button>
          </div>
          <div>
            <AlbumKindFilter />
          </div>

          <h3 style={{ marginBottom: "1em" }}>Tag filters:</h3>
          <div className={styles.tagFilter}>
            {!tagsLoading && tags.length ? (
              new Array(1)
                .fill(0)
                .map((_) =>
                  tags.map((tag) => (
                    <TagPill
                      tag={tag}
                      size={0.75}
                      selectable
                      onClick={(selected) =>
                        setTagFilter((p) =>
                          selected && !p.some((t) => t.id === tag.id)
                            ? [...p, tag]
                            : p.filter((t) => t.id !== tag.id),
                        )
                      }
                    />
                  )),
                )
                .reduce((prev, cur) => [...cur, ...prev])
            ) : (
              <p>No tags were found.</p>
            )}
            <TagPill
              tag={{
                id: "N/A",
                name: "View All",
                userId: "N/A",
                createdAt: "N/A",
              }}
              size={0.75}
              clickable
              onClick={() => navigate("/tags")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
