"use client";

import { SubmitButton } from "@orchestra/ui/components/submit-button/submit-button";
import { TextField } from "@orchestra/ui/components/text-field/text-field";
import { useTranslations } from "next-intl";
import { type FormEvent, useCallback, useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function CompanyRegisterForm() {
  const t = useTranslations("companyRegister");
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const name = new FormData(form).get("name");

      if (typeof name !== "string" || name.trim().length === 0) {
        return;
      }

      setError(undefined);
      setIsPending(true);

      const response = await fetch("/api/companies", {
        body: JSON.stringify({ name: name.trim() }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });

      if (response.ok) {
        const { slug } = (await response.json()) as { slug: string };
        router.replace(`/company/${slug}`);
        router.refresh();
        return;
      }

      setIsPending(false);
      const body = (await response.json().catch(() => undefined)) as
        | { code?: string }
        | undefined;
      setError(
        body?.code === "ALREADY_HAS_COMPANY"
          ? t("errors.alreadyHasCompany")
          : t("errors.generic")
      );
    },
    [router, t]
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-foreground text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm/5">{t("description")}</p>
      </div>

      {error ? (
        <p className="text-destructive text-sm/5" role="alert">
          {error}
        </p>
      ) : null}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <TextField
          autoComplete="organization"
          label={t("nameLabel")}
          name="name"
          placeholder={t("namePlaceholder")}
          required
        />

        <SubmitButton
          className="w-full"
          isPending={isPending}
          pendingLabel={t("pending")}
          size="lg"
        >
          {t("submit")}
        </SubmitButton>
      </form>
    </div>
  );
}
