import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALES,
  type Locale,
} from "@orchestra/shared/constants/i18n";

const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

const readCookie = (cookieHeader: string, name: string) => {
  for (const pair of cookieHeader.split(";")) {
    const [rawKey, ...rawValue] = pair.trim().split("=");

    if (rawKey === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }
};

const matchAcceptLanguage = (header: string): Locale | undefined => {
  const requested = header
    .split(",")
    .map((entry) => entry.split(";")[0]?.trim().toLowerCase() ?? "")
    .filter(Boolean);

  for (const tag of requested) {
    const exact = LOCALES.find((locale) => locale.toLowerCase() === tag);

    if (exact) {
      return exact;
    }

    const [language] = tag.split("-");
    const partial = LOCALES.find(
      (locale) => locale.split("-")[0]?.toLowerCase() === language
    );

    if (partial) {
      return partial;
    }
  }
};

export const resolveLocale = (request: Request | undefined): Locale => {
  if (!request) {
    return DEFAULT_LOCALE;
  }

  const cookieLocale = readCookie(
    request.headers.get("cookie") ?? "",
    LOCALE_COOKIE_NAME
  );

  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  return (
    matchAcceptLanguage(request.headers.get("accept-language") ?? "") ??
    DEFAULT_LOCALE
  );
};

export const localizePath = (locale: Locale, path: string) =>
  locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
