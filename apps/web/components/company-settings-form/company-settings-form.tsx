"use client";

import { SubmitButton } from "@orchestra/ui/components/submit-button/submit-button";
import { TextField } from "@orchestra/ui/components/text-field/text-field";
import { useTranslations } from "next-intl";
import { type FormEvent, useCallback, useState } from "react";

export interface CompanySettingsFormProps {
  initialName: string;
  onRenamed: (name: string) => void;
  slug: string;
}

export function CompanySettingsForm({
  initialName,
  onRenamed,
  slug,
}: CompanySettingsFormProps) {
  const t = useTranslations("companySettings");
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

      const response = await fetch(`/api/companies/${slug}`, {
        body: JSON.stringify({ name: name.trim() }),
        headers: { "content-type": "application/json" },
        method: "PATCH",
      });

      setIsPending(false);

      if (response.ok) {
        onRenamed(name.trim());
        return;
      }

      setError(t("errors.generic"));
    },
    [onRenamed, slug, t]
  );

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {error ? (
        <p className="text-destructive text-sm/5" role="alert">
          {error}
        </p>
      ) : null}

      <TextField
        defaultValue={initialName}
        label={t("nameLabel")}
        name="name"
        required
      />

      <SubmitButton isPending={isPending} pendingLabel={t("pending")}>
        {t("submit")}
      </SubmitButton>
    </form>
  );
}
