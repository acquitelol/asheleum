import { useSearchParams } from "react-router-dom";
import Button from "../Button";
import styles from "./AlbumKindFilter.module.css";

export const ALBUM_FORMATS = ["Album", "EP", "Single", "Playlist"] as const;

export default function AlbumKindFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className={styles.entityTypes}>
      {ALBUM_FORMATS.map((format) => (
        <Button
          onClick={() =>
            setSearchParams((p) => {
              const existing = p.get("format") ?? "";
              const parts = existing.split(",");
              p.set(
                "format",
                (parts.includes(format)
                  ? parts.filter((p) => p !== format)
                  : [...parts, format]
                ).join(","),
              );

              return p;
            })
          }
          key={format}
          className={`${styles.entity} ${(searchParams.get("format") ?? "").includes(format) ? styles.selected : ""}`}
        >
          {format}
        </Button>
      ))}
    </div>
  );
}
