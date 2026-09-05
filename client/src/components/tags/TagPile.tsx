import { useTags, type Tag } from "@/context/TagContext";
import { useNavigate } from "react-router-dom";
import styles from "./TagPile.module.css";
import TagPill from "./TagPill";

const MAX_SHOWN = 2;

export default function TagPile({
  tags,
  size = 1,
  selected = () => false,
}: {
  tags: Tag[];
  size?: number;
  selected?: (t: Tag) => boolean;
}) {
  const { setTagFilter } = useTags();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {tags.slice(0, MAX_SHOWN).map((tag) => (
        <TagPill
          tag={tag}
          size={size}
          key={tag.id}
          clickable
          selected={selected(tag)}
          onClick={() => {
            setTagFilter([tag]);
            navigate("/albums?filter=true");
          }}
        />
      ))}
      {tags.length > MAX_SHOWN ? (
        <TagPill
          tag={{
            id: "N/A",
            name: `+${tags.length - MAX_SHOWN}`,
            userId: "N/A",
            createdAt: "N/A",
          }}
          size={size}
        />
      ) : null}
    </div>
  );
}
