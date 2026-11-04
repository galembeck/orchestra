import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALES,
} from "@orchestra/shared/constants/i18n";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: DEFAULT_LOCALE,
  localeCookie: { name: LOCALE_COOKIE_NAME },
  localePrefix: "as-needed",
  locales: LOCALES,
});
