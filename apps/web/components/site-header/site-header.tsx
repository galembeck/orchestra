"use client";

import {
  BUSINESS_SIGN_UP_LINK,
  NAV_ITEMS,
  SIGN_IN_LINK,
} from "@orchestra/shared/constants/navigation";
import { LocaleSwitcher } from "@orchestra/ui/components/locale-switcher/locale-switcher";
import { Navbar } from "@orchestra/ui/components/navbar/navbar";
import { ThemeToggle } from "@orchestra/ui/components/theme-toggle/theme-toggle";
import { useLocale, useTranslations } from "next-intl";
import { localizeHref } from "@/i18n/localize-href";
import { useLocaleChange } from "@/i18n/use-locale-change";

export function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const { changeLocale, isPending } = useLocaleChange();

  const items = NAV_ITEMS.map(({ href, labelKey }) => ({
    href: localizeHref(href, locale),
    label: t(`navigation.items.${labelKey}`),
  }));

  return (
    <Navbar
      controls={
        <>
          <LocaleSwitcher
            disabled={isPending}
            labels={{ menu: t("locale.label"), trigger: t("locale.select") }}
            locale={locale}
            onLocaleChange={changeLocale}
          />

          <ThemeToggle label={t("theme.toggle")} />
        </>
      }
      cta={{
        href: localizeHref(BUSINESS_SIGN_UP_LINK.href, locale),
        label: t(`navigation.actions.${BUSINESS_SIGN_UP_LINK.labelKey}`),
      }}
      homeHref={localizeHref("/", locale)}
      items={items}
      labels={{
        closeMenu: t("navigation.closeMenu"),
        home: t("navigation.home"),
        navigation: t("navigation.label"),
        openMenu: t("navigation.openMenu"),
      }}
      signIn={{
        href: localizeHref(SIGN_IN_LINK.href, locale),
        label: t(`navigation.actions.${SIGN_IN_LINK.labelKey}`),
      }}
    />
  );
}
