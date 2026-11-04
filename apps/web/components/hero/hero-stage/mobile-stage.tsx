import { cn } from "@orchestra/ui/lib/utils";
import { FloatingCard } from "@/components/hero/hero-stage/floating-card";
import { LiveEtaCard } from "@/components/hero/hero-stage/live-eta-card";
import { ProviderCard } from "@/components/hero/hero-stage/provider-card";
import { StaffLines } from "@/components/hero/hero-stage/staff-lines";
import { StaticOrb } from "@/components/hero/hero-stage/static-orb";

export interface MobileStageProps {
  className?: string;
}

export function MobileStage({ className }: MobileStageProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative -mx-5 h-85 overflow-clip md:-mx-10", className)}
    >
      <div className="relative mx-auto h-full w-97.5">
        <StaffLines variant="mobile" />

        <StaticOrb className="top-10 left-26.25 size-55 shadow-[0_40px_60px_-24px_rgb(37_71_208/0.45)]" />

        <FloatingCard className="top-7 left-5" delay={0.3} rotate={-3}>
          <ProviderCard variant="compact" />
        </FloatingCard>

        <FloatingCard className="top-55.5 left-37.5" delay={0.6} rotate={2}>
          <LiveEtaCard variant="compact" />
        </FloatingCard>
      </div>
    </div>
  );
}
