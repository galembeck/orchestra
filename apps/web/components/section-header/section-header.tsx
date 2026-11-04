import { cn } from "@orchestra/ui/lib/utils";
import type { ReactNode } from "react";

export interface SectionHeaderProps {
  aside?: ReactNode;
  className?: string;
  eyebrow: string;
  headingId: string;
  title: ReactNode;
}

export function SectionHeader({
  aside,
  className,
  eyebrow,
  headingId,
  title,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12",
        className
      )}
    >
      <div className="flex flex-col gap-3.5 lg:gap-5">
        <p className="tracking-eyebrow text-accent-foreground font-mono text-[11px]/3.5 font-medium uppercase lg:text-xs/4">
          {eyebrow}
        </p>

        <h2
          className="text-foreground lg:text-display-lg max-w-180 font-serif text-[42px]/11 font-normal tracking-[-0.02em] text-balance"
          id={headingId}
        >
          {title}
        </h2>
      </div>

      {aside}
    </div>
  );
}
