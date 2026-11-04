import { HERO_SHOWCASE } from "@orchestra/shared/constants/hero";
import { cn } from "@orchestra/ui/lib/utils";
import { useFormatter, useTranslations } from "next-intl";

const { distanceKm, initial, name, rating } = HERO_SHOWCASE.provider;

function ProviderAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-ink flex shrink-0 items-center justify-center rounded-full bg-[#E9DCC0] font-serif",
        className
      )}
    >
      {initial}
    </span>
  );
}

export interface ProviderCardProps {
  variant?: "compact" | "full";
}

export function ProviderCard({ variant = "full" }: ProviderCardProps) {
  const t = useTranslations("hero.stage.provider");
  const format = useFormatter();
  const formattedRating = format.number(rating);

  if (variant === "compact") {
    return (
      <div className="border-border bg-card flex items-center gap-2.5 rounded-[14px] border py-2.5 pr-3.5 pl-2.5 shadow-[0_16px_32px_-16px_rgb(13_20_38/0.25)]">
        <ProviderAvatar className="size-8 text-[17px]/5.5" />

        <div className="flex flex-col">
          <p className="text-foreground text-[13px]/4 font-semibold">{name}</p>

          <p className="text-success text-xs/4">
            ● {t("verified")} · {formattedRating}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-border bg-card flex w-65 flex-col gap-3.5 rounded-[18px] border p-4.5 shadow-[0_24px_48px_-20px_rgb(13_20_38/0.22)]">
      <div className="flex items-center gap-3">
        <ProviderAvatar className="size-10 text-xl/6" />

        <div className="flex flex-col gap-0.5">
          <p className="text-foreground text-[15px]/4.5 font-semibold">
            {name}
          </p>

          <p className="text-muted-foreground text-[13px]/4">
            {t("role")} · {t("distance", { distance: distanceKm })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-brass text-[13px]/4">
          ★★★★★{" "}
          <span className="text-foreground font-semibold">
            {formattedRating}
          </span>
        </p>

        <p className="bg-success/10 text-success flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs/4 font-medium">
          <span className="bg-success size-1.5 shrink-0 rounded-full" />
          {t("verified")}
        </p>
      </div>
    </div>
  );
}
