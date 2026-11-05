"use client";

import { LocaleSwitcher } from "@orchestra/ui/components/locale-switcher/locale-switcher";
import { ThemeToggle } from "@orchestra/ui/components/theme-toggle/theme-toggle";
import { useLocale, useTranslations } from "next-intl";
import { useLocaleChange } from "@/i18n/use-locale-change";

export function SiteControls() {
  const t = useTranslations();
  const locale = useLocale();
  const { changeLocale, isPending } = useLocaleChange();

  return (
    <>
      <LocaleSwitcher
        disabled={isPending}
        labels={{ menu: t("locale.label"), trigger: t("locale.select") }}
        locale={locale}
        onLocaleChange={changeLocale}
      />

      <ThemeToggle label={t("theme.toggle")} />
    </>
  );
}
