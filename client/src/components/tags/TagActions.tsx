import { createElement, useLayoutEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import styles from "./TagActions.module.css";
import SortAscIcon from "@/components/icons/SortAscIcon";
import SortDescIcon from "@/components/icons/SortDescIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import CancelIcon from "@/components/icons/CancelIcon";
import ConfirmIcon from "@/components/icons/ConfirmIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { useTags } from "@/context/TagContext";
import { useSearchParams } from "react-router-dom";
import { deleteTag } from "@/lib/tags";
import { useNavigate } from "react-router-dom";
import TagIcon from "../icons/TagIcon";

export default function TagActions({ home = false }: { home?: boolean }) {
  const {
    setTags,
    sortDir,
    searchQuery,
    deleting,
    setDeleting,
    tagIdsToDelete,
    setTagIdsToDelete,
  } = useTags();
  const [searchParams, setSearchParams] = useSearchParams();
  const showFilter = searchParams.get("filter") === "true";

  const filterRef = useRef<HTMLDivElement>(null);
  const [filterHeight, setFilterHeight] = useState(0);
  const navigate = useNavigate();

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
          className={`${styles.button} ${styles.squareButton}`}
        >
          <SearchIcon />
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

        {home && (
          <Button
            onClick={() => navigate(`/tags?${searchParams.toString()}`)}
            kind="neutral"
            className={styles.button}
          >
            <TagIcon size={18} />
            View all
          </Button>
        )}

        {!home && (
          <Button
            onClick={() =>
              setDeleting((p) => {
                if (p) {
                  setTagIdsToDelete([]);
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
        )}

        {!home && deleting && (
          <Button
            onClick={() => {
              tagIdsToDelete.map((tagId) => deleteTag(tagId, setTags));

              setTagIdsToDelete([]);
              setDeleting(false);
            }}
            kind={"positive"}
            className={`${styles.button}`}
            style={{
              opacity: tagIdsToDelete.length ? 1 : 0.5,
              pointerEvents: tagIdsToDelete.length ? "all" : "none",
            }}
          >
            <ConfirmIcon size={20} /> {tagIdsToDelete.length}
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
        <div className={styles.searchInput} ref={filterRef}>
          <input
            className={styles.textInput}
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchParams((p) => {
                p.set("search", e.target.value);
                return p;
              })
            }
            placeholder="Search..."
          />
          <Button
            kind="negative"
            border
            className={styles.clearFilters}
            onClick={() => setSearchParams({})}
          >
            <TrashIcon size={18} /> Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
