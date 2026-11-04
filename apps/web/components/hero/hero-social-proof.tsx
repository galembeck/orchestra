import { PLATFORM_STATS } from "@orchestra/shared/constants/hero";
import { useTranslations } from "next-intl";
import { AvatarStack } from "@/components/hero/avatar-stack";

export function HeroSocialProof() {
  const t = useTranslations("hero.socialProof");

  return (
    <div className="flex items-center gap-3 lg:gap-5 lg:pt-2">
      <AvatarStack />

      <div className="flex flex-col lg:gap-0.5">
        <p className="flex items-center gap-1.5">
          <span className="sr-only">
            {t("ratingLabel", { rating: PLATFORM_STATS.averageRating })}
          </span>

          <span
            aria-hidden="true"
            className="text-foreground text-sm/4.5 font-semibold lg:text-[15px]/4.5"
          >
            {t("rating", { rating: PLATFORM_STATS.averageRating })}
          </span>

          <span
            aria-hidden="true"
            className="text-brass text-sm/4.5 tracking-[0.08em]"
          >
            ★★★★★
          </span>
        </p>

        <p className="text-muted-foreground text-[13px]/4 lg:text-sm/4.5">
          {t("reviews", { count: PLATFORM_STATS.reviewCount })}
        </p>
      </div>

      <span aria-hidden="true" className="bg-border hidden h-8 w-px lg:block" />

      <p className="hidden items-center gap-2 lg:flex">
        <span
          aria-hidden="true"
          className="bg-accent text-accent-foreground flex size-5.5 shrink-0 items-center justify-center rounded-md font-mono text-[10px]/3 font-bold"
        >
          PIX
        </span>

        <span className="text-muted-foreground text-sm/4.5">
          {t("payment")}
        </span>
      </p>
    </div>
  );
}
