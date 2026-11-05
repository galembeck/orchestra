"use client";

import { isAuthErrorKey } from "@orchestra/shared/constants/auth";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export function useAuthErrorMessage() {
  const t = useTranslations("auth.errors");

  return useCallback(
    (key: string | undefined): string | undefined => {
      if (key === undefined) {
        return;
      }

      return isAuthErrorKey(key) ? t(key) : t("generic");
    },
    [t]
  );
}
