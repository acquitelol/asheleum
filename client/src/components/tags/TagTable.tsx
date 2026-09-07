import { useTags, type Tag } from "@/context/TagContext";
import styles from "./TagTable.module.css";
import Loading from "../Loading";
// import AlbumRow from "./AlbumRow";
import { createElement, useMemo, type CSSProperties } from "react";
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
  customTagFilter = () => true,
  CustomMissingComponent = () => null,
}: {
  style?: CSSProperties;
  showState?: boolean;
  showIcon?: boolean;
  selectable: (_: Tag) => boolean;
  clickable?: (_: Tag) => boolean;
  selected: (_: Tag) => boolean;
  quantity?: boolean;
  onClick?: (_: Tag) => any;
  customTagFilter?: (_: Tag) => boolean;
  CustomMissingComponent?: React.ComponentType<any>;
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
  const filteredTags = useMemo(
    () => processedTags.filter(customTagFilter),
    [customTagFilter, processedTags],
  );

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.tagTable} style={style}>
      {filteredTags && filteredTags.length ? (
        <div className={styles.tagList}>
          {filteredTags.map((tag) => (
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
        createElement(
          CustomMissingComponent ?? (tags.length ? NoFound : NoExist),
          {
            style: { margin: "1em" },
            text: "tags",
            Icon: TagIcon,
          },
        )
      )}
    </div>
  );
}
