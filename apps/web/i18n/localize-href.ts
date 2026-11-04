import type { Locale } from "@orchestra/shared/constants/i18n";
import { getPathname } from "@/i18n/navigation";

export function localizeHref(href: string, locale: Locale): string {
  if (href.startsWith("#")) {
    return href;
  }

  return getPathname({ href, locale });
}
