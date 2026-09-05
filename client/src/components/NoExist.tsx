import type React from "react";
import AlbumIcon from "./icons/AlbumIcon";
import styles from "./NoExist.module.css";

export function NoExist({
  style = {},
  text = "albums",
  Icon = AlbumIcon,
}: {
  style?: React.CSSProperties;
  text?: string;
  Icon?: React.ComponentType<any>;
}) {
  return (
    <div className={styles.container} style={style}>
      <Icon size={20} />
      <p>You don't have any {text}. Go and get some! :(</p>
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
  return (
    <div className={styles.container} style={style}>
      <Icon size={20} />
      <p>No {text} matched your search query. Try again?</p>
    </div>
  );
}
