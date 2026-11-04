import {
  MAP_SHOWCASE_OFFERS,
  type MapShowcaseOfferId,
  SHOWCASE_CURRENCY,
} from "@orchestra/shared/constants/how-it-works";
import { cn } from "@orchestra/ui/lib/utils";
import { useFormatter } from "next-intl";
import { IllustrationCard } from "@/components/how-it-works/illustration-card";
import { PopIn } from "@/components/pop-in/pop-in";

const ROAD_PATHS = [
  "M-10 72 C 120 60, 260 48, 410 62",
  "M-10 176 C 140 168, 260 192, 410 178",
  "M122 -10 C 128 90, 108 180, 118 270",
  "M296 -10 C 284 90, 302 170, 282 270",
] as const;

const OFFER_POSITIONS = {
  north: "top-[16%] left-[67%]",
  south: "top-[67%] left-[64%]",
  west: "top-[22%] left-[24%]",
} as const satisfies Record<MapShowcaseOfferId, string>;

const PIN_STAGGER_SECONDS = 0.15;

export function MapIllustration() {
  const format = useFormatter();

  return (
    <IllustrationCard>
      <svg
        aria-hidden="true"
        className="text-border absolute inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 400 260"
        xmlns="http://www.w3.org/2000/svg"
      >
        {ROAD_PATHS.map((path) => (
          <path
            d={path}
            key={path}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="10"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <circle
          className="text-cobalt-glow/40"
          cx="200"
          cy="125"
          r="70"
          stroke="currentColor"
          strokeDasharray="3 5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span className="absolute top-[48%] left-1/2 flex size-12 -translate-1/2 items-center justify-center">
        <span className="bg-cobalt-glow/25 absolute inset-0 animate-ping rounded-full motion-reduce:animate-none" />

        <span className="bg-ink absolute inset-1 rounded-full" />

        <span className="bg-cobalt-glow relative size-5 rounded-full" />
      </span>

      {MAP_SHOWCASE_OFFERS.map((offer, index) => (
        <PopIn
          className={cn("absolute", OFFER_POSITIONS[offer.id])}
          delay={0.2 + index * PIN_STAGGER_SECONDS}
          key={offer.id}
        >
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs/4 font-semibold whitespace-nowrap shadow-[0_8px_20px_-8px_rgb(0_0_0/0.5)]",
              offer.featured ? "bg-cobalt text-white" : "text-ink bg-white"
            )}
          >
            {format.number(offer.price, {
              currency: SHOWCASE_CURRENCY,
              maximumFractionDigits: 0,
              style: "currency",
            })}

            <span
              className={cn(
                "font-normal",
                offer.featured ? "text-white" : "text-brass"
              )}
            >
              ★{" "}
              {format.number(offer.rating, {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1,
              })}
            </span>
          </span>
        </PopIn>
      ))}
    </IllustrationCard>
  );
}
