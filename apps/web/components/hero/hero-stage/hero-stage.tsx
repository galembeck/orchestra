import { DesktopStage } from "@/components/hero/hero-stage/desktop-stage";
import { MobileStage } from "@/components/hero/hero-stage/mobile-stage";

export function HeroStage() {
  return (
    <>
      <MobileStage className="lg:hidden" />

      <DesktopStage className="hidden lg:block" />
    </>
  );
}
