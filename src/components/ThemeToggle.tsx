import { useTheme } from "../context/themeContextValue";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className="btn"
      aria-label="切換主題"
      title={theme === "dark" ? "切換到淺色模式" : "切換到深色模式"}
    >
      {theme === "dark" ? (
        <span aria-hidden>☀️ 淺色</span>
      ) : (
        <span aria-hidden>🌙 深色</span>
      )}
    </button>
  );
}
