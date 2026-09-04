import CondensedAlbums from "@/components/albums/CondensedAlbums";
import Loading from "@/components/Loading";
import Navigation from "@/components/navigation/Navigation";
import { useAuth } from "@/context/AuthContext";

export default function () {
  const { user, loading: loadingUser } = useAuth();

  return loadingUser ? (
    <Loading />
  ) : (
    <div>
      <Navigation />
      <main>
        <h1>Welcome back, {user.name.split(" ")?.[0]}!</h1>
        <CondensedAlbums />
      </main>
    </div>
  );
}
