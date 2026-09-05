import { useTags } from "@/context/TagContext";
import styles from "./TagInput.module.css";
import { useState } from "react";
import Button from "@/components/Button";
import { addTag } from "@/lib/tags";
import TagAddIcon from "../icons/TagAddIcon";

export default function AlbumInput() {
  const [tagName, setTagName] = useState("");
  const { setTags } = useTags();

  return (
    <>
      <h3>Add a new tag:</h3>
      <form
        className={styles.inputForm}
        onSubmit={(e) => addTag(e, tagName, setTagName, setTags)}
      >
        <input
          className={styles.textInput}
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Tag Name"
        />
        <Button type="submit" border className={styles.button}>
          <TagAddIcon size={18} />
          Add
        </Button>
      </form>
    </>
  );
}
