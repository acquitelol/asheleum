import styles from "./Button.module.css";

export default function Button({
  children,
  kind = "positive",
  type = "button",
  onClick,
  style = {},
  className = "",
  border = false,
}: React.PropsWithChildren<{
  kind?: "positive" | "negative" | "neutral";
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: () => any;
  style?: React.CSSProperties;
  className?: string;
  border?: boolean;
}>) {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${styles[kind]} ${className} ${border ? styles.border : ""}`}
      style={style}
      type={type}
    >
      {children}
    </button>
  );
}
