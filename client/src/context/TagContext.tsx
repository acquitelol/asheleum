import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTags } from "@/lib/tags";
import { useSearchParams } from "react-router-dom";

export type Tag = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
};

type TagContextType = {
  tags: Tag[] | null;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  tagFilter: Tag[];
  setTagFilter: React.Dispatch<React.SetStateAction<Tag[]>>;
  sortDir: boolean;
  searchQuery: string;
  deleting: boolean;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  tagIdsToDelete: string[];
  setTagIdsToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  processedTags: Tag[] | null;
  loading: boolean;
};

const TagContext = createContext<TagContextType | null>(null);

export function TagProvider({ children }: { children: React.ReactNode }) {
  const [tagIdsToDelete, setTagIdsToDelete] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<Tag[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchParams] = useSearchParams();

  // false == desc, true == asc
  const sortDir = searchParams.get("sort") === "asc";
  const searchQuery = searchParams.get("search") ?? "";

  useEffect(() => {
    // setLoading(false);
    getTags()
      .then(setTags)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const processedTags = useMemo(() => {
    const queryFiltered =
      searchQuery !== "" && tags
        ? tags.filter((tag) =>
            tag.name
              .toLocaleLowerCase()
              .includes(searchQuery.toLocaleLowerCase()),
          )
        : tags;

    return sortDir && queryFiltered
      ? queryFiltered.toReversed()
      : queryFiltered;
  }, [tags, loading, sortDir, searchQuery]);

  return (
    <TagContext.Provider
      value={{
        tags,
        setTags,
        tagFilter,
        setTagFilter,
        processedTags,
        searchQuery,
        sortDir,
        deleting,
        setDeleting,
        tagIdsToDelete,
        setTagIdsToDelete,
        loading,
      }}
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
