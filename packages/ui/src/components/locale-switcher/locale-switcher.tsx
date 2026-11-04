"use client";

import {
  LOCALE_DETAILS,
  LOCALES,
  type Locale,
} from "@orchestra/shared/constants/i18n";
import { Button } from "@orchestra/ui/components/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@orchestra/ui/components/dropdown-menu/dropdown-menu";
import { LocaleFlag } from "@orchestra/ui/components/locale-switcher/locale-flag";
import { ChevronDownIcon } from "lucide-react";
import { useCallback } from "react";

const isLocale = (value: string): value is Locale =>
  LOCALES.some((locale) => locale === value);

export interface LocaleSwitcherLabels {
  menu: string;
  trigger: string;
}

export interface LocaleSwitcherProps {
  disabled?: boolean;
  labels: LocaleSwitcherLabels;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function LocaleSwitcher({
  disabled = false,
  labels,
  locale,
  onLocaleChange,
}: LocaleSwitcherProps) {
  const handleValueChange = useCallback(
    (value: string) => {
      if (isLocale(value) && value !== locale) {
        onLocaleChange(value);
      }
    },
    [locale, onLocaleChange]
  );

  const [languageCode] = locale.split("-");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`${labels.trigger}: ${LOCALE_DETAILS[locale].nativeName}`}
          className="cursor-pointer gap-2 px-3"
          disabled={disabled}
          size="sm"
          variant="ghost"
        >
          <LocaleFlag locale={locale} />

          <span className="uppercase">{languageCode}</span>

          <ChevronDownIcon
            aria-hidden="true"
            className="text-muted-foreground size-3.5"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>{labels.menu}</DropdownMenuLabel>

        <DropdownMenuRadioGroup
          onValueChange={handleValueChange}
          value={locale}
        >
          {LOCALES.map((option) => (
            <DropdownMenuRadioItem key={option} lang={option} value={option}>
              <LocaleFlag locale={option} />

              {LOCALE_DETAILS[option].nativeName}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
