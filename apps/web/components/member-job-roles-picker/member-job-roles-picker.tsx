"use client";

import { cn } from "@orchestra/ui/lib/utils";
import { useCallback, useState } from "react";

export interface JobRoleOption {
  id: string;
  key: string;
}

export interface MemberJobRolesPickerProps {
  assignedJobRoleIds: string[];
  companyJobRoles: JobRoleOption[];
  memberId: string;
  onUpdated: (jobRoleIds: string[]) => void;
  slug: string;
}

export function MemberJobRolesPicker({
  assignedJobRoleIds,
  companyJobRoles,
  memberId,
  onUpdated,
  slug,
}: MemberJobRolesPickerProps) {
  const [isSaving, setIsSaving] = useState(false);

  const toggle = useCallback(
    async (jobRoleId: string) => {
      const nextIds = assignedJobRoleIds.includes(jobRoleId)
        ? assignedJobRoleIds.filter((id) => id !== jobRoleId)
        : [...assignedJobRoleIds, jobRoleId];

      setIsSaving(true);
      const response = await fetch(
        `/api/companies/${slug}/members/${memberId}/job-roles`,
        {
          body: JSON.stringify({ jobRoleIds: nextIds }),
          headers: { "content-type": "application/json" },
          method: "PUT",
        }
      );
      setIsSaving(false);

      if (response.ok) {
        onUpdated(nextIds);
      }
    },
    [assignedJobRoleIds, memberId, onUpdated, slug]
  );

  if (companyJobRoles.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {companyJobRoles.map((jobRole) => (
        <JobRoleToggle
          isAssigned={assignedJobRoleIds.includes(jobRole.id)}
          isSaving={isSaving}
          jobRole={jobRole}
          key={jobRole.id}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}

interface JobRoleToggleProps {
  isAssigned: boolean;
  isSaving: boolean;
  jobRole: JobRoleOption;
  onToggle: (jobRoleId: string) => void;
}

function JobRoleToggle({
  isAssigned,
  isSaving,
  jobRole,
  onToggle,
}: JobRoleToggleProps) {
  const handleClick = useCallback(() => {
    onToggle(jobRole.id);
  }, [jobRole.id, onToggle]);

  return (
    <button
      aria-pressed={isAssigned}
      className={cn(
        "cursor-pointer rounded-full border px-2.5 py-1 text-xs/4 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        isAssigned
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:bg-muted"
      )}
      disabled={isSaving}
      onClick={handleClick}
      type="button"
    >
      {jobRole.key}
    </button>
  );
}
