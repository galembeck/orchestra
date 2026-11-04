import { HERO_MOTION } from "@orchestra/shared/constants/hero";
import { toStringArray } from "@orchestra/shared/utils/to-string-array";
import { useTranslations } from "next-intl";
import { WordRotate } from "@/components/hero/word-rotate";

export interface HeroHeadlineProps {
  id: string;
}

export function HeroHeadline({ id }: HeroHeadlineProps) {
  const t = useTranslations("hero.headline");
  const rotatingWords = toStringArray(t.raw("rotatingWords"));

  return (
    <h1
      className="text-foreground md:text-display-lg font-serif text-[58px]/14 font-normal tracking-tight text-balance lg:text-[clamp(4.5rem,7.2vw,6.5rem)] lg:leading-[0.92]"
      id={id}
    >
      {t.rich("text", {
        highlight: (chunks) => (
          <WordRotate
            className="text-primary italic"
            fallback={chunks}
            intervalMs={HERO_MOTION.wordRotateIntervalMs}
            words={rotatingWords}
          />
        ),
      })}
    </h1>
  );
}
