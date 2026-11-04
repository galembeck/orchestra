"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const BEAM_DURATION_SECONDS = 1.4;
const BEAM_CYCLE_PAUSE_SECONDS = 1.2;

export interface StepBeamProps {
  index: number;
  total: number;
}

export function StepBeam({ index, total }: StepBeamProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5, once: true });
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = isInView && !shouldReduceMotion;

  return (
    <div
      aria-hidden="true"
      className="bg-border relative h-px overflow-x-clip"
      ref={ref}
    >
      {shouldAnimate ? (
        <motion.span
          animate={{ opacity: [0, 1, 1, 0], x: ["-100%", "300%"] }}
          className="via-cobalt-glow absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent to-transparent shadow-[0_0_12px_1px_rgb(91_123_255/0.55)]"
          initial={{ opacity: 0, x: "-100%" }}
          transition={{
            delay: index * BEAM_DURATION_SECONDS,
            duration: BEAM_DURATION_SECONDS,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay:
              (total - 1) * BEAM_DURATION_SECONDS + BEAM_CYCLE_PAUSE_SECONDS,
          }}
        />
      ) : null}
    </div>
  );
}
