"use client";

import {
  BUSINESS_SIGN_UP_LINK,
  NAV_ITEMS,
  PROFILE_LINK,
  SETTINGS_LINK,
  SIGN_IN_LINK,
} from "@orchestra/shared/constants/navigation";
import { Navbar } from "@orchestra/ui/components/navbar/navbar";
import { ProfileDropdown } from "@orchestra/ui/components/profile-dropdown/profile-dropdown";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";
import { SiteControls } from "@/components/site-controls/site-controls";
import { localizeHref } from "@/i18n/localize-href";
import { useRouter } from "@/i18n/navigation";
import { authClient, signOut } from "@/lib/auth-client";

export function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogOut = useCallback(() => {
    signOut().then(() => {
      router.replace("/");
      router.refresh();
    });
  }, [router]);

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
      profileMenu={
        session ? (
          <ProfileDropdown
            labels={{
              logOut: t("navigation.profileMenu.logOut"),
              profile: t("navigation.profileMenu.profile"),
              settings: t("navigation.profileMenu.settings"),
              trigger: t("navigation.profileMenu.trigger"),
            }}
            onLogOut={handleLogOut}
            profileHref={localizeHref(PROFILE_LINK.href, locale)}
            settingsHref={localizeHref(SETTINGS_LINK.href, locale)}
            user={session.user}
          />
        ) : undefined
      }
      signIn={{
        href: localizeHref(SIGN_IN_LINK.href, locale),
        label: t(`navigation.actions.${SIGN_IN_LINK.labelKey}`),
      }}
    />
  );
}
