"use client";

import { MEDIA_QUERIES } from "@orchestra/shared/constants/media-queries";
import { useMediaQuery } from "@orchestra/shared/hooks/use-media-query";
import { cn } from "@orchestra/ui/lib/utils";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { StaticOrb } from "@/components/hero/hero-stage/static-orb";

const OrbScene = dynamic(
  () =>
    import("@/components/hero/hero-stage/orb-scene/orb-scene").then(
      (module) => module.OrbScene
    ),
  { ssr: false }
);

export function OrbLayer() {
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);
  const prefersReducedMotion = useMediaQuery(MEDIA_QUERIES.reducedMotion);
  const [isSceneReady, setIsSceneReady] = useState(false);

  const handleSceneReady = useCallback(() => setIsSceneReady(true), []);

  const shouldRenderScene = isDesktop && !prefersReducedMotion;
  const isSceneVisible = shouldRenderScene && isSceneReady;

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isSceneVisible ? "opacity-0" : "opacity-100"
        )}
      >
        <StaticOrb className="top-30 left-24 size-85" />

        <div className="border-foreground/20 absolute top-62.5 left-14 h-20 w-105 origin-top-left -rotate-14 rounded-full border-[1.5px]" />
      </div>

      {shouldRenderScene ? (
        <OrbScene
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            isSceneVisible ? "opacity-100" : "opacity-0"
          )}
          onReady={handleSceneReady}
        />
      ) : null}
    </>
  );
}
