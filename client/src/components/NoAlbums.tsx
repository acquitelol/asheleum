import type React from "react";
import AlbumIcon from "./icons/AlbumIcon";
import styles from "./NoAlbums.module.css";

export function NoAlbumsExist({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div className={styles.container} style={style}>
      <AlbumIcon size={20} />
      <p>You don't have any albums. Go and get some! :(</p>
    </div>
  );
}

export function NoAlbumsFound({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div className={styles.container} style={style}>
      <AlbumIcon size={20} />
      <p>No albums matched your search query. Try again?</p>
    </div>
  );
}
