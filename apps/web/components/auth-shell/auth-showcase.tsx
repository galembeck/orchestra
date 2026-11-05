import { cn } from "@orchestra/ui/lib/utils";
import { BadgeCheckIcon, MapPinnedIcon, ShieldCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { WavyStaffLines } from "@/components/wavy-staff-lines/wavy-staff-lines";

const HIGHLIGHTS = [
  { icon: BadgeCheckIcon, key: "verified" },
  { icon: MapPinnedIcon, key: "tracking" },
  { icon: ShieldCheckIcon, key: "payment" },
] as const;

export interface AuthShowcaseProps {
  className?: string;
}

export function AuthShowcase({ className }: AuthShowcaseProps) {
  const t = useTranslations("auth.showcase");

  return (
    <aside
      className={cn(
        "bg-cobalt relative flex-col justify-end overflow-clip text-white",
        className
      )}
    >
      <WavyStaffLines className="h-130 w-full" variant="desktop" />

      <div className="relative flex flex-col gap-7 p-14 xl:p-20">
        <p className="tracking-eyebrow font-mono text-xs/4 font-medium text-[#C9D3F5] uppercase">
          {t("eyebrow")}
        </p>

        <p className="xl:text-display-md max-w-lg font-serif text-5xl/13 font-normal tracking-tight text-balance">
          {t.rich("headline", {
            emphasis: (chunks) => <em>{chunks}</em>,
          })}
        </p>

        <p className="max-w-md text-lg/7 text-[#DCE3FB]">{t("description")}</p>

        <ul className="flex flex-col gap-3.5 border-t border-white/15 pt-7">
          {HIGHLIGHTS.map(({ icon: Icon, key }) => (
            <li className="flex items-center gap-3 text-[15px]/5" key={key}>
              <Icon aria-hidden="true" className="size-4.5 text-[#C9D3F5]" />

              {t(`highlights.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
