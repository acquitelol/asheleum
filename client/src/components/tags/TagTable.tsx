import { useTags } from "@/context/TagContext";
import styles from "./TagTable.module.css";
import Loading from "../Loading";
// import AlbumRow from "./AlbumRow";
import { createElement } from "react";
import { NoExist, NoFound } from "../NoExist";
import TagIcon from "../icons/TagIcon";
import TagPill from "./TagPill";
import { useNavigate } from "react-router-dom";

export default function TagTable() {
  const {
    tags,
    processedTags,
    setTagFilter,
    deleting,
    tagIdsToDelete,
    setTagIdsToDelete,
    loading,
  } = useTags();
  const navigate = useNavigate();

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.tagTable}>
      {processedTags && processedTags.length ? (
        <div className={styles.tagList}>
          {processedTags.map((tag) => (
            <TagPill
              tag={tag}
              size={1}
              selectable={deleting}
              clickable
              selected={deleting && tagIdsToDelete.includes(tag.id)}
              quantity
              key={tag.id}
              onClick={() => {
                if (deleting) {
                  setTagIdsToDelete((tags) =>
                    tags.includes(tag.id)
                      ? tags.filter((tagId) => tagId !== tag.id)
                      : [...tags, tag.id],
                  );

                  return;
                }

                setTagFilter([tag]);
                navigate("/albums?filter=true");
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
