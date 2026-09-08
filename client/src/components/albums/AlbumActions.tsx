import {
  createElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import TagAddIcon from "../icons/TagAddIcon";
import DicesIcon from "../icons/DicesIcon";
import { useModal } from "@/context/ModalContext";
import { randomChoice } from "@/lib/utils";
import ListTodoIcon from "../icons/ListTodoIcon";
import ListChecksIcon from "../icons/ListChecksIcon";

export default function AlbumActions() {
  const {
    albums,
    setAlbums,
    sortDir,
    searchQuery,
    formatQuery,
    filterAny,
    setFilterAny,
    deleting,
    setDeleting,
    editing,
    setEditing,
    processedAlbums,
    albumIdsToDelete,
    setAlbumIdsToDelete,
  } = useAlbums();
  const { tags, tagFilter, setTagFilter } = useTags();
  const [searchParams, setSearchParams] = useSearchParams();
  const showFilter = searchParams.get("filterAlbums") === "true";

  const navigate = useNavigate();
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterHeight, setFilterHeight] = useState(0);
  const { setData } = useModal();

  const [tagQuery, setTagQuery] = useState("");
  const [small, setSmall] = useState(
    window.matchMedia("(max-width: 700px)").matches,
  );

  const filteredTags = useMemo(
    () =>
      tagQuery !== ""
        ? tags.filter((tag) =>
            tag.name.toLocaleLowerCase().includes(tagQuery.toLocaleLowerCase()),
          )
        : tags,
    [tags, tagQuery],
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const handler = () => setSmall(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

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

  const isFiltering =
    tagFilter.length || searchQuery !== "" || formatQuery.length;

  return (
    <div className={styles.actionsContainer}>
      <div className={styles.actions}>
        <Button
          onClick={() =>
            setSearchParams((p) => {
              p.set(
                "filterAlbums",
                p.get("filterAlbums") === "true" ? "false" : "true",
              );
              return p;
            })
          }
          kind="neutral"
          className={`${styles.button} ${small ? styles.squareButton : ""} ${searchParams.get("filter") === "true" ? styles.filtering : ""}`}
        >
          {createElement(isFiltering ? ConfirmIcon : FilterIcon, {
            size: isFiltering ? 18 : 16,
          })}
          {!small && " Filter"}
        </Button>

        <Button
          onClick={() =>
            setSearchParams((p) => {
              p.set(
                "sortAlbums",
                p.get("sortAlbums") === "asc" ? "desc" : "asc",
              );
              return p;
            })
          }
          kind="neutral"
          className={`${styles.button} ${small ? styles.squareButton : ""}`}
        >
          {createElement(sortDir ? SortDescIcon : SortAscIcon, {
            size: 18,
          })}
          {!small && " Sort"}
        </Button>

        <Button
          onClick={() => {
            const album = randomChoice(processedAlbums);
            setData({ show: true, albumId: album.id, kind: "viewing" });
          }}
          kind={"neutral"}
          className={`${styles.button} ${small ? styles.squareButton : ""}`}
          style={{
            opacity: deleting || editing ? 0.5 : 1,
            pointerEvents: deleting || editing ? "none" : "auto",
          }}
        >
          <DicesIcon size={20} />
          {!small && " Random"}
        </Button>

        <Button
          onClick={() => setEditing((p) => !p)}
          kind={editing ? "positive" : "neutral"}
          className={`${styles.button} ${small ? styles.squareButton : ""}`}
          style={{
            opacity: deleting ? 0.5 : 1,
            pointerEvents: deleting ? "none" : "auto",
          }}
        >
          {createElement(editing ? CancelIcon : TagAddIcon, {
            size: editing ? 20 : 18,
          })}
          {!small && (editing ? " Cancel" : " Edit")}
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
          className={`${styles.button} ${small ? styles.squareButton : ""}`}
          style={{
            opacity: editing ? 0.5 : 1,
            pointerEvents: editing ? "none" : "auto",
          }}
        >
          {createElement(deleting ? CancelIcon : TrashIcon, {
            size: deleting ? 20 : 18,
          })}
          {!small && (deleting ? " Cancel" : " Delete")}
        </Button>

        {deleting && (
          <Button
            onClick={() => {
              albumIdsToDelete.map((albumId) =>
                deleteAlbum(albumId, albums, setAlbums),
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
              value={searchQuery}
              onChange={(e) =>
                setSearchParams((p) => {
                  p.set("searchAlbums", e.target.value);
                  return p;
                })
              }
              placeholder="Search albums..."
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
            {filteredTags.length ? (
              filteredTags.map((tag) => (
                <TagPill
                  tag={tag}
                  size={0.75}
                  showState
                  selectable={showFilter}
                  selected={tagFilter.some((t) => t.id == tag.id)}
                  quantity
                  key={tag.id}
                  onClick={(selected) =>
                    setTagFilter((p) =>
                      selected && !p.some((t) => t.id === tag.id)
                        ? [...p, tag]
                        : p.filter((t) => t.id !== tag.id),
                    )
                  }
                />
              ))
            ) : (
              <TagPill
                tag={{
                  id: "N/A",
                  name: tags.length
                    ? "No tags match this search query."
                    : "You don't have any tags.",
                  userId: "N/A",
                  createdAt: "N/A",
                }}
                size={0.75}
              />
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
          <div className={styles.searchInput}>
            <SearchIcon />
            <input
              className={styles.textInput}
              type="text"
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
              placeholder="Search tags..."
            />
            <Button
              kind="neutral"
              border
              className={styles.clearFilters}
              onClick={() => setFilterAny((p) => !p)}
            >
              {createElement(filterAny ? ListTodoIcon : ListChecksIcon, {
                size: filterAny ? 16 : 18,
              })}{" "}
              {filterAny ? "Any" : "All"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
