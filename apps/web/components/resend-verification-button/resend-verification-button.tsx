"use client";

import { TEXT_LINK_CLASS_NAME } from "@orchestra/ui/lib/text-link-styles";
import { cn } from "@orchestra/ui/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { localizeHref } from "@/i18n/localize-href";
import { authClient } from "@/lib/auth-client";

const RESEND_COOLDOWN_SECONDS = 60;
const ONE_SECOND_MS = 1000;

type ResendStatus = "error" | "idle" | "pending" | "sent";

export interface ResendVerificationButtonProps {
  className?: string;
  email: string;
}

export function ResendVerificationButton({
  className,
  email,
}: ResendVerificationButtonProps) {
  const t = useTranslations("auth.resend");
  const locale = useLocale();
  const [status, setStatus] = useState<ResendStatus>("idle");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = setTimeout(
      () => setCooldown((value) => value - 1),
      ONE_SECOND_MS
    );
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resend = useCallback(async () => {
    setStatus("pending");

    const { error } = await authClient.sendVerificationEmail({
      callbackURL: localizeHref("/", locale),
      email,
    });

    setStatus(error ? "error" : "sent");

    if (!error) {
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }
  }, [email, locale]);

  const isDisabled = status === "pending" || cooldown > 0;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <button
        className={cn(
          TEXT_LINK_CLASS_NAME,
          "self-start text-sm/5 disabled:cursor-not-allowed disabled:opacity-60"
        )}
        disabled={isDisabled}
        onClick={resend}
        type="button"
      >
        {cooldown > 0 ? t("cooldown", { seconds: cooldown }) : t("action")}
      </button>

      <p aria-live="polite" className="text-muted-foreground text-[13px]/4.5">
        {status === "sent" ? t("sent") : null}
        {status === "error" ? t("error") : null}
      </p>
    </div>
  );
}
