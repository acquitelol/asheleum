import styles from "./Button.module.css";

export default function Button({
  children,
  kind = "positive",
  type = "button",
  onClick,
  style = {},
  className = "",
}: React.PropsWithChildren<{
  kind?: "positive" | "negative";
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: () => any;
  style?: React.CSSProperties;
  className?: string;
}>) {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${styles[kind]} ${className}`}
      style={style}
      type={type}
    >
      {children}
    </button>
  );
}
