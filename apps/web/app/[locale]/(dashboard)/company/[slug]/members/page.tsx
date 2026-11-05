"use client";

import { getUserPermissions } from "@orchestra/rbac/utils/get-user-permissions";
import { useTranslations } from "next-intl";
import { use, useCallback, useEffect, useState } from "react";
import { InviteMemberForm } from "@/components/invite-member-form/invite-member-form";
import {
  MemberList,
  type MemberListItem,
} from "@/components/member-list/member-list";
import { useSessionCompany } from "@/lib/use-session-company";

interface CompanyDetails {
  name: string;
  ownerId: string;
  slug: string;
}

interface JobRoleSummary {
  id: string;
  key: string;
}

export default function MembersPage({
  params,
}: PageProps<"/[locale]/company/[slug]/members">) {
  const { slug } = use(params);
  const t = useTranslations("membersPage");
  const { company: sessionCompany, session } = useSessionCompany();
  const [company, setCompany] = useState<CompanyDetails>();
  const [members, setMembers] = useState<MemberListItem[]>([]);
  const [companyJobRoles, setCompanyJobRoles] = useState<JobRoleSummary[]>([]);

  const loadCompany = useCallback(async () => {
    const response = await fetch(`/api/companies/${slug}`);
    if (response.ok) {
      setCompany((await response.json()) as CompanyDetails);
    }
  }, [slug]);

  const loadMembers = useCallback(async () => {
    const response = await fetch(`/api/companies/${slug}/members`);
    if (response.ok) {
      const data = (await response.json()) as { members: MemberListItem[] };
      setMembers(data.members);
    }
  }, [slug]);

  const loadCompanyJobRoles = useCallback(async () => {
    const response = await fetch(`/api/companies/${slug}/job-roles`);
    if (response.ok) {
      const data = (await response.json()) as { jobRoles: JobRoleSummary[] };
      setCompanyJobRoles(data.jobRoles);
    }
  }, [slug]);

  useEffect(() => {
    loadCompany();
    loadMembers();
    loadCompanyJobRoles();
  }, [loadCompany, loadMembers, loadCompanyJobRoles]);

  if (!(company && session && sessionCompany)) {
    return null;
  }

  const { can } = getUserPermissions(session.user.id, sessionCompany.role);
  const canManage = can("manage", "Member");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10">
      <h1 className="text-foreground text-2xl font-semibold">{t("title")}</h1>

      {canManage ? <InviteMemberForm slug={slug} /> : null}

      <MemberList
        canManage={canManage}
        companyJobRoles={companyJobRoles}
        members={members}
        onChanged={loadMembers}
        ownerId={company.ownerId}
        slug={slug}
      />
    </div>
  );
}
