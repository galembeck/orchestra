"use client";

import { cn } from "@orchestra/ui/lib/utils";
import { CheckIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

export function DropdownMenu(
  props: ComponentProps<typeof DropdownMenuPrimitive.Root>
) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

export function DropdownMenuTrigger(
  props: ComponentProps<typeof DropdownMenuPrimitive.Trigger>
) {
  return <DropdownMenuPrimitive.Trigger {...props} />;
}

export function DropdownMenuContent({
  align = "end",
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        className={cn(
          "border-border bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 min-w-48 overflow-hidden rounded-xl border p-1.5 shadow-[0_24px_48px_-24px_rgb(13_20_38/0.28)]",
          className
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

const MenuHeading = DropdownMenuPrimitive.Label;

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <MenuHeading
      className={cn(
        "text-muted-foreground tracking-eyebrow px-2.5 pt-1.5 pb-2 font-mono text-[11px]/3.5 font-medium uppercase",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuRadioGroup(
  props: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>
) {
  return <DropdownMenuPrimitive.RadioGroup {...props} />;
}

export function DropdownMenuRadioItem({
  children,
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        "text-foreground focus:bg-muted relative flex cursor-pointer items-center gap-2.5 rounded-lg py-2.5 pr-9 pl-2.5 font-sans text-sm/5 outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-[state=checked]:font-medium",
        className
      )}
      {...props}
    >
      {children}

      <span className="text-primary absolute right-2.5 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon aria-hidden="true" className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
    </DropdownMenuPrimitive.RadioItem>
  );
}
