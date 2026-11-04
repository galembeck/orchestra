import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { ThemeSync } from "@/providers/theme-sync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider>
      <ThemeSync />

      {children}
    </NextIntlClientProvider>
  );
}
