import AlbumIcon from "./icons/AlbumIcon";
import styles from "./Loading.module.css";

export default function () {
  return (
    <div className={styles.container}>
      <AlbumIcon size={120} className={styles.icon} />
      <h1>Loading...</h1>
    </div>
  );
}
