import { useTranslations } from "next-intl";

export function HeroDescription() {
  const t = useTranslations("hero.description");

  return (
    <p className="text-muted-foreground max-w-140 text-[17px]/6.75 lg:text-xl/7.75">
      <span className="lg:hidden">{t("short")}</span>

      <span className="hidden lg:inline">{t("long")}</span>
    </p>
  );
}
