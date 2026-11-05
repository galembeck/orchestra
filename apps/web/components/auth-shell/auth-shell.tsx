import { Logo } from "@orchestra/ui/components/logo/logo";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { AuthShowcase } from "@/components/auth-shell/auth-showcase";
import { SiteControls } from "@/components/site-controls/site-controls";
import { localizeHref } from "@/i18n/localize-href";

export interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  const t = useTranslations("navigation");
  const locale = useLocale();

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex min-w-0 flex-col">
        <header className="px-page flex items-center justify-between pt-3 pb-4 lg:py-7">
          <Logo aria-label={t("home")} href={localizeHref("/", locale)} />

          <div className="flex items-center gap-1.5">
            <SiteControls />
          </div>
        </header>

        <main className="px-page flex grow items-center justify-center py-10 lg:py-16">
          <div className="w-full max-w-105">{children}</div>
        </main>
      </div>

      <AuthShowcase className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh" />
    </div>
  );
}
