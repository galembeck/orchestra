import type { NavItem } from "@orchestra/shared/types/navigation";
import { NavLink } from "@orchestra/ui/components/navbar/nav-link";
import { cn } from "@orchestra/ui/lib/utils";
import type { ComponentProps } from "react";

export type NavLinksProps = ComponentProps<"ul"> & {
  activeHref?: string;
  items: readonly NavItem[];
};

export function NavLinks({
  activeHref,
  className,
  items,
  ...props
}: NavLinksProps) {
  return (
    <ul
      className={cn("flex items-center gap-6 xl:gap-10", className)}
      {...props}
    >
      {items.map((item) => (
        <li key={item.href}>
          <NavLink active={item.href === activeHref} href={item.href}>
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
