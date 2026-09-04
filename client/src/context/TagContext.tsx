import { createContext, useContext, useEffect, useState } from "react";
import { getTags } from "@/lib/tags";

export type Tag = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
};

type TagContextType = {
  tags: Tag[] | null;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  tagFilter: string[];
  setTagFilter: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
};

const TagContext = createContext<TagContextType | null>(null);

export function TagProvider({ children }: { children: React.ReactNode }) {
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  useEffect(() => {
    getTags()
      .then(setTags)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <TagContext.Provider
      value={{ tags, setTags, tagFilter, setTagFilter, loading }}
    >
      {children}
    </TagContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagContext);

  if (!context) {
    throw new Error("useAlbums must be used inside AlbumProvider");
  }

  return context;
}
