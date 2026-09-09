import styles from "./AccountInput.module.css";

export default function AccountInput({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div>
      <h3>{name}:</h3>
      <input
        className={styles.textInput}
        type="text"
        value={value}
        disabled={true}
      />
    </div>
  );
}
