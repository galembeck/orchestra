import {
  QUOTE_SHOWCASE,
  SHOWCASE_CURRENCY,
} from "@orchestra/shared/constants/how-it-works";
import { useFormatter, useTranslations } from "next-intl";
import { IllustrationCard } from "@/components/how-it-works/illustration-card";
import { PopIn } from "@/components/pop-in/pop-in";

const PHOTO_COLORS = ["#E9DCC0", "#C9D3F5"] as const;

export function ChatIllustration() {
  const t = useTranslations("howItWorks.illustrations.chat");
  const format = useFormatter();

  return (
    <IllustrationCard className="flex flex-col gap-2.5 px-7 pt-3">
      <PopIn className="self-start" delay={0.1}>
        <p className="bg-border text-foreground/90 max-w-62.5 rounded-xl px-3.5 py-2.5 text-sm/5">
          {t("message")}
        </p>
      </PopIn>

      <PopIn className="flex gap-1.5 self-end" delay={0.35}>
        {PHOTO_COLORS.map((color) => (
          <span
            className="h-12 w-16 rounded-lg"
            key={color}
            style={{ backgroundColor: color }}
          />
        ))}
      </PopIn>

      <PopIn className="w-62.5 self-start" delay={0.6}>
        <div className="text-ink flex flex-col gap-2 rounded-xl bg-white p-3.5 shadow-[0_16px_32px_-16px_rgb(0_0_0/0.6)]">
          <p className="font-mono text-[10px]/3 tracking-[0.14em] text-[#5A6276] uppercase">
            {t("quoteLabel")}
          </p>

          <p className="flex items-center justify-between text-sm/5">
            {t("quoteService")}

            <span className="font-semibold">
              {format.number(QUOTE_SHOWCASE.total, {
                currency: SHOWCASE_CURRENCY,
                maximumFractionDigits: 0,
                style: "currency",
              })}
            </span>
          </p>

          <span className="bg-cobalt rounded-full py-2 text-center text-[13px]/4 font-semibold text-white">
            {t("accept")}
          </span>
        </div>
      </PopIn>
    </IllustrationCard>
  );
}
