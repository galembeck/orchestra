"use client";

import type { CategoryKey } from "@orchestra/shared/constants/categories";
import { cn } from "@orchestra/ui/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CATEGORY_ICONS } from "@/components/categories/category-icons";

const STAGGER_DELAY_SECONDS = 0.07;

export interface CategoryTileProps {
  businessCountLabel: string;
  categoryKey: CategoryKey;
  className?: string;
  href: string;
  index: number;
  label: string;
}

export function CategoryTile({
  businessCountLabel,
  categoryKey,
  className,
  href,
  index,
  label,
}: CategoryTileProps) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = CATEGORY_ICONS[categoryKey];

  return (
    <motion.li
      className={cn("border-border border-r border-b", className)}
      initial={
        shouldReduceMotion ? false : { filter: "blur(8px)", opacity: 0, y: 16 }
      }
      transition={{
        delay: index * STAGGER_DELAY_SECONDS,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ amount: 0.4, once: true }}
      whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
    >
      <a
        className="group focus-visible:outline-ring relative isolate flex h-35 flex-col justify-between overflow-hidden p-4.5 focus-visible:outline-2 focus-visible:-outline-offset-2 lg:h-60 lg:p-7"
        href={href}
      >
        <span
          aria-hidden="true"
          className="bg-cobalt absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
        />

        <span className="flex items-start justify-between">
          <Icon
            aria-hidden="true"
            className="text-foreground size-7 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white lg:size-9"
            strokeWidth={1.4}
          />

          <ArrowUpRightIcon
            aria-hidden="true"
            className="size-5 -translate-x-1 translate-y-1 text-white opacity-0 transition duration-300 group-hover:translate-0 group-hover:opacity-100 group-focus-visible:translate-0 group-focus-visible:opacity-100"
          />
        </span>

        <span className="flex flex-col gap-1 lg:gap-1.5">
          <span className="text-foreground font-serif text-[23px]/6.5 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white lg:text-4xl/10">
            {label}
          </span>

          <span className="text-muted-foreground font-mono text-[11px]/3.5 tracking-[0.08em] uppercase transition-colors duration-300 group-hover:text-[#C9D3F5] group-focus-visible:text-[#C9D3F5] lg:text-xs/4 lg:tracking-widest">
            {businessCountLabel}
          </span>
        </span>
      </a>
    </motion.li>
  );
}
