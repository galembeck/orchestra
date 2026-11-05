"use client";

import { cn } from "@orchestra/ui/lib/utils";
import { type ComponentProps, type ReactNode, useId } from "react";

export type CheckboxFieldProps = Omit<
  ComponentProps<"input">,
  "children" | "id" | "type"
> & {
  error?: string;
  label: ReactNode;
};

export function CheckboxField({
  className,
  error,
  label,
  ...props
}: CheckboxFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-start gap-3">
        <input
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError || undefined}
          className="accent-primary focus-visible:outline-ring mt-0.5 size-4.5 shrink-0 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2"
          id={id}
          type="checkbox"
          {...props}
        />

        <label
          className="text-muted-foreground cursor-pointer text-sm/5"
          htmlFor={id}
        >
          {label}
        </label>
      </div>

      {hasError ? (
        <p className="text-destructive pl-7.5 text-[13px]/4.5" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
