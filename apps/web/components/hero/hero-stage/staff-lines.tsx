"use client";

import { cn } from "@orchestra/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";

const STAFF_LINE_COUNT = 5;

const STAFF_LINE_VARIANTS = {
  desktop: {
    buildPath: (y: number) =>
      `M-40 ${y} C 120 ${y - 70}, 300 ${y + 110}, 560 ${y + 10}`,
    firstLineY: 250,
    lineGap: 25,
    strokeWidth: 1.2,
    viewBox: "0 0 512 600",
  },
  mobile: {
    buildPath: (y: number) =>
      `M-20 ${y} C 90 ${y - 50}, 230 ${y + 80}, 410 ${y + 10}`,
    firstLineY: 140,
    lineGap: 18,
    strokeWidth: 1,
    viewBox: "0 0 390 340",
  },
} as const;

const LINE_INDEXES = Array.from(
  { length: STAFF_LINE_COUNT },
  (_, index) => index
);

export interface StaffLinesProps {
  className?: string;
  variant: keyof typeof STAFF_LINE_VARIANTS;
}

export function StaffLines({ className, variant }: StaffLinesProps) {
  const shouldReduceMotion = useReducedMotion();
  const { buildPath, firstLineY, lineGap, strokeWidth, viewBox } =
    STAFF_LINE_VARIANTS[variant];

  return (
    <svg
      aria-hidden="true"
      className={cn("absolute inset-0 size-full", className)}
      fill="none"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      {LINE_INDEXES.map((index) => (
        <motion.path
          animate={{ opacity: 1, pathLength: 1 }}
          className="stroke-border"
          d={buildPath(firstLineY + index * lineGap)}
          initial={shouldReduceMotion ? false : { opacity: 0, pathLength: 0 }}
          key={index}
          strokeWidth={strokeWidth}
          transition={{
            delay: 0.15 + index * 0.08,
            duration: 1.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </svg>
  );
}
