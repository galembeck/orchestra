import {
  QUOTE_SHOWCASE,
  SHOWCASE_CURRENCY,
  TIMELINE_SHOWCASE,
} from "@orchestra/shared/constants/how-it-works";
import { cn } from "@orchestra/ui/lib/utils";
import { CheckIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { IllustrationCard } from "@/components/how-it-works/illustration-card";
import { PopIn } from "@/components/pop-in/pop-in";

const TICK_STAGGER_SECONDS = 0.35;

export function TimelineIllustration() {
  const t = useTranslations("howItWorks.illustrations.track");
  const format = useFormatter();

  return (
    <IllustrationCard className="flex flex-col justify-center gap-4 px-7">
      <ul className="flex flex-col gap-4">
        {TIMELINE_SHOWCASE.map((entry, index) => {
          const isCurrent = entry.status === "current";

          return (
            <li className="flex items-center gap-3" key={entry.key}>
              <PopIn
                className="flex size-6 shrink-0 items-center justify-center"
                delay={0.2 + index * TICK_STAGGER_SECONDS}
              >
                {isCurrent ? (
                  <span className="border-cobalt-glow size-6 rounded-full border-2 shadow-[0_0_0_4px_rgb(91_123_255/0.15)]" />
                ) : (
                  <span className="bg-cobalt-glow flex size-5.5 items-center justify-center rounded-full text-white">
                    <CheckIcon className="size-3.5" strokeWidth={3} />
                  </span>
                )}
              </PopIn>

              <span
                className={cn(
                  "grow text-sm/5",
                  isCurrent
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {t(entry.key)}
              </span>

              <span
                className={cn(
                  "font-mono text-[11px]/3.5",
                  isCurrent ? "text-accent-foreground" : "text-muted-foreground"
                )}
              >
                {entry.time ?? t("now")}
              </span>
            </li>
          );
        })}
      </ul>

      <PopIn delay={0.2 + TIMELINE_SHOWCASE.length * TICK_STAGGER_SECONDS}>
        <p className="border-border bg-background flex items-center gap-3 rounded-xl border px-3.5 py-3">
          <span className="bg-success flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-[10px]/3 font-bold text-white">
            PIX
          </span>

          <span className="text-foreground grow text-sm/5 font-medium">
            {t("payOnCompletion")}
          </span>

          <span className="text-foreground text-[15px]/5 font-semibold">
            {format.number(QUOTE_SHOWCASE.total, {
              currency: SHOWCASE_CURRENCY,
              maximumFractionDigits: 0,
              style: "currency",
            })}
          </span>
        </p>
      </PopIn>
    </IllustrationCard>
  );
}
