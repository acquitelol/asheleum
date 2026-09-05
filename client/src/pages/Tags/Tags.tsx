import Navigation from "@/components/navigation/Navigation";
import styles from "./Tags.module.css";
import TagInput from "@/components/tags/TagInput";
import TagActions from "@/components/tags/TagActions";
import TagTable from "@/components/tags/TagTable";
// import AlbumTable from "@/components/albums/AlbumTable";
// import AlbumActions from "@/components/albums/AlbumActions";

export default function () {
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
        <TagTable />
      </main>
      <Navigation />
    </div>
  );
}
