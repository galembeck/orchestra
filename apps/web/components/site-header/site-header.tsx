"use client";

import {
  BUSINESS_SIGN_UP_LINK,
  NAV_ITEMS,
  SIGN_IN_LINK,
} from "@orchestra/shared/constants/navigation";
import { Navbar } from "@orchestra/ui/components/navbar/navbar";
import { useLocale, useTranslations } from "next-intl";
import { SiteControls } from "@/components/site-controls/site-controls";
import { localizeHref } from "@/i18n/localize-href";

export function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();

  const items = NAV_ITEMS.map(({ href, labelKey }) => ({
    href: localizeHref(href, locale),
    label: t(`navigation.items.${labelKey}`),
  }));

  return (
    <Navbar
      controls={<SiteControls />}
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
