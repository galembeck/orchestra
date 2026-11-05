"use client";

import { getUserPermissions } from "@orchestra/rbac/utils/get-user-permissions";
import { useTranslations } from "next-intl";
import { use, useCallback, useEffect, useState } from "react";
import {
  CompanyJobRolesForm,
  type JobRoleCatalogEntry,
} from "@/components/company-job-roles-form/company-job-roles-form";
import { useSessionCompany } from "@/lib/use-session-company";

interface CompanyDetails {
  name: string;
  ownerId: string;
  slug: string;
}

export default function CompanyJobRolesPage({
  params,
}: PageProps<"/[locale]/company/[slug]/job-roles">) {
  const { slug } = use(params);
  const t = useTranslations("companyJobRoles");
  const { company: sessionCompany, session } = useSessionCompany();
  const [company, setCompany] = useState<CompanyDetails>();
  const [allJobRoles, setAllJobRoles] = useState<JobRoleCatalogEntry[]>([]);
  const [selectedJobRoleIds, setSelectedJobRoleIds] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/companies/${slug}`)
      .then((response) => (response.ok ? response.json() : undefined))
      .then((data: CompanyDetails | undefined) => {
        if (data) {
          setCompany(data);
        }
      });

    fetch("/api/job-roles")
      .then((response) => (response.ok ? response.json() : undefined))
      .then((data: { jobRoles: JobRoleCatalogEntry[] } | undefined) => {
        if (data) {
          setAllJobRoles(data.jobRoles);
        }
      });

    fetch(`/api/companies/${slug}/job-roles`)
      .then((response) => (response.ok ? response.json() : undefined))
      .then((data: { jobRoles: { id: string }[] } | undefined) => {
        if (data) {
          setSelectedJobRoleIds(data.jobRoles.map((jobRole) => jobRole.id));
        }
      });
  }, [slug]);

  const handleSaved = useCallback((jobRoleIds: string[]) => {
    setSelectedJobRoleIds(jobRoleIds);
  }, []);

  if (!(company && session && sessionCompany)) {
    return null;
  }

  const { can } = getUserPermissions(session.user.id, sessionCompany.role);
  const canEdit = can("update", {
    __typename: "Company" as const,
    id: company.slug,
    ownerId: company.ownerId,
  });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10">
      <h1 className="text-foreground text-2xl font-semibold">{t("title")}</h1>

      <CompanyJobRolesForm
        allJobRoles={allJobRoles}
        canEdit={canEdit}
        onSaved={handleSaved}
        selectedJobRoleIds={selectedJobRoleIds}
        slug={slug}
      />
    </div>
  );
}
