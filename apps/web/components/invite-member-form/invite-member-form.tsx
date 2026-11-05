"use client";

import { Button } from "@orchestra/ui/components/button/button";
import { SubmitButton } from "@orchestra/ui/components/submit-button/submit-button";
import { TextField } from "@orchestra/ui/components/text-field/text-field";
import { useTranslations } from "next-intl";
import { type FormEvent, useCallback, useEffect, useId, useState } from "react";

const COMPANY_ROLES = ["ADMIN", "BILLING", "MEMBER"] as const;

interface PendingInvite {
  email: string;
  id: string;
  role: string;
}

export interface InviteMemberFormProps {
  slug: string;
}

export function InviteMemberForm({ slug }: InviteMemberFormProps) {
  const t = useTranslations("membersPage.inviteForm");
  const roleSelectId = useId();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();
  const [invites, setInvites] = useState<PendingInvite[]>([]);

  const loadInvites = useCallback(async () => {
    const response = await fetch(`/api/companies/${slug}/invites`);
    if (response.ok) {
      const data = (await response.json()) as { invites: PendingInvite[] };
      setInvites(data.invites);
    }
  }, [slug]);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const email = data.get("email");
      const role = data.get("role");

      if (typeof email !== "string" || !email) {
        return;
      }

      setError(undefined);
      setIsPending(true);

      const response = await fetch(`/api/companies/${slug}/invites`, {
        body: JSON.stringify({ email, role }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });

      setIsPending(false);

      if (response.ok) {
        form.reset();
        loadInvites();
        return;
      }

      setError(t("errors.generic"));
    },
    [loadInvites, slug, t]
  );

  const handleRevoke = useCallback(
    async (inviteId: string) => {
      const response = await fetch(
        `/api/companies/${slug}/invites/${inviteId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        loadInvites();
      }
    },
    [loadInvites, slug]
  );

  return (
    <div className="flex flex-col gap-5">
      {error ? (
        <p className="text-destructive text-sm/5" role="alert">
          {error}
        </p>
      ) : null}

      <form className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit}>
        <TextField label={t("emailLabel")} name="email" required type="email" />

        <div className="flex flex-col gap-2">
          <label
            className="text-foreground text-sm/5 font-medium"
            htmlFor={roleSelectId}
          >
            {t("roleLabel")}
          </label>
          <select
            className="border-input bg-card text-foreground h-12 rounded-xl border px-4 text-base/5"
            defaultValue="MEMBER"
            id={roleSelectId}
            name="role"
          >
            {COMPANY_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <SubmitButton isPending={isPending} pendingLabel={t("pending")}>
          {t("submit")}
        </SubmitButton>
      </form>

      {invites.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground text-sm/5 font-medium">
            {t("pendingTitle")}
          </h2>
          <ul className="flex flex-col gap-2">
            {invites.map((invite) => (
              <InvitePendingRow
                invite={invite}
                key={invite.id}
                onRevoke={handleRevoke}
                revokeLabel={t("revoke")}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

interface InvitePendingRowProps {
  invite: PendingInvite;
  onRevoke: (inviteId: string) => void;
  revokeLabel: string;
}

function InvitePendingRow({
  invite,
  onRevoke,
  revokeLabel,
}: InvitePendingRowProps) {
  const handleClick = useCallback(() => {
    onRevoke(invite.id);
  }, [invite.id, onRevoke]);

  return (
    <li className="border-border flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
      <span className="text-foreground text-sm/5">{invite.email}</span>
      <Button onClick={handleClick} size="sm" variant="outline">
        {revokeLabel}
      </Button>
    </li>
  );
}
