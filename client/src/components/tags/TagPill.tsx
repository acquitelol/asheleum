import { createElement } from "react";
import styles from "./TagPill.module.css";
import ConfirmIcon from "../icons/ConfirmIcon";
import CancelIcon from "../icons/CancelIcon";
import { useTags, type Tag } from "@/context/TagContext";
import { useAlbums } from "@/context/AlbumContext";

export default function TagPill({
  tag,
  size,
  showState = false,
  showIcon = false,
  selectable = false,
  clickable = false,
  quantity = false,
  onClick = (..._) => {},
  selected = false,
}: {
  tag: Tag;
  size: number;
  showState?: boolean;
  showIcon?: boolean;
  selectable?: boolean;
  clickable?: boolean;
  quantity?: boolean;
  onClick?: (boolean) => any;
  selected?: boolean;
}) {
  const { albums } = useAlbums();

  return (
    <span
      style={{
        fontSize: `${size}em`,
        pointerEvents: selectable || clickable ? "auto" : "none",
        userSelect: selectable || clickable ? "none" : "auto",
        backgroundColor:
          showState && selected
            ? "var(--color-primary)"
            : "var(--color-surface-above)",
      }}
      onClick={() =>
        selectable ? onClick(!selected) : clickable ? onClick(true) : null
      }
      className={styles.tagPill}
    >
      {showIcon
        ? createElement(showState && selected ? ConfirmIcon : CancelIcon, {
            size: 20 * size,
          })
        : ""}
      {showIcon ? " " : ""}
      {tag.name}
      {quantity && (
        <span
          className={`${styles.quantity} ${showState && selected ? styles.selectedQuantity : ""}`}
        >
          {albums
            ? albums.filter((album) => album.tags.some((t) => t.id === tag.id))
                .length
            : "N/A"}
        </span>
      )}
    </span>
  );
}
