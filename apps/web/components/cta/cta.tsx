import { useTranslations } from "next-intl";
import { CtaActions } from "@/components/cta/cta-actions";
import { WavyStaffLines } from "@/components/wavy-staff-lines/wavy-staff-lines";

const CTA_HEADING_ID = "cta-heading";

export function Cta() {
  const t = useTranslations("cta");

  return (
    <section
      aria-labelledby={CTA_HEADING_ID}
      className="bg-cobalt relative overflow-clip text-white"
    >
      <WavyStaffLines className="h-105 w-full lg:hidden" variant="mobile" />

      <WavyStaffLines
        className="hidden h-130 w-full lg:block"
        variant="desktop"
      />

      <div className="max-w-page px-page relative mx-auto flex w-full flex-col items-start gap-6 py-20 lg:items-center lg:gap-9 lg:py-36 lg:text-center">
        <p className="tracking-eyebrow font-mono text-[11px]/3.5 font-medium text-[#C9D3F5] uppercase lg:text-xs/4">
          {t("eyebrow")}
        </p>

        <h2
          className="md:text-display-lg max-w-250 font-serif text-[56px]/13.5 font-normal tracking-tight text-balance lg:text-[120px]/28"
          id={CTA_HEADING_ID}
        >
          {t.rich("headline", {
            emphasis: (chunks) => <em>{chunks}</em>,
          })}
        </h2>

        <p className="max-w-2xl text-base/6.25 text-[#DCE3FB] lg:text-xl/7.5">
          {t("description")}
        </p>

        <CtaActions />
      </div>
    </section>
  );
}
