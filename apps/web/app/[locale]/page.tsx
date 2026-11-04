import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero/hero";
import { SiteHeader } from "@/components/site-header/site-header";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <>
      <SiteHeader />

      <main>
        <Hero />
      </main>
    </>
  );
}
