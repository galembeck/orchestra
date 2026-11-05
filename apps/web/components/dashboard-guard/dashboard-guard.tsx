"use client";

import { useLocale } from "next-intl";
import { type ReactNode, useEffect } from "react";
import { localizeHref } from "@/i18n/localize-href";
import { useRouter } from "@/i18n/navigation";
import { useSessionCompany } from "@/lib/use-session-company";

export interface DashboardGuardProps {
  children: ReactNode;
}

export function DashboardGuard({ children }: DashboardGuardProps) {
  const locale = useLocale();
  const router = useRouter();
  const { company, isPending, session } = useSessionCompany();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session) {
      router.replace(localizeHref("/sign-in", locale));
      return;
    }

    if (!company) {
      router.replace(localizeHref("/company/register", locale));
    }
  }, [company, isPending, locale, router, session]);

  if (isPending || !(session && company)) {
    return null;
  }

  return children;
}
