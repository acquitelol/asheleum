import Navigation from "@/components/navigation/Navigation";
import styles from "./Albums.module.css";
import AlbumInput from "@/components/albums/AlbumInput";
import AlbumTable from "@/components/albums/AlbumTable";
import AlbumActions from "@/components/albums/AlbumActions";

export default function () {
  return (
    <div>
      <main>
        <div className={styles.titleContainer}>
          <h1>Albums</h1>
        </div>
        <div className={styles.addAlbumContainer}>
          <AlbumInput />
        </div>
        <AlbumActions />
        <AlbumTable />
      </main>
      <Navigation />
    </div>
  );
}
