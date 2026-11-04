"use client";

import { useTheme } from "@orchestra/shared/hooks/use-theme";
import { Button } from "@orchestra/ui/components/button/button";
import { cn } from "@orchestra/ui/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

export interface ThemeToggleProps {
  className?: string;
  label: string;
}

export function ThemeToggle({ className, label }: ThemeToggleProps) {
  const { toggleTheme } = useTheme();

  return (
    <Button
      aria-label={label}
      className={cn("cursor-pointer", className)}
      onClick={toggleTheme}
      size="icon"
      title={label}
      variant="ghost"
    >
      <MoonIcon aria-hidden="true" className="size-4.5 dark:hidden" />

      <SunIcon aria-hidden="true" className="hidden size-4.5 dark:block" />
    </Button>
  );
}
