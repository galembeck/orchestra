import type { HowItWorksStep as HowItWorksStepKey } from "@orchestra/shared/constants/how-it-works";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { StepBeam } from "@/components/how-it-works/step-beam";

const STEP_NUMBER_DIGITS = 2;

export interface HowItWorksStepProps {
  illustration: ReactNode;
  index: number;
  stepKey: HowItWorksStepKey;
  total: number;
}

export function HowItWorksStep({
  illustration,
  index,
  stepKey,
  total,
}: HowItWorksStepProps) {
  const t = useTranslations("howItWorks.steps");
  const stepNumber = String(index + 1).padStart(STEP_NUMBER_DIGITS, "0");

  return (
    <li className="flex flex-col gap-6 lg:gap-8">
      {illustration}

      <div className="flex flex-col gap-4">
        <StepBeam index={index} total={total} />

        <h3 className="text-foreground flex items-baseline gap-3 pt-2 font-serif text-[28px]/8 font-normal lg:text-[32px]/9">
          <span className="text-accent-foreground italic">{stepNumber}</span>

          {t(`${stepKey}.title`)}
        </h3>

        <p className="text-muted-foreground text-base/6.5">
          {t(`${stepKey}.description`)}
        </p>
      </div>
    </li>
  );
}
