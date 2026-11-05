"use client";

import { Button } from "@orchestra/ui/components/button/button";
import { MailCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { ResendVerificationButton } from "@/components/resend-verification-button/resend-verification-button";

export interface CheckEmailNoticeProps {
  email: string;
  onUseAnotherEmail: () => void;
}

export function CheckEmailNotice({
  email,
  onUseAnotherEmail,
}: CheckEmailNoticeProps) {
  const t = useTranslations("auth.checkEmail");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <span className="bg-accent text-accent-foreground flex size-14 items-center justify-center rounded-2xl">
        <MailCheckIcon aria-hidden="true" className="size-6" />
      </span>

      <div className="flex flex-col gap-3">
        <h1
          className="text-foreground font-serif text-[40px]/11 font-normal tracking-tight outline-none lg:text-5xl/13"
          ref={headingRef}
          tabIndex={-1}
        >
          {t("title")}
        </h1>

        <p className="text-muted-foreground text-base/6">
          {t.rich("description", {
            email: () => (
              <strong className="text-foreground font-medium">{email}</strong>
            ),
          })}
        </p>
      </div>

      <div className="border-border flex flex-col gap-4 rounded-2xl border p-5">
        <p className="text-muted-foreground text-sm/5">{t("notReceived")}</p>

        <ResendVerificationButton email={email} />
      </div>

      <Button
        className="w-full cursor-pointer"
        onClick={onUseAnotherEmail}
        size="lg"
        variant="outline"
      >
        {t("useAnotherEmail")}
      </Button>
    </div>
  );
}
