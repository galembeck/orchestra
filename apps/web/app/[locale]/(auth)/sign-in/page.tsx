import {
  AUTH_ERROR_QUERY_PARAM,
  toOAuthFormError,
} from "@orchestra/shared/constants/auth";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SignInForm } from "@/components/sign-in-form/sign-in-form";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sign-in">): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "auth.signIn" });

  return { title: t("metaTitle") };
}

export default async function SignInPage({
  params,
  searchParams,
}: PageProps<"/[locale]/sign-in">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const query = await searchParams;
  const errorCode = query[AUTH_ERROR_QUERY_PARAM];

  return (
    <SignInForm
      initialError={toOAuthFormError(
        typeof errorCode === "string" ? errorCode : undefined
      )}
    />
  );
}
