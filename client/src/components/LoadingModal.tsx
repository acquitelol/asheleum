import { Outlet } from "react-router-dom";
import AlbumIcon from "./icons/AlbumIcon";
import styles from "./LoadingModal.module.css";
import { useAuth } from "@/context/AuthContext";

export default function () {
  const { user, loading } = useAuth();

  return (
    <>
      {user && <Outlet />}
      <div
        className={styles.container}
        style={{
          opacity: loading ? 1 : 0,
          userSelect: loading ? "auto" : "none",
          pointerEvents: loading ? "auto" : "none",
        }}
      >
        <AlbumIcon
          size={120}
          className={`${styles.icon} ${loading ? "" : styles.stop}`}
        />
        <h1>Loading...</h1>
      </div>
    </>
  );
}
