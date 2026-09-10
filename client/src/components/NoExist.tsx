import type React from "react";
import AlbumIcon from "./icons/AlbumIcon";
import styles from "./NoExist.module.css";
import TagIcon from "./icons/TagIcon";
import { useMedia } from "@/context/MediaContext";

export function NoExist({
  style = {},
  text = "albums",
  Icon = AlbumIcon,
}: {
  style?: React.CSSProperties;
  text?: string;
  Icon?: React.ComponentType<any>;
}) {
  const { small } = useMedia();

  return (
    <div className={styles.container} style={style}>
      <Icon size={20} />
      <p>
        You don't have any {text}.{small ? "" : " Go and get some! :("}
      </p>
    </div>
  );
}

export function NoFound({
  style = {},
  text = "albums",
  Icon = AlbumIcon,
}: {
  style?: React.CSSProperties;
  text?: string;
  Icon?: React.ComponentType<any>;
}) {
  const { small } = useMedia();

  return (
    <div className={styles.container} style={style}>
      <Icon size={20} />
      <p>
        No {text} matched your search query.{small ? "" : " Try again?"}
      </p>
    </div>
  );
}

export function NoFiltered({
  style = {},
  lhs = "tags",
  rhs = "album",
  Icon = TagIcon,
}: {
  style?: React.CSSProperties;
  lhs?: string;
  rhs?: string;
  Icon?: React.ComponentType<any>;
}) {
  return (
    <div className={styles.container} style={style}>
      <Icon size={20} />
      <p>
        No {lhs} are applied to this {rhs}.
      </p>
    </div>
  );
}
