"use client";

import type { AuthFormErrorKey } from "@orchestra/shared/constants/auth";
import { SIGN_UP_LINK } from "@orchestra/shared/constants/navigation";
import { FormAlert } from "@orchestra/ui/components/form-alert/form-alert";
import { TEXT_LINK_CLASS_NAME } from "@orchestra/ui/lib/text-link-styles";
import { cn } from "@orchestra/ui/lib/utils";
import { useTranslations } from "next-intl";
import { ResendVerificationButton } from "@/components/resend-verification-button/resend-verification-button";
import { Link } from "@/i18n/navigation";

export interface AuthFormErrorProps {
  email?: string;
  errorKey: AuthFormErrorKey;
}

function AuthFormErrorAction({ email, errorKey }: AuthFormErrorProps) {
  const t = useTranslations("auth.formErrors");

  if (errorKey === "emailNotVerified" && email) {
    return <ResendVerificationButton email={email} />;
  }

  if (errorKey === "signUpRequired") {
    return (
      <Link
        className={cn(TEXT_LINK_CLASS_NAME, "self-start")}
        href={SIGN_UP_LINK.href}
      >
        {t("signUpAction")}
      </Link>
    );
  }

  return null;
}

export function AuthFormError({ email, errorKey }: AuthFormErrorProps) {
  const t = useTranslations("auth.formErrors");

  return (
    <FormAlert
      action={<AuthFormErrorAction email={email} errorKey={errorKey} />}
    >
      {t(errorKey)}
    </FormAlert>
  );
}
