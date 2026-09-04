import CondensedAlbums from "@/components/albums/CondensedAlbums";
import Loading from "@/components/Loading";
import Navigation from "@/components/navigation/Navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./App.module.css";

export default function () {
  const { user, loading: loadingUser } = useAuth();

  return loadingUser ? (
    <Loading />
  ) : (
    <div>
      <main>
        <div className={styles.titleContainer}>
          <h1>Welcome back, {user.name.split(" ")?.[0]}!</h1>
        </div>
        <CondensedAlbums />
      </main>
      <Navigation />
    </div>
  );
}
