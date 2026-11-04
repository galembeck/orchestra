export const LOCALES = ["pt-BR", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-BR";

export const LOCALE_COOKIE_NAME = "ORCHESTRA_LOCALE";

export const LOCALE_DETAILS = {
  en: { countryCode: "US", nativeName: "English" },
  "pt-BR": { countryCode: "BR", nativeName: "Português (Brasil)" },
} as const satisfies Record<
  Locale,
  { countryCode: string; nativeName: string }
>;
