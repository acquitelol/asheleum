import styles from "./Button.module.css";

export default function Button({
  children,
  type,
  onClick,
  style = {},
  className = "",
}: {
  children: string;
  type: "positive" | "negative";
  onClick: () => any;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${styles[type]} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
