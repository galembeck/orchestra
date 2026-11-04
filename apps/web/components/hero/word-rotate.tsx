"use client";

import { cn } from "@orchestra/ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";

const WORD_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
} as const;

export interface WordRotateProps {
  className?: string;
  fallback: ReactNode;
  intervalMs: number;
  words: readonly string[];
}

export function WordRotate({
  className,
  fallback,
  intervalMs,
  words,
}: WordRotateProps) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const canRotate = !shouldReduceMotion && words.length > 1;

  useEffect(() => {
    if (!canRotate) {
      return;
    }

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [canRotate, intervalMs, words.length]);

  const word = canRotate ? words[index] : undefined;

  if (!word) {
    return <span className={cn("pr-[0.04em]", className)}>{fallback}</span>;
  }

  return (
    <span className={cn("relative inline-block pr-[0.04em]", className)}>
      <span className="sr-only">{fallback}</span>

      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          aria-hidden="true"
          className="inline-block"
          exit={{ filter: "blur(8px)", opacity: 0, y: "-0.2em" }}
          initial={{ filter: "blur(8px)", opacity: 0, y: "0.25em" }}
          key={word}
          transition={WORD_TRANSITION}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
