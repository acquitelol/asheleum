import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Navigation.module.css";

const ROUTES = [
  {
    name: "Home",
    path: "",
  },
  {
    name: "Albums",
    path: "albums",
  },
  {
    name: "Tags",
    path: "tags",
  },
];

export default function () {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  return user ? (
    <div className={styles.nav} style={{ zIndex: 2000 }}>
      <div className={styles.routes}>
        <div className={styles.routesContainer}>
          {ROUTES.map((route) => (
            <div
              className={styles.route}
              onClick={() =>
                navigate(`/${route.path}?${searchParams.toString()}`)
              }
              key={route.name}
            >
              {route.name}
            </div>
          ))}
        </div>
        <img
          src={user.image}
          className={styles.pfp}
          onClick={() => navigate("/account")}
        />
      </div>
    </div>
  ) : null;
}
