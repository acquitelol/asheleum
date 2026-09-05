import type { Album } from "@/context/AlbumContext";
import styles from "./AlbumCard.module.css";
import TagPill from "../tags/TagPill";
import { useTags } from "@/context/TagContext";
import { useNavigate } from "react-router-dom";
import TagPile from "../tags/TagPile";

export default function AlbumCard({ album }: { album: Album }) {
  const { setTagFilter } = useTags();
  const navigate = useNavigate();

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
          <TagPile tags={album.tags} size={0.75} />
        </div>
      </div>
    </div>
  );
}
