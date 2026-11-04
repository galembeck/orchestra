import {
  BUSINESS_SIGN_UP_LINK,
  SEARCH_PATH,
} from "@orchestra/shared/constants/navigation";
import { ButtonLink } from "@orchestra/ui/components/button/button";
import { ArrowRightIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { localizeHref } from "@/i18n/localize-href";

export function CtaActions() {
  const t = useTranslations("cta");
  const locale = useLocale();

  return (
    <div className="flex w-full flex-col gap-2.5 pt-2 lg:w-auto lg:flex-row lg:gap-3">
      <ButtonLink
        className="relative overflow-hidden font-semibold"
        href={localizeHref(SEARCH_PATH, locale)}
        size="lg"
        variant="inverse"
      >
        <span
          aria-hidden="true"
          className="animate-shimmer via-primary/15 pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-linear-to-r from-transparent to-transparent motion-reduce:hidden"
        />

        <span className="relative">{t("primary")}</span>

        <ArrowRightIcon aria-hidden="true" className="relative size-4" />
      </ButtonLink>

      <ButtonLink
        href={localizeHref(BUSINESS_SIGN_UP_LINK.href, locale)}
        size="lg"
        variant="inverseOutline"
      >
        {t("secondary")}
      </ButtonLink>
    </div>
  );
}
