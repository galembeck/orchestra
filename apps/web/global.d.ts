import type { Locale } from "@orchestra/shared/constants/i18n";
import type messages from "./messages/pt-BR.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
