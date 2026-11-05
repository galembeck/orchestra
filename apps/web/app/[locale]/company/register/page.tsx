import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth-shell/auth-shell";
import { CompanyRegisterForm } from "@/components/company-register-form/company-register-form";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/company/register">): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "companyRegister" });

  return { title: t("title") };
}

export default async function CompanyRegisterPage({
  params,
}: PageProps<"/[locale]/company/register">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <AuthShell>
      <CompanyRegisterForm />
    </AuthShell>
  );
}
