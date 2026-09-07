import Button from "@/components/Button";
import styles from "./Login.module.css";
import { signIn } from "@/lib/auth";
import TagIcon from "@/components/icons/TagIcon";

export default function () {
  return (
    <div className={styles.container}>
      <TagIcon size={160} />
      <h1 className={styles.title}>Asheleum</h1>
      <Button onClick={signIn} border>
        Google Sign In
      </Button>
    </div>
  );
}
