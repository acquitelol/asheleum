import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAlbums } from "@/lib/albums";
import { useTags, type Tag } from "./TagContext";
import { useSearchParams } from "react-router-dom";
import type { ALBUM_FORMATS } from "@/components/albums/AlbumKindFilter";

export type Album = {
  id: string;
  name: string;
  type: string;
  artist: string;
  cover: string;
  url: string;
  createdAt: string;
  tags: Tag[];
};

type AlbumContextType = {
  albums: Album[];
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  sortDir: boolean;
  searchQuery: string;
  formatQuery: (keyof typeof ALBUM_FORMATS)[];
  deleting: boolean;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  albumIdsToDelete: string[];
  setAlbumIdsToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  processedAlbums: Album[];
  loading: boolean;
};

const AlbumContext = createContext<AlbumContextType | null>(null);

export function AlbumProvider({ children }: { children: React.ReactNode }) {
  const [albumIdsToDelete, setAlbumIdsToDelete] = useState<string[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { tagFilter } = useTags();

  // false == desc, true == asc
  const sortDir = searchParams.get("sort") === "asc";
  const searchQuery = searchParams.get("search") ?? "";
  const formatQuery = (searchParams.get("format") ?? "")
    .split(",")
    .filter(Boolean);

  useEffect(() => {
    // setLoading(false);
    getAlbums()
      .then(setAlbums)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const processedAlbums = useMemo(() => {
    const formatFiltered =
      formatQuery.length && !loading
        ? albums.filter((album) =>
            formatQuery.some(
              (kind) =>
                album.type.toLocaleLowerCase() === kind.toLocaleLowerCase(),
            ),
          )
        : albums;

    const tagFiltered =
      tagFilter.length && !loading
        ? formatFiltered.filter((album) =>
            tagFilter.every((t) => album.tags.some((tag) => tag.id === t.id)),
          )
        : formatFiltered;

    const queryFiltered =
      searchQuery !== "" && tagFiltered
        ? tagFiltered.filter((album) =>
            album.name
              .toLocaleLowerCase()
              .includes(searchQuery.toLocaleLowerCase()),
          )
        : tagFiltered;

    return sortDir && queryFiltered
      ? queryFiltered.toReversed()
      : queryFiltered;
  }, [albums, loading, tagFilter, sortDir, searchQuery, formatQuery]);

  return (
    <AlbumContext.Provider
      value={{
        albums,
        setAlbums,
        sortDir,
        searchQuery,
        formatQuery: formatQuery as any[],
        deleting,
        setDeleting,
        albumIdsToDelete,
        setAlbumIdsToDelete,
        processedAlbums,
        loading,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
}

export function useAlbums() {
  const context = useContext(AlbumContext);

  if (!context) {
    throw new Error("useAlbums must be used inside AlbumProvider");
  }

  return context;
}
