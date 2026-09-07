import Navigation from "@/components/navigation/Navigation";
import styles from "./Tags.module.css";
import TagInput from "@/components/tags/TagInput";
import TagActions from "@/components/tags/TagActions";
import TagTable from "@/components/tags/TagTable";
import { useTags } from "@/context/TagContext";

export default function () {
  const { deleting, tagIdsToDelete } = useTags();

  return (
    <div>
      <main>
        <div className={styles.titleContainer}>
          <h1>Tags</h1>
        </div>
        <div className={styles.addTagContainer}>
          <TagInput />
        </div>
        <TagActions />
        <TagTable
          showState
          showIcon={deleting}
          selectable={() => deleting}
          selected={(tag) => deleting && tagIdsToDelete.includes(tag.id)}
        />
      </main>
      <Navigation />
    </div>
  );
}
