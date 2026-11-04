import {
  DARK_THEME_CLASS,
  THEME_STORAGE_KEY,
  THEMES,
  type Theme,
} from "@orchestra/shared/constants/theme";

const DARK_COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const isTheme = (value: string | null): value is Theme =>
  THEMES.some((theme) => theme === value);

export function getActiveTheme(): Theme {
  return document.documentElement.classList.contains(DARK_THEME_CLASS)
    ? "dark"
    : "light";
}

export function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch (error) {
    if (error instanceof DOMException) {
      return null;
    }
    throw error;
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia(DARK_COLOR_SCHEME_QUERY).matches ? "dark" : "light";
}

export function getPreferredTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function subscribeToSystemTheme(onChange: (theme: Theme) => void) {
  const mediaQueryList = window.matchMedia(DARK_COLOR_SCHEME_QUERY);
  const handleChange = () => onChange(getSystemTheme());
  mediaQueryList.addEventListener("change", handleChange);
  return () => mediaQueryList.removeEventListener("change", handleChange);
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    if (!(error instanceof DOMException)) {
      throw error;
    }
  }
}

export interface ApplyThemeOptions {
  persist?: boolean;
}

export function applyTheme(
  theme: Theme,
  { persist = true }: ApplyThemeOptions = {}
) {
  const root = document.documentElement;
  root.classList.toggle(DARK_THEME_CLASS, theme === "dark");
  root.style.colorScheme = theme;

  if (persist) {
    persistTheme(theme);
  }
}
