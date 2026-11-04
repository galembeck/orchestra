import type { NavGroup } from "@orchestra/shared/types/navigation";
import { FooterLinkGroup } from "@orchestra/ui/components/footer/footer-link-group";
import { Logo } from "@orchestra/ui/components/logo/logo";
import { cn } from "@orchestra/ui/lib/utils";
import type { ComponentProps } from "react";

export interface FooterLabels {
  home: string;
  navigation: string;
}

export type FooterProps = ComponentProps<"footer"> & {
  description: string;
  groups: readonly NavGroup[];
  homeHref?: string;
  labels: FooterLabels;
  legal: string;
  tagline: string;
};

export function Footer({
  className,
  description,
  groups,
  homeHref = "/",
  labels,
  legal,
  tagline,
  ...props
}: FooterProps) {
  return (
    <footer
      className={cn(
        "dark bg-background text-foreground border-border border-t",
        className
      )}
      {...props}
    >
      <div className="max-w-page px-page mx-auto flex w-full flex-col gap-10 pt-14 pb-8 lg:gap-18 lg:pt-22 lg:pb-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-3 lg:w-90 lg:shrink-0 lg:gap-4">
            <Logo
              aria-label={labels.home}
              className="self-start"
              href={homeHref}
            />

            <p className="text-muted-foreground text-sm/5.5 lg:text-[15px]/6">
              {description}
            </p>
          </div>

          <nav
            aria-label={labels.navigation}
            className="grid grid-cols-2 gap-x-4 gap-y-8 lg:flex lg:gap-20"
          >
            {groups.map((group) => (
              <FooterLinkGroup group={group} key={group.title} />
            ))}
          </nav>
        </div>

        <div className="border-border flex flex-col gap-1.5 border-t pt-5 lg:flex-row lg:items-center lg:justify-between lg:pt-6">
          <p className="text-[13px]/4 text-[#6B7697]">{legal}</p>

          <p className="font-mono text-[11px]/3.5 tracking-widest text-[#6B7697] uppercase lg:text-xs/4">
            {tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
