"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export interface PopInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PopIn({ children, className, delay = 0 }: PopInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9, y: 8 }}
      transition={{ damping: 22, delay, stiffness: 260, type: "spring" }}
      viewport={{ amount: 0.6, once: true }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
