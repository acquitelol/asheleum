import { createElement } from "react";
import styles from "./TagPill.module.css";
import ConfirmIcon from "../icons/ConfirmIcon";
import CancelIcon from "../icons/CancelIcon";
import { useTags, type Tag } from "@/context/TagContext";
import { useAlbums } from "@/context/AlbumContext";

export default function TagPill({
  tag,
  size,
  selectable = false,
  clickable = false,
  quantity = false,
  onClick = (..._) => {},
  selected = false,
}: {
  tag: Tag;
  size: number;
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
          (selectable || clickable) && selected
            ? "var(--color-primary)"
            : "var(--color-surface-above)",
      }}
      onClick={() =>
        selectable ? onClick(!selected) : clickable ? onClick(true) : null
      }
      className={styles.tagPill}
    >
      {selectable
        ? createElement(selected ? ConfirmIcon : CancelIcon, {
            size: 20 * size,
          })
        : ""}
      {selectable ? " " : ""}
      {tag.name}
      {quantity && (
        <span
          className={`${styles.quantity} ${selectable && selected ? styles.selectedQuantity : ""}`}
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
