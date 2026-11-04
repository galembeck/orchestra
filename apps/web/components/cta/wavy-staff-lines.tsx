"use client";

import { cn } from "@orchestra/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";

const STAFF_LINE_COUNT = 5;
const DRIFT_BASE_DURATION_SECONDS = 14;
const DRIFT_DURATION_STEP_SECONDS = 1.6;

const WAVE_VARIANTS = {
  desktop: {
    buildPath: (y: number, drift: number) =>
      `M-20 ${y + drift * 0.4} C 360 ${y - 100 + drift}, 1080 ${y + 120 - drift}, 1460 ${y - 20 + drift * 0.6}`,
    driftPx: 28,
    firstLineY: 300,
    lineGap: 24,
    viewBox: "0 0 1440 520",
  },
  mobile: {
    buildPath: (y: number, drift: number) =>
      `M-20 ${y + drift * 0.4} C 100 ${y - 60 + drift}, 260 ${y + 90 - drift}, 410 ${y + 10 + drift * 0.6}`,
    driftPx: 14,
    firstLineY: 200,
    lineGap: 18,
    viewBox: "0 0 390 420",
  },
} as const;

const LINE_INDEXES = Array.from(
  { length: STAFF_LINE_COUNT },
  (_, index) => index
);

export interface WavyStaffLinesProps {
  className?: string;
  variant: keyof typeof WAVE_VARIANTS;
}

export function WavyStaffLines({ className, variant }: WavyStaffLinesProps) {
  const shouldReduceMotion = useReducedMotion();
  const { buildPath, driftPx, firstLineY, lineGap, viewBox } =
    WAVE_VARIANTS[variant];

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 top-0", className)}
      fill="none"
      preserveAspectRatio="none"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      {LINE_INDEXES.map((index) => {
        const y = firstLineY + index * lineGap;
        const restingPath = buildPath(y, 0);

        return (
          <motion.path
            animate={
              shouldReduceMotion
                ? undefined
                : { d: [restingPath, buildPath(y, driftPx), restingPath] }
            }
            d={restingPath}
            key={index}
            stroke="rgb(255 255 255 / 0.12)"
            transition={{
              delay: index * 0.4,
              duration:
                DRIFT_BASE_DURATION_SECONDS +
                index * DRIFT_DURATION_STEP_SECONDS,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}
