import { HeroDescription } from "@/components/hero/hero-description";
import { HeroEyebrow } from "@/components/hero/hero-eyebrow";
import { HeroHeadline } from "@/components/hero/hero-headline";
import { HeroSearch } from "@/components/hero/hero-search/hero-search";
import { HeroSocialProof } from "@/components/hero/hero-social-proof";
import { HeroStage } from "@/components/hero/hero-stage/hero-stage";

const HERO_HEADING_ID = "hero-heading";

export function Hero() {
  return (
    <section
      aria-labelledby={HERO_HEADING_ID}
      className="max-w-page px-page mx-auto flex w-full flex-col overflow-x-clip pt-10 lg:flex-row lg:items-center lg:gap-12 lg:pt-22 lg:pb-24"
    >
      <div className="flex min-w-0 flex-col gap-6 pb-6 lg:flex-1 lg:gap-8 lg:pb-0">
        <HeroEyebrow />

        <HeroHeadline id={HERO_HEADING_ID} />

        <HeroDescription />

        <HeroSearch />

        <HeroSocialProof />
      </div>

      <HeroStage />
    </section>
  );
}
