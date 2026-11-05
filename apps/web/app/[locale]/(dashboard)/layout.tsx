import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { DashboardGuard } from "@/components/dashboard-guard/dashboard-guard";
import { routing } from "@/i18n/routing";

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <DashboardGuard>{children}</DashboardGuard>;
}
