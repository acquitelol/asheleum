import { useTags, type Tag } from "@/context/TagContext";
import { useNavigate } from "react-router-dom";
import styles from "./TagPile.module.css";
import TagPill from "./TagPill";
import { useMedia } from "@/context/MediaContext";

export default function TagPile({
  tags,
  size = 1,
  showState = false,
  sortBySelected = false,
  selected = () => false,
  shortenWhenSmall = true,
}: {
  tags: Tag[];
  size?: number;
  showState?: boolean;
  sortBySelected?: boolean;
  selected?: (t: Tag) => boolean;
  shortenWhenSmall?: boolean;
}) {
  const { tagFilter, setTagFilter } = useTags();
  const { small } = useMedia();
  const navigate = useNavigate();
  const max_shown = shortenWhenSmall && small ? 0 : 2;

  const sortedTags =
    sortBySelected && tagFilter.length
      ? tags.toSorted((a, b) => Number(selected(b)) - Number(selected(a)))
      : tags;

  return (
    <div className={styles.container}>
      {sortedTags.slice(0, max_shown).map((tag) => (
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
      {sortedTags.length > max_shown ? (
        <TagPill
          tag={{
            id: "N/A",
            name: `${max_shown > 0 ? "+" : ""}${tags.length - max_shown}`,
            userId: "N/A",
            createdAt: "N/A",
          }}
          size={size}
          showState={showState}
          selected={sortedTags.slice(max_shown).some(selected)}
        />
      ) : null}
    </div>
  );
}
