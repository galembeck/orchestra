export const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_STORAGE_KEY = "orchestra-theme";

export const DARK_THEME_CLASS = "dark";

export const THEME_INIT_SCRIPT = `(() => {
  try {
    const stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    const isDark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const root = document.documentElement;
    root.classList.toggle("${DARK_THEME_CLASS}", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  } catch {
    document.documentElement.style.colorScheme = "light";
  }
})();`;
