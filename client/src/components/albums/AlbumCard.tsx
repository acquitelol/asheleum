import type { Album } from "@/context/AlbumContext";
import styles from "./AlbumCard.module.css";
import TagPill from "../tags/TagPill";

export default function AlbumCard({ album }: { album: Album }) {
  return (
    <div className={styles.albumCard}>
      <img
        className={styles.albumCard__cover}
        src={album.cover}
        alt={`${album.name} cover`}
      />

      <div className={styles.albumCard__content}>
        <div className={styles.albumCard__artist}>
          {album.type} | {album.artist}
        </div>

        <div
          className={styles.albumCard__title}
          onClick={() => window.open(album.url, "_blank")}
        >
          {album.name} ⇗
        </div>

        <div className={styles.albumCard__tags}>
          {album.tags.slice(0, 3).map((tag) => (
            <TagPill name={tag.name} size={0.5} key={tag.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
