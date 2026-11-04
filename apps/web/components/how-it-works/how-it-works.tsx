import {
  HOW_IT_WORKS_STEPS,
  type HowItWorksStep as HowItWorksStepKey,
} from "@orchestra/shared/constants/how-it-works";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { ChatIllustration } from "@/components/how-it-works/chat-illustration";
import { HowItWorksStep } from "@/components/how-it-works/how-it-works-step";
import { MapIllustration } from "@/components/how-it-works/map-illustration";
import { TimelineIllustration } from "@/components/how-it-works/timeline-illustration";
import { SectionHeader } from "@/components/section-header/section-header";

const HOW_IT_WORKS_HEADING_ID = "how-it-works-heading";

const STEP_ILLUSTRATIONS = {
  chat: <ChatIllustration />,
  search: <MapIllustration />,
  track: <TimelineIllustration />,
} as const satisfies Record<HowItWorksStepKey, ReactNode>;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section
      aria-labelledby={HOW_IT_WORKS_HEADING_ID}
      className="dark bg-background text-foreground border-border scroll-mt-24 border-t"
      id="how-it-works"
    >
      <div className="max-w-page px-page mx-auto flex w-full flex-col gap-12 py-20 lg:gap-24 lg:py-30">
        <SectionHeader
          aside={
            <p className="text-muted-foreground max-w-110 text-base/6.5 lg:text-lg/7.5">
              {t("description")}
            </p>
          }
          eyebrow={t("eyebrow")}
          headingId={HOW_IT_WORKS_HEADING_ID}
          title={t.rich("title", {
            emphasis: (chunks) => (
              <em className="text-accent-foreground">{chunks}</em>
            ),
          })}
        />

        <ol className="grid gap-14 lg:grid-cols-3 lg:gap-10">
          {HOW_IT_WORKS_STEPS.map((stepKey, index) => (
            <HowItWorksStep
              illustration={STEP_ILLUSTRATIONS[stepKey]}
              index={index}
              key={stepKey}
              stepKey={stepKey}
              total={HOW_IT_WORKS_STEPS.length}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
