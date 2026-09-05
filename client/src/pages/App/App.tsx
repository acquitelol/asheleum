import CondensedAlbums from "@/components/albums/CondensedAlbums";
import Loading from "@/components/Loading";
import Navigation from "@/components/navigation/Navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./App.module.css";
import TagActions from "@/components/tags/TagActions";
import TagTable from "@/components/tags/TagTable";

export default function () {
  const { user, loading } = useAuth();

  return loading ? (
    <Loading />
  ) : (
    <div>
      <main>
        <div className={styles.titleContainer}>
          <h1>Welcome back, {user.name.split(" ")?.[0]}!</h1>
        </div>
        <CondensedAlbums />
        <TagActions home />
        <TagTable />
      </main>
      <Navigation />
    </div>
  );
}
