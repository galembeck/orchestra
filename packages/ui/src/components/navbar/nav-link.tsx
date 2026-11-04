import { cn } from "@orchestra/ui/lib/utils";
import type { ComponentProps } from "react";

export type NavLinkProps = ComponentProps<"a"> & {
  active?: boolean;
};

export function NavLink({ active = false, className, ...props }: NavLinkProps) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cn(
        "hover:text-foreground focus-visible:outline-ring rounded-sm font-sans text-[15px]/4.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4",
        active ? "text-foreground" : "text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
