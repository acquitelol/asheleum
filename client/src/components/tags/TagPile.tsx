import { useTags, type Tag } from "@/context/TagContext";
import { useNavigate } from "react-router-dom";
import styles from "./TagPile.module.css";
import TagPill from "./TagPill";

const MAX_SHOWN = 2;

export default function TagPile({
  tags,
  size = 1,
  showState = false,
  sortBySelected = false,
  selected = () => false,
}: {
  tags: Tag[];
  size?: number;
  showState?: boolean;
  sortBySelected?: boolean;
  selected?: (t: Tag) => boolean;
}) {
  const { tagFilter, setTagFilter } = useTags();
  const navigate = useNavigate();

  const sortedTags =
    sortBySelected && tagFilter.length
      ? tags.toSorted((a, b) => Number(selected(b)) - Number(selected(a)))
      : tags;

  return (
    <div className={styles.container}>
      {sortedTags.slice(0, MAX_SHOWN).map((tag) => (
        <TagPill
          tag={tag}
          size={size}
          key={tag.id}
          clickable
          showState={showState}
          selected={selected(tag)}
          onClick={() => {
            setTagFilter([tag]);
            navigate("/albums?filterAlbums=true");
          }}
        />
      ))}
      {sortedTags.length > MAX_SHOWN ? (
        <TagPill
          tag={{
            id: "N/A",
            name: `+${tags.length - MAX_SHOWN}`,
            userId: "N/A",
            createdAt: "N/A",
          }}
          size={size}
          showState={showState}
          selected={sortedTags.slice(MAX_SHOWN).some(selected)}
        />
      ) : null}
    </div>
  );
}
