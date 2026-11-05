import { cn } from "@orchestra/ui/lib/utils";
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import type { ReactNode } from "react";

const toneStyles = {
  error: "border-destructive/30 bg-destructive/5 text-destructive",
  success: "border-success/30 bg-success/5 text-success",
} as const;

export interface FormAlertProps {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: keyof typeof toneStyles;
}

export function FormAlert({
  action,
  children,
  className,
  tone = "error",
}: FormAlertProps) {
  const Icon = tone === "error" ? CircleAlertIcon : CircleCheckIcon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm/5",
        toneStyles[tone],
        className
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />

      <div className="flex min-w-0 grow flex-col gap-2">
        <p className="text-foreground">{children}</p>

        {action}
      </div>
    </div>
  );
}
