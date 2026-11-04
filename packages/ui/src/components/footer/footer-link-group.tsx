import type { NavGroup } from "@orchestra/shared/types/navigation";
import { cn } from "@orchestra/ui/lib/utils";
import { useId } from "react";

export interface FooterLinkGroupProps {
  className?: string;
  group: NavGroup;
}

export function FooterLinkGroup({ className, group }: FooterLinkGroupProps) {
  const headingId = useId();

  return (
    <div className={cn("flex flex-col gap-3 lg:gap-3.5", className)}>
      <h2
        className="tracking-eyebrow font-mono text-[11px]/3.5 font-normal text-[#6B7697] uppercase lg:text-xs/4"
        id={headingId}
      >
        {group.title}
      </h2>

      <ul
        aria-labelledby={headingId}
        className="flex flex-col gap-3 lg:gap-3.5"
      >
        {group.links.map((link) => (
          <li key={link.href}>
            <a
              className="text-foreground/90 hover:text-foreground focus-visible:outline-ring rounded-sm text-[15px]/4.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
              href={link.href}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
