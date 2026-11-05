"use client";

import { cn } from "@orchestra/ui/lib/utils";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

export function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

export function DialogTrigger(
  props: ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-foreground text-lg font-semibold", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-muted-foreground text-sm/5", className)}
      {...props}
    />
  );
}

export interface DialogContentProps
  extends ComponentProps<typeof DialogPrimitive.Content> {
  closeLabel: string;
}

export function DialogContent({
  children,
  className,
  closeLabel,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="bg-ink/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50" />
      <DialogPrimitive.Content
        className={cn(
          "border-border bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border p-6 shadow-[0_24px_48px_-24px_rgb(13_20_38/0.28)]",
          className
        )}
        {...props}
      >
        {children}

        <DialogPrimitive.Close
          aria-label={closeLabel}
          className="text-muted-foreground hover:bg-muted focus-visible:outline-ring absolute top-4 right-4 cursor-pointer rounded-full p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <XIcon aria-hidden="true" className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
