import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAlbums } from "@/lib/albums";
import { useTags } from "./TagContext";

export type Album = {
  id: string;
  name: string;
  type: string;
  artist: string;
  cover: string;
  url: string;
  createdAt: string;
  tags: {
    id: string;
    name: string;
  }[];
};

type AlbumContextType = {
  albums: Album[] | null;
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  sortDir: boolean;
  setSortDir: React.Dispatch<React.SetStateAction<boolean>>;
  deleting: boolean;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  albumIdsToDelete: string[];
  setAlbumIdsToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  processedAlbums: Album[] | null;
  loading: boolean;
};

const AlbumContext = createContext<AlbumContextType | null>(null);

export function AlbumProvider({ children }: { children: React.ReactNode }) {
  const [albumIdsToDelete, setAlbumIdsToDelete] = useState<string[]>([]);
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { tagFilter } = useTags();

  // false == asc, true == desc
  const [sortDir, setSortDir] = useState(false);

  useEffect(() => {
    getAlbums()
      .then(setAlbums)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const processedAlbums = useMemo(() => {
    const res =
      tagFilter.length && !loading
        ? albums.filter((album) =>
            tagFilter.every((tagId) =>
              album.tags.some((tag) => tag.id === tagId),
            ),
          )
        : albums;

    return sortDir ? res.toReversed() : res;
  }, [albums, loading, tagFilter, sortDir]);

  return (
    <AlbumContext.Provider
      value={{
        albums,
        setAlbums,
        sortDir,
        setSortDir,
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
