"use client";

import { SubmitButton } from "@orchestra/ui/components/submit-button/submit-button";
import { useTranslations } from "next-intl";
import { type FormEvent, useCallback, useId, useState } from "react";

export interface JobRoleCatalogEntry {
  id: string;
  key: string;
}

export interface CompanyJobRolesFormProps {
  allJobRoles: JobRoleCatalogEntry[];
  canEdit: boolean;
  onSaved: (jobRoleIds: string[]) => void;
  selectedJobRoleIds: string[];
  slug: string;
}

export function CompanyJobRolesForm({
  allJobRoles,
  canEdit,
  onSaved,
  selectedJobRoleIds,
  slug,
}: CompanyJobRolesFormProps) {
  const t = useTranslations("companyJobRoles");
  const [selected, setSelected] = useState(new Set(selectedJobRoleIds));
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const jobRoleIds = [...selected];
      setError(undefined);
      setIsPending(true);

      const response = await fetch(`/api/companies/${slug}/job-roles`, {
        body: JSON.stringify({ jobRoleIds }),
        headers: { "content-type": "application/json" },
        method: "PUT",
      });

      setIsPending(false);

      if (response.ok) {
        onSaved(jobRoleIds);
        return;
      }

      setError(t("errors.generic"));
    },
    [onSaved, selected, slug, t]
  );

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {error ? (
        <p className="text-destructive text-sm/5" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {allJobRoles.map((jobRole) => (
          <JobRoleCheckbox
            canEdit={canEdit}
            isSelected={selected.has(jobRole.id)}
            jobRole={jobRole}
            key={jobRole.id}
            onChange={setSelected}
          />
        ))}
      </ul>

      {canEdit ? (
        <SubmitButton
          className="w-fit"
          isPending={isPending}
          pendingLabel={t("pending")}
        >
          {t("submit")}
        </SubmitButton>
      ) : null}
    </form>
  );
}

interface JobRoleCheckboxProps {
  canEdit: boolean;
  isSelected: boolean;
  jobRole: JobRoleCatalogEntry;
  onChange: (updater: (previous: Set<string>) => Set<string>) => void;
}

function JobRoleCheckbox({
  canEdit,
  isSelected,
  jobRole,
  onChange,
}: JobRoleCheckboxProps) {
  const inputId = useId();

  const handleChange = useCallback(() => {
    onChange((previous) => {
      const next = new Set(previous);
      if (next.has(jobRole.id)) {
        next.delete(jobRole.id);
      } else {
        next.add(jobRole.id);
      }
      return next;
    });
  }, [jobRole.id, onChange]);

  return (
    <li className="flex items-center gap-2">
      <input
        checked={isSelected}
        className="size-4 cursor-pointer disabled:cursor-not-allowed"
        disabled={!canEdit}
        id={inputId}
        onChange={handleChange}
        type="checkbox"
      />
      <label className="text-foreground text-sm/5" htmlFor={inputId}>
        {jobRole.key}
      </label>
    </li>
  );
}
