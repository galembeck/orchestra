import { cn } from "@orchestra/ui/lib/utils";

export interface DividerProps {
  className?: string;
  label?: string;
}

export function Divider({ className, label }: DividerProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span aria-hidden="true" className="bg-border h-px grow" />

      {label ? (
        <span className="text-muted-foreground tracking-eyebrow font-mono text-[11px]/3.5 font-medium uppercase">
          {label}
        </span>
      ) : null}

      <span aria-hidden="true" className="bg-border h-px grow" />
    </div>
  );
}
