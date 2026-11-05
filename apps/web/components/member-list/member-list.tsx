"use client";

import { Button } from "@orchestra/ui/components/button/button";
import { useTranslations } from "next-intl";
import { type ChangeEvent, useCallback } from "react";
import { MemberJobRolesPicker } from "@/components/member-job-roles-picker/member-job-roles-picker";

const COMPANY_ROLES = ["ADMIN", "BILLING", "MEMBER"] as const;
type CompanyRole = (typeof COMPANY_ROLES)[number];

export interface MemberListItem {
  email: string;
  id: string;
  jobRoles: { id: string; key: string }[];
  name: string;
  role: CompanyRole;
  userId: string;
}

export interface MemberListProps {
  canManage: boolean;
  companyJobRoles: { id: string; key: string }[];
  members: MemberListItem[];
  onChanged: () => void;
  ownerId: string;
  slug: string;
}

export function MemberList({
  canManage,
  companyJobRoles,
  members,
  onChanged,
  ownerId,
  slug,
}: MemberListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {members.map((member) => (
        <MemberRow
          canManage={canManage}
          companyJobRoles={companyJobRoles}
          isOwner={member.userId === ownerId}
          key={member.id}
          member={member}
          onChanged={onChanged}
          slug={slug}
        />
      ))}
    </ul>
  );
}

interface MemberRowProps {
  canManage: boolean;
  companyJobRoles: { id: string; key: string }[];
  isOwner: boolean;
  member: MemberListItem;
  onChanged: () => void;
  slug: string;
}

function MemberRow({
  canManage,
  companyJobRoles,
  isOwner,
  member,
  onChanged,
  slug,
}: MemberRowProps) {
  const t = useTranslations("membersPage");

  const handleRoleChange = useCallback(
    async (event: ChangeEvent<HTMLSelectElement>) => {
      const response = await fetch(
        `/api/companies/${slug}/members/${member.id}`,
        {
          body: JSON.stringify({ role: event.target.value }),
          headers: { "content-type": "application/json" },
          method: "PATCH",
        }
      );
      if (response.ok) {
        onChanged();
      }
    },
    [member.id, onChanged, slug]
  );

  const handleRemove = useCallback(async () => {
    const response = await fetch(
      `/api/companies/${slug}/members/${member.id}`,
      { method: "DELETE" }
    );
    if (response.ok) {
      onChanged();
    }
  }, [member.id, onChanged, slug]);

  return (
    <li className="border-border flex flex-col gap-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-foreground text-sm/5 font-medium">{member.name}</p>
          <p className="text-muted-foreground text-sm/5">{member.email}</p>
        </div>

        {canManage && !isOwner ? (
          <div className="flex items-center gap-2">
            <select
              className="border-input bg-card text-foreground h-9 rounded-lg border px-2 text-sm/5"
              defaultValue={member.role}
              onChange={handleRoleChange}
            >
              {COMPANY_ROLES.map((role) => (
                <option key={role} value={role}>
                  {t(`roles.${role}`)}
                </option>
              ))}
            </select>

            <Button onClick={handleRemove} size="sm" variant="outline">
              {t("remove")}
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm/5">
            {t(`roles.${member.role}`)}
          </p>
        )}
      </div>

      {canManage ? (
        <MemberJobRolesPicker
          assignedJobRoleIds={member.jobRoles.map((role) => role.id)}
          companyJobRoles={companyJobRoles}
          memberId={member.id}
          onUpdated={onChanged}
          slug={slug}
        />
      ) : (
        <ReadOnlyJobRoles jobRoles={member.jobRoles} />
      )}
    </li>
  );
}

function ReadOnlyJobRoles({
  jobRoles,
}: {
  jobRoles: { id: string; key: string }[];
}) {
  if (jobRoles.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {jobRoles.map((role) => (
        <span
          className="border-border text-muted-foreground rounded-full border px-2.5 py-1 text-xs/4 font-medium"
          key={role.id}
        >
          {role.key}
        </span>
      ))}
    </div>
  );
}
