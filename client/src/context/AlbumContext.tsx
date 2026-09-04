import { createContext, useContext, useEffect, useState } from "react";
import { getAlbums } from "@/lib/albums";

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
  loading: boolean;
};

const AlbumContext = createContext<AlbumContextType | null>(null);

export function AlbumProvider({ children }: { children: React.ReactNode }) {
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlbums()
      .then((data) => setAlbums(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AlbumContext.Provider value={{ albums, setAlbums, loading }}>
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
