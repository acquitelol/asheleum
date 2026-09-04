import styles from "./TagPill.module.css";

export default function TagPill({
  name,
  size,
}: {
  name: string;
  size: number;
}) {
  return (
    <span
      style={{
        fontSize: `${size}em`,
      }}
      className={styles.tagPill}
    >
      {name}
    </span>
  );
}
