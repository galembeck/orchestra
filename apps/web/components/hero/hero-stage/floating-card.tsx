"use client";

import { HERO_MOTION } from "@orchestra/shared/constants/hero";
import { cn } from "@orchestra/ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ENTRANCE_OFFSET_PX = 20;

export interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  rotate: number;
}

export function FloatingCard({
  children,
  className,
  delay = 0,
  rotate,
}: FloatingCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn("absolute origin-top-left", className)}
      initial={
        shouldReduceMotion ? false : { opacity: 0, y: ENTRANCE_OFFSET_PX }
      }
      style={{ rotate }}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, -HERO_MOTION.cardBobDistancePx, 0] }
        }
        transition={{
          delay,
          duration: HERO_MOTION.cardBobDurationSeconds,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
