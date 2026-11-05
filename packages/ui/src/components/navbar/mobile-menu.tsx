"use client";

import type { NavItem } from "@orchestra/shared/types/navigation";
import { Button, ButtonLink } from "@orchestra/ui/components/button/button";
import { cn } from "@orchestra/ui/lib/utils";
import { ArrowRightIcon, EqualIcon, XIcon } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useId, useState } from "react";

export interface MobileMenuProps {
  activeHref?: string;
  children?: ReactNode;
  className?: string;
  closeLabel: string;
  cta: NavItem;
  items: readonly NavItem[];
  openLabel: string;
  profileMenu?: ReactNode;
}

export function MobileMenu({
  activeHref,
  children,
  className,
  closeLabel,
  cta,
  items,
  openLabel,
  profileMenu,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  return (
    <div className={className}>
      <Button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        className="cursor-pointer"
        onClick={toggle}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon aria-hidden="true" className="size-4.5" />
        ) : (
          <EqualIcon aria-hidden="true" className="size-4.5" />
        )}
      </Button>

      <div
        className={cn(
          "border-border bg-background absolute inset-x-0 top-full z-50 border-b px-5 pt-2 pb-6 shadow-[0_24px_48px_-24px_rgb(13_20_38/0.18)]",
          open ? "block" : "hidden"
        )}
        id={panelId}
      >
        <ul className="flex flex-col">
          {items.map((item) => {
            const active = item.href === activeHref;
            return (
              <li className="border-border border-b" key={item.href}>
                <a
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "hover:text-foreground flex items-center justify-between py-4 font-sans text-[17px]/6 font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                  href={item.href}
                  onClick={close}
                >
                  {item.label}
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="text-muted-foreground size-4"
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {profileMenu ?? (
          <ButtonLink className="mt-6 w-full" href={cta.href} onClick={close}>
            {cta.label}
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </ButtonLink>
        )}

        {children ? (
          <div className="mt-5 flex items-center justify-center gap-2">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
