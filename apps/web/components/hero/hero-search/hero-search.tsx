"use client";

import { SEARCH_PATH } from "@orchestra/shared/constants/navigation";
import { toStringArray } from "@orchestra/shared/utils/to-string-array";
import { SearchIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { type ChangeEvent, useCallback, useId, useState } from "react";
import { SearchLocation } from "@/components/hero/hero-search/search-location";
import { TypingPlaceholder } from "@/components/hero/hero-search/typing-placeholder";

export function HeroSearch() {
  const t = useTranslations("hero.search");
  const placeholders = toStringArray(t.raw("placeholders"));
  const shouldReduceMotion = useReducedMotion();
  const inputId = useId();

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);
  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const showTypingPlaceholder = query === "" && !isFocused;

  return (
    <search className="w-full">
      <form
        action={SEARCH_PATH}
        className="border-input bg-card flex w-full flex-col gap-2 rounded-[22px] border p-2 shadow-[0_12px_32px_-14px_rgb(13_20_38/0.16)] lg:max-w-160 lg:flex-row lg:items-center lg:gap-4 lg:rounded-full lg:py-2 lg:pr-2 lg:pl-6 lg:shadow-[0_1px_2px_rgb(13_20_38/0.04),0_12px_32px_-12px_rgb(13_20_38/0.12)]"
        method="get"
      >
        <div className="flex min-w-0 grow items-center gap-3 px-3 pt-3 pb-2.5 lg:p-0">
          <SearchIcon
            aria-hidden="true"
            className="text-foreground size-4.5 shrink-0"
          />

          <label className="sr-only" htmlFor={inputId}>
            {t("label")}
          </label>

          <div className="relative min-w-0 grow">
            <input
              autoComplete="off"
              className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-base/5 outline-none"
              id={inputId}
              name="q"
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder={isFocused ? placeholders[0] : undefined}
              type="search"
              value={query}
            />

            {showTypingPlaceholder ? (
              <TypingPlaceholder
                animate={!shouldReduceMotion}
                phrases={placeholders}
              />
            ) : null}
          </div>
        </div>

        <SearchLocation />

        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-ring flex shrink-0 cursor-pointer items-center justify-center rounded-2xl p-3.75 text-base/5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 lg:rounded-full lg:px-6 lg:py-3.5 lg:text-[15px]/4.5"
          type="submit"
        >
          <span className="lg:hidden">{t("submitLong")}</span>

          <span className="hidden lg:inline">{t("submit")}</span>
        </button>
      </form>
    </search>
  );
}
