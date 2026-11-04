"use client";

import type { Locale } from "@orchestra/shared/constants/i18n";
import { useCallback, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

export function useLocaleChange() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const changeLocale = useCallback(
    (locale: Locale) => {
      startTransition(() => {
        router.replace(pathname, { locale, scroll: false });
      });
    },
    [pathname, router]
  );

  return { changeLocale, isPending };
}
