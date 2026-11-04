import { LOCALE_DETAILS, type Locale } from "@orchestra/shared/constants/i18n";
import { cn } from "@orchestra/ui/lib/utils";
import BrazilFlag from "country-flag-icons/react/3x2/BR";
import UnitedStatesFlag from "country-flag-icons/react/3x2/US";

const FLAGS_BY_COUNTRY = {
  BR: BrazilFlag,
  US: UnitedStatesFlag,
} as const;

export interface LocaleFlagProps {
  className?: string;
  locale: Locale;
}

export function LocaleFlag({ className, locale }: LocaleFlagProps) {
  const Flag = FLAGS_BY_COUNTRY[LOCALE_DETAILS[locale].countryCode];

  return (
    <Flag
      aria-hidden="true"
      className={cn(
        "h-3.5 w-5.25 shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgb(13_20_38/0.1)]",
        className
      )}
    />
  );
}
