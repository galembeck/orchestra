import { HERO_SHOWCASE } from "@orchestra/shared/constants/hero";
import { cn } from "@orchestra/ui/lib/utils";
import { useTranslations } from "next-intl";

const { minutes, progress } = HERO_SHOWCASE.eta;
const PROGRESS_WIDTH = `${Math.round(progress * 100)}%`;

function LivePulse() {
  return (
    <span className="relative flex size-2 shrink-0">
      <span className="bg-cobalt-glow absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none" />

      <span className="bg-cobalt-glow relative size-2 rounded-full shadow-[0_0_0_4px_rgb(91_123_255/0.25)]" />
    </span>
  );
}

export interface LiveEtaCardProps {
  variant?: "compact" | "full";
}

export function LiveEtaCard({ variant = "full" }: LiveEtaCardProps) {
  const t = useTranslations("hero.stage.eta");
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "bg-ink dark:bg-ink-2 dark:ring-ink-3 flex flex-col shadow-[0_28px_56px_-20px_rgb(13_20_38/0.5)] dark:ring-1",
        isCompact
          ? "w-55 gap-2.5 rounded-2xl px-4 py-3.5"
          : "w-78 gap-3.5 rounded-[18px] px-5 py-4.5"
      )}
    >
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "tracking-eyebrow font-mono text-[#9AA6C4] uppercase",
            isCompact ? "text-[10px]/3" : "text-[11px]/3.5 font-medium"
          )}
        >
          {t("live")}
        </p>

        {isCompact ? null : <LivePulse />}
      </div>

      <p
        className={cn(
          "font-serif text-white",
          isCompact ? "text-2xl/6.5" : "text-3xl/8"
        )}
      >
        {t.rich("arrival", {
          highlight: (chunks) => (
            <span className="text-cobalt-soft italic">{chunks}</span>
          ),
          minutes,
        })}
      </p>

      <div className="flex flex-col gap-2">
        <div className="bg-ink-3 h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-cobalt-glow h-full rounded-full"
            style={{ width: PROGRESS_WIDTH }}
          />
        </div>

        {isCompact ? null : (
          <p className="text-[13px]/4 text-[#9AA6C4]">{t("status")}</p>
        )}
      </div>
    </div>
  );
}
