import { PLATFORM_STATS } from "@orchestra/shared/constants/hero";
import { useTranslations } from "next-intl";

export function HeroEyebrow() {
  const t = useTranslations("hero.eyebrow");

  return (
    <p className="flex items-center gap-2 lg:gap-2.5">
      <span
        aria-hidden="true"
        className="bg-primary size-1.75 shrink-0 rounded-full lg:size-2"
      />

      <span className="text-muted-foreground lg:tracking-eyebrow font-mono text-[11px]/3.5 font-medium tracking-[0.12em] uppercase lg:text-xs/4">
        {t("count", { count: PLATFORM_STATS.verifiedBusinesses })}

        <span className="hidden lg:inline"> · {t("location")}</span>
      </span>
    </p>
  );
}
