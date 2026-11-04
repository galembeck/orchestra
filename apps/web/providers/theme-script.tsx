"use client";

import { THEME_INIT_SCRIPT } from "@orchestra/shared/constants/theme";

const EXECUTABLE_SCRIPT_TYPE = "text/javascript";
const INERT_SCRIPT_TYPE = "application/json";

export function ThemeScript() {
  const isServerRender = typeof window === "undefined";

  return (
    <script
      suppressHydrationWarning
      type={isServerRender ? EXECUTABLE_SCRIPT_TYPE : INERT_SCRIPT_TYPE}
    >
      {THEME_INIT_SCRIPT}
    </script>
  );
}
