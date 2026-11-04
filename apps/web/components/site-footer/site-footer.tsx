import { FOOTER_LINK_GROUPS } from "@orchestra/shared/constants/navigation";
import { Footer } from "@orchestra/ui/components/footer/footer";
import { useLocale, useTranslations } from "next-intl";
import { localizeHref } from "@/i18n/localize-href";

const CURRENT_YEAR = String(new Date().getFullYear());

export function SiteFooter() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const groups = FOOTER_LINK_GROUPS.map(({ links, titleKey }) => ({
    links: links.map(({ href, labelKey }) => ({
      href: localizeHref(href, locale),
      label: t(`links.${labelKey}`),
    })),
    title: t(`groups.${titleKey}`),
  }));

  return (
    <Footer
      description={t("description")}
      groups={groups}
      homeHref={localizeHref("/", locale)}
      labels={{ home: t("home"), navigation: t("navigation") }}
      legal={t("legal", { year: CURRENT_YEAR })}
      tagline={t("tagline")}
    />
  );
}
