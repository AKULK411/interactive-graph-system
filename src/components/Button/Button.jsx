import "./Button.css";

// Только визуальная кнопка-макет; обработчика действия нет.
export default function Button({ children, variant = "primary", className = "" }) {
  return <span className={`uiButton uiButton--${variant} ${className}`.trim()}>{children}</span>;
}
