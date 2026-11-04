import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function SearchLocation() {
  const t = useTranslations("hero.search");
  const location = `${t("neighborhood")}, ${t("city")}`;

  return (
    <>
      <span
        aria-hidden="true"
        className="bg-border hidden h-7 w-px shrink-0 lg:block"
      />

      <p className="border-border text-muted-foreground flex shrink-0 items-center gap-2 border-t px-3 py-2.5 text-[15px]/4.5 lg:gap-1.5 lg:border-t-0 lg:p-0">
        <MapPinIcon aria-hidden="true" className="size-3.5 shrink-0" />

        <span className="sr-only">{t("locationLabel")}: </span>

        {t("neighborhood")}

        <span className="lg:hidden">, {t("city")}</span>
      </p>

      <input name="location" type="hidden" value={location} />
    </>
  );
}
