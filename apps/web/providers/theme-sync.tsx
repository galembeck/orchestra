"use client";

import {
  applyTheme,
  getPreferredTheme,
  getStoredTheme,
  subscribeToSystemTheme,
} from "@orchestra/shared/utils/theme";
import { useEffect, useLayoutEffect } from "react";

export function ThemeSync() {
  useLayoutEffect(() => {
    applyTheme(getPreferredTheme(), { persist: false });
  }, []);

  useEffect(
    () =>
      subscribeToSystemTheme((systemTheme) => {
        if (getStoredTheme() === null) {
          applyTheme(systemTheme, { persist: false });
        }
      }),
    []
  );

  return null;
}
