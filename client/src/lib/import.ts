import type { Album } from "@/context/AlbumContext";
import type { Tag } from "@/context/TagContext";
import { addTag, setAlbumTag } from "./tags";
import { addAlbum } from "./albums";
import type { Dispatch, SetStateAction } from "react";

export const importData = (
  albums: Album[],
  tags: Tag[],
  setAlbums: Dispatch<SetStateAction<Album[]>>,
  setTags: Dispatch<SetStateAction<Tag[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  setLoading(true);
  const input = document.createElement("input");
  input.type = "file";
  input.addEventListener("change", handleFileSelection);
  input.addEventListener("cancel", () => setLoading(false));

  function handleFileSelection(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const contents = e?.target?.result as string;
      const {
        albums: newAlbums,
        tags: newTags,
      }: { albums: Album[]; tags: Tag[] } = JSON.parse(contents);
      const tagMap = new Map<string, string>();

      for (const tag of newTags) {
        if (tags.some((t) => t.id === tag.id)) continue;
        try {
          const newTag = await addTag(null, tag.name, tags, () => {}, setTags);
          tagMap.set(tag.id, newTag.id);
          // this is very hacky but for the purposes of this
          // app it works fine i suppose
          // this is here because, despite addTag using setTags
          // to change the `tags` array, that wont change until
          // a rerender happens, and even then our `tags` in this
          // function is only a snapshot, which means the simplest
          // way to solve this is to push to our local snapshot
          // so that `setAlbumTag` can find the tag id and therefore
          // add our tag to the album correctly
          tags.push(newTag);
        } catch (error) {
          console.error(error);
        }
      }

      for (const album of newAlbums) {
        if (!albums.some((a) => a.id === album.id)) {
          await addAlbum(
            null,
            album.url,
            () => {},
            () => {},
            setAlbums,
          );
        }

        for (const tag of album.tags) {
          const newTagId = tagMap.get(tag.id);
          await setAlbumTag(newTagId!, album.id, albums, tags, setAlbums);
        }
      }

      setLoading(false);
    };

    reader.readAsText(file);
  }

  input.click();
};
