"use client";

import { useLocale, useTranslations } from "next-intl";
import { use, useCallback, useEffect, useState } from "react";
import { localizeHref } from "@/i18n/localize-href";
import { Link, useRouter } from "@/i18n/navigation";
import { useSessionCompany } from "@/lib/use-session-company";

const ERROR_LABELS = {
  ALREADY_HAS_COMPANY: "alreadyHasCompany",
  INVITE_EMAIL_MISMATCH: "emailMismatch",
  INVITE_EXPIRED: "expired",
  INVITE_NOT_FOUND: "notFound",
} as const;

type ErrorKey = (typeof ERROR_LABELS)[keyof typeof ERROR_LABELS] | "generic";

export default function InviteAcceptPage({
  params,
}: PageProps<"/[locale]/invites/[token]/accept">) {
  const { token } = use(params);
  const t = useTranslations("inviteAccept");
  const locale = useLocale();
  const router = useRouter();
  const { isPending: isSessionPending, session } = useSessionCompany();
  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");
  const [errorKey, setErrorKey] = useState<ErrorKey>();

  const acceptInvite = useCallback(async () => {
    setStatus("pending");
    setErrorKey(undefined);

    const response = await fetch(`/api/invites/${token}/accept`, {
      method: "POST",
    });

    if (response.ok) {
      router.replace("/");
      router.refresh();
      return;
    }

    const body = (await response.json().catch(() => undefined)) as
      | { code?: string }
      | undefined;
    const key =
      (body?.code && ERROR_LABELS[body.code as keyof typeof ERROR_LABELS]) ||
      "generic";
    setErrorKey(key);
    setStatus("error");
  }, [router, token]);

  useEffect(() => {
    if (!isSessionPending && session && status === "idle") {
      acceptInvite();
    }
  }, [acceptInvite, isSessionPending, session, status]);

  if (isSessionPending) {
    return null;
  }

  if (!session) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-16 text-center">
        <h1 className="text-foreground text-xl font-semibold">
          {t("signInPrompt")}
        </h1>
        <Link
          className="text-foreground underline"
          href={localizeHref("/sign-in", locale)}
        >
          {t("signInLink")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-16 text-center">
      <h1 className="text-foreground text-xl font-semibold">{t("title")}</h1>

      {status === "pending" || status === "idle" ? (
        <p className="text-muted-foreground text-sm/5">{t("pending")}</p>
      ) : null}

      {status === "error" && errorKey ? (
        <p className="text-destructive text-sm/5" role="alert">
          {t(`errors.${errorKey}`)}
        </p>
      ) : null}
    </div>
  );
}
