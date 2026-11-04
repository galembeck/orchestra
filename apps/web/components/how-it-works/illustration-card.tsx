import { cn } from "@orchestra/ui/lib/utils";
import type { ReactNode } from "react";

export interface IllustrationCardProps {
  children: ReactNode;
  className?: string;
}

export function IllustrationCard({
  children,
  className,
}: IllustrationCardProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "border-border bg-card relative h-65 overflow-hidden rounded-2xl border",
        className
      )}
    >
      {children}
    </div>
  );
}
