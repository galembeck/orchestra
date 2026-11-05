"use client";

import { getUserPermissions } from "@orchestra/rbac/utils/get-user-permissions";
import { useTranslations } from "next-intl";
import { use, useCallback, useEffect, useState } from "react";
import { CompanySettingsForm } from "@/components/company-settings-form/company-settings-form";
import { TransferOwnershipDialog } from "@/components/transfer-ownership-dialog/transfer-ownership-dialog";
import { useSessionCompany } from "@/lib/use-session-company";

interface CompanyDetails {
  name: string;
  ownerId: string;
  slug: string;
}

interface MemberSummary {
  id: string;
  name: string;
  userId: string;
}

export default function CompanyOverviewPage({
  params,
}: PageProps<"/[locale]/company/[slug]">) {
  const { slug } = use(params);
  const t = useTranslations("companySettings");
  const { company: sessionCompany, session } = useSessionCompany();
  const [company, setCompany] = useState<CompanyDetails>();
  const [members, setMembers] = useState<MemberSummary[]>([]);

  const loadCompany = useCallback(async () => {
    const response = await fetch(`/api/companies/${slug}`);
    if (response.ok) {
      setCompany((await response.json()) as CompanyDetails);
    }
  }, [slug]);

  const handleRenamed = useCallback((name: string) => {
    setCompany((previous) => (previous ? { ...previous, name } : previous));
  }, []);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  useEffect(() => {
    if (!(company && session) || session.user.id !== company.ownerId) {
      return;
    }

    fetch(`/api/companies/${slug}/members`)
      .then((response) => (response.ok ? response.json() : undefined))
      .then((data: { members: MemberSummary[] } | undefined) => {
        if (data) {
          setMembers(
            data.members.filter((member) => member.userId !== company.ownerId)
          );
        }
      });
  }, [company, session, slug]);

  if (!(company && session && sessionCompany)) {
    return null;
  }

  const { can } = getUserPermissions(session.user.id, sessionCompany.role);
  const authCompany = {
    __typename: "Company" as const,
    id: company.slug,
    ownerId: company.ownerId,
  };
  const canUpdate = can("update", authCompany);
  const canTransfer = can("transfer_ownership", authCompany);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10">
      <h1 className="text-foreground text-2xl font-semibold">{t("title")}</h1>

      {canUpdate ? (
        <CompanySettingsForm
          initialName={company.name}
          onRenamed={handleRenamed}
          slug={slug}
        />
      ) : (
        <p className="text-foreground text-base/6">{company.name}</p>
      )}

      {canTransfer ? (
        <TransferOwnershipDialog
          members={members}
          onTransferred={loadCompany}
          slug={slug}
        />
      ) : null}
    </div>
  );
}
