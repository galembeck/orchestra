"use client";

import { useTypewriter } from "@orchestra/shared/hooks/use-typewriter";
import { cn } from "@orchestra/ui/lib/utils";

export interface TypingPlaceholderProps {
  animate: boolean;
  className?: string;
  phrases: readonly string[];
}

export function TypingPlaceholder({
  animate,
  className,
  phrases,
}: TypingPlaceholderProps) {
  const text = useTypewriter(phrases, { enabled: animate });

  return (
    <span
      aria-hidden="true"
      className={cn(
        "text-foreground pointer-events-none absolute inset-0 flex items-center truncate",
        className
      )}
    >
      <span className="truncate">{text}</span>

      {animate ? (
        <span className="text-primary animate-caret-blink -ml-px">|</span>
      ) : null}
    </span>
  );
}
