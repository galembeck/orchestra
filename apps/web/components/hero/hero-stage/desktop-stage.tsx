import { cn } from "@orchestra/ui/lib/utils";
import { FloatingCard } from "@/components/hero/hero-stage/floating-card";
import { LiveEtaCard } from "@/components/hero/hero-stage/live-eta-card";
import { OrbLayer } from "@/components/hero/hero-stage/orb-layer";
import { ProviderCard } from "@/components/hero/hero-stage/provider-card";
import { StaffLines } from "@/components/hero/hero-stage/staff-lines";

export interface DesktopStageProps {
  className?: string;
}

export function DesktopStage({ className }: DesktopStageProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-120 w-102.5 shrink-0 xl:h-150 xl:w-lg",
        className
      )}
    >
      <div className="absolute top-0 left-0 h-150 w-lg origin-top-left scale-80 xl:scale-100">
        <StaffLines variant="desktop" />

        <OrbLayer />

        <FloatingCard className="top-16 -left-2" delay={0.3} rotate={-3}>
          <ProviderCard />
        </FloatingCard>

        <FloatingCard className="top-106 left-50" delay={0.6} rotate={2}>
          <LiveEtaCard />
        </FloatingCard>
      </div>
    </div>
  );
}
