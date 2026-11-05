"use client";

import { cn } from "@orchestra/ui/lib/utils";
import { type ComponentProps, type ReactNode, useId } from "react";

export type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  error?: string;
  hint?: string;
  label: string;
  trailing?: ReactNode;
};

export function TextField({
  className,
  error,
  hint,
  label,
  trailing,
  ...props
}: TextFieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const description = error ?? hint;
  const hasError = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-foreground text-sm/5 font-medium" htmlFor={id}>
        {label}
      </label>

      <div className="relative">
        <input
          aria-describedby={description ? descriptionId : undefined}
          aria-invalid={hasError || undefined}
          className={cn(
            "border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20 h-12 w-full rounded-xl border px-4 text-base/5 transition-[border-color,box-shadow] outline-none focus-visible:ring-4",
            trailing ? "pr-12" : null
          )}
          id={id}
          {...props}
        />

        {trailing ? (
          <div className="absolute inset-y-0 right-1.5 flex items-center">
            {trailing}
          </div>
        ) : null}
      </div>

      {description ? (
        <p
          className={cn(
            "text-[13px]/4.5",
            hasError ? "text-destructive" : "text-muted-foreground"
          )}
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
