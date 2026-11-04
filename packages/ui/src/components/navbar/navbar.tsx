import type { NavItem } from "@orchestra/shared/types/navigation";
import { ButtonLink } from "@orchestra/ui/components/button/button";
import { Logo } from "@orchestra/ui/components/logo/logo";
import { MobileMenu } from "@orchestra/ui/components/navbar/mobile-menu";
import { NavLinks } from "@orchestra/ui/components/navbar/nav-links";
import { cn } from "@orchestra/ui/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export interface NavbarLabels {
  closeMenu: string;
  home: string;
  navigation: string;
  openMenu: string;
}

export type NavbarProps = ComponentProps<"header"> & {
  activeHref?: string;
  controls?: ReactNode;
  cta: NavItem;
  homeHref?: string;
  items: readonly NavItem[];
  labels: NavbarLabels;
  signIn: NavItem;
};

export function Navbar({
  activeHref,
  className,
  controls,
  cta,
  homeHref = "/",
  items,
  labels,
  signIn,
  ...props
}: NavbarProps) {
  const currentHref = activeHref ?? items[0]?.href;

  return (
    <header
      className={cn(
        "border-border bg-background relative flex items-center justify-between border-b px-5 pt-3 pb-4 md:px-10 lg:py-7 xl:px-20",
        className
      )}
      {...props}
    >
      <Logo aria-label={labels.home} href={homeHref} />

      <nav aria-label={labels.navigation} className="hidden lg:block">
        <NavLinks activeHref={currentHref} items={items} />
      </nav>

      <div className="hidden items-center gap-3 lg:flex">
        {controls ? (
          <div className="flex items-center gap-1.5">{controls}</div>
        ) : null}

        <ButtonLink className="px-4 py-2.5" href={signIn.href} variant="ghost">
          {signIn.label}
        </ButtonLink>

        <ButtonLink href={cta.href}>
          {cta.label}
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </ButtonLink>
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <ButtonLink href={signIn.href} size="sm">
          {signIn.label}
        </ButtonLink>

        <MobileMenu
          activeHref={currentHref}
          closeLabel={labels.closeMenu}
          cta={cta}
          items={items}
          openLabel={labels.openMenu}
        >
          {controls}
        </MobileMenu>
      </div>
    </header>
  );
}
