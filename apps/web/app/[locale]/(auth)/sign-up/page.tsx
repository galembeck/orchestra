import {
  AUTH_ERROR_QUERY_PARAM,
  toOAuthFormError,
} from "@orchestra/shared/constants/auth";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SignUpForm } from "@/components/sign-up-form/sign-up-form";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sign-up">): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "auth.signUp" });

  return { title: t("metaTitle") };
}

export default async function SignUpPage({
  params,
  searchParams,
}: PageProps<"/[locale]/sign-up">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const query = await searchParams;
  const errorCode = query[AUTH_ERROR_QUERY_PARAM];

  return (
    <SignUpForm
      initialError={toOAuthFormError(
        typeof errorCode === "string" ? errorCode : undefined
      )}
    />
  );
}
