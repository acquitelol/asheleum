import {
  createElement,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
import { useModal } from "@/context/ModalContext";
import { useAlbums } from "@/context/AlbumContext";

export default function TagActions({
  home = false,
  modal = false,
  popout = true,
  style = {},
}: {
  home?: boolean;
  modal?: boolean;
  popout?: boolean;
  style?: CSSProperties;
}) {
  const {
    setTags,
    sortDir,
    searchQuery,
    deleting,
    setDeleting,
    tagIdsToDelete,
    setTagIdsToDelete,
  } = useTags();
  const { setAlbums } = useAlbums();
  const { setShow } = useModal();

  const [searchParams, setSearchParams] = useSearchParams();
  const showFilter = searchParams.get("filterTags") === "true";

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

    observer.observe(filterRef.current!);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.actionsContainer} style={style}>
      <div className={styles.actions}>
        <Button
          onClick={() =>
            setSearchParams((p) => {
              p.set(
                "filterTags",
                p.get("filterTags") === "true" ? "false" : "true",
              );
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
              p.set("sortTags", p.get("sortTags") === "asc" ? "desc" : "asc");
              return p;
            })
          }
          kind="neutral"
          className={styles.button}
        >
          {createElement(sortDir ? SortDescIcon : SortAscIcon, { size: 18 })}{" "}
          Sort
        </Button>

        {modal && (
          <Button
            onClick={() => setShow(false)}
            kind="negative"
            className={`${styles.button} ${styles.squareButton}`}
          >
            <CancelIcon size={20} />
          </Button>
        )}

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

        {!home && !modal && (
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
              tagIdsToDelete.map((tagId) =>
                deleteTag(tagId, setTags, setAlbums),
              );

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
          height: showFilter || !popout ? filterHeight : 0,
          opacity: showFilter ? 1 : 0,
          marginBottom: showFilter || !popout ? "1em" : 0,
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
                p.set("searchTags", e.target.value);
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
