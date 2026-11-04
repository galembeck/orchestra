"use client";

import type { Theme } from "@orchestra/shared/constants/theme";
import { applyTheme, getActiveTheme } from "@orchestra/shared/utils/theme";
import { useCallback, useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["class"] });
  return () => observer.disconnect();
};

const getServerSnapshot = (): Theme => "light";

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getActiveTheme,
    getServerSnapshot
  );

  const setTheme = useCallback((nextTheme: Theme) => {
    applyTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(getActiveTheme() === "dark" ? "light" : "dark");
  }, []);

  return { setTheme, theme, toggleTheme };
}
