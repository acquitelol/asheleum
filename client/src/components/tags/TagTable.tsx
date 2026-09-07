import { useTags, type Tag } from "@/context/TagContext";
import styles from "./TagTable.module.css";
import Loading from "../Loading";
// import AlbumRow from "./AlbumRow";
import { createElement, type CSSProperties } from "react";
import { NoExist, NoFound } from "../NoExist";
import TagIcon from "../icons/TagIcon";
import TagPill from "./TagPill";
import { useNavigate } from "react-router-dom";

export default function TagTable({
  style = {},
  showState = false,
  showIcon = false,
  selectable = () => false,
  clickable = () => true,
  selected,
  quantity = true,
  onClick,
}: {
  style?: CSSProperties;
  showState?: boolean;
  showIcon?: boolean;
  selectable: (_: Tag) => boolean;
  clickable?: (_: Tag) => boolean;
  selected: (_: Tag) => boolean;
  quantity?: boolean;
  onClick?: (_: Tag) => any;
}) {
  const {
    tags,
    processedTags,
    setTagFilter,
    deleting,
    setTagIdsToDelete,
    loading,
  } = useTags();
  const navigate = useNavigate();

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.tagTable} style={style}>
      {processedTags && processedTags.length ? (
        <div className={styles.tagList}>
          {processedTags.map((tag) => (
            <TagPill
              tag={tag}
              size={1}
              showState={showState}
              showIcon={showIcon}
              selectable={selectable(tag)}
              clickable={clickable(tag)}
              selected={selected(tag)}
              quantity={quantity}
              key={tag.id}
              onClick={() => {
                if (onClick) {
                  onClick(tag);
                  return;
                }

                if (deleting) {
                  setTagIdsToDelete((tags) =>
                    tags.includes(tag.id)
                      ? tags.filter((tagId) => tagId !== tag.id)
                      : [...tags, tag.id],
                  );

                  return;
                }

                if (!clickable(tag)) return;
                setTagFilter([tag]);
                navigate("/albums?filterAlbums=true");
              }}
            />
          ))}
        </div>
      ) : (
        createElement(tags.length ? NoFound : NoExist, {
          style: { margin: "1em" },
          text: "tags",
          Icon: TagIcon,
        })
      )}
    </div>
  );
}
