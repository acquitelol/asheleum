import { createElement } from "react";
import styles from "./TagPill.module.css";
import ConfirmIcon from "../icons/ConfirmIcon";
import CancelIcon from "../icons/CancelIcon";
import { useTags, type Tag } from "@/context/TagContext";

export default function TagPill({
  tag,
  size,
  selectable = false,
  clickable = false,
  onClick = (..._) => {},
}: {
  tag: Tag;
  size: number;
  selectable?: boolean;
  clickable?: boolean;
  onClick?: (boolean) => any;
}) {
  const { tagFilter } = useTags();
  const selected = tagFilter.some((t) => t.id == tag.id);

  return (
    <span
      style={{
        fontSize: `${size}em`,
        pointerEvents: selectable || clickable ? "auto" : "none",
        userSelect: selectable || clickable ? "none" : "auto",
        backgroundColor:
          (selectable && selected) ||
          (clickable && tagFilter.some((t) => t.id === tag.id))
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
            size: 24 * size,
          })
        : ""}
      {selectable ? " " : ""}
      {tag.name}
    </span>
  );
}
