"use client";

import type { AuthFormErrorKey } from "@orchestra/shared/constants/auth";
import {
  SIGN_IN_LINK,
  SIGN_UP_LINK,
} from "@orchestra/shared/constants/navigation";
import { useSchemaForm } from "@orchestra/shared/hooks/use-schema-form";
import { signInSchema } from "@orchestra/shared/schemas/auth";
import { resolveAuthError } from "@orchestra/shared/utils/resolve-auth-error";
import { Divider } from "@orchestra/ui/components/divider/divider";
import { PasswordField } from "@orchestra/ui/components/password-field/password-field";
import { SubmitButton } from "@orchestra/ui/components/submit-button/submit-button";
import { TextField } from "@orchestra/ui/components/text-field/text-field";
import { TEXT_LINK_CLASS_NAME } from "@orchestra/ui/lib/text-link-styles";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useCallback, useState } from "react";
import { AuthFormError } from "@/components/auth-form-error/auth-form-error";
import { AuthFormHeader } from "@/components/auth-form-header/auth-form-header";
import { GoogleAuthButton } from "@/components/google-auth-button/google-auth-button";
import { useGoogleAuth } from "@/components/google-auth-button/use-google-auth";
import { localizeHref } from "@/i18n/localize-href";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthErrorMessage } from "@/i18n/use-auth-error-message";
import { authClient } from "@/lib/auth-client";

export interface SignInFormProps {
  initialError?: AuthFormErrorKey;
}

export function SignInForm({ initialError }: SignInFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const getErrorMessage = useAuthErrorMessage();
  const { clearFieldError, errors, setFieldError, validate } =
    useSchemaForm(signInSchema);
  const google = useGoogleAuth({ errorPath: SIGN_IN_LINK.href });

  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState(initialError);
  const [attemptedEmail, setAttemptedEmail] = useState<string>();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const values = validate(form);

      if (!values) {
        return;
      }

      setFormError(undefined);
      setAttemptedEmail(values.email);
      setIsPending(true);

      const { error } = await authClient.signIn.email({
        ...values,
        callbackURL: localizeHref("/", locale),
      });

      if (!error) {
        router.replace("/");
        router.refresh();
        return;
      }

      setIsPending(false);
      const resolved = resolveAuthError(error);

      if (resolved.kind === "field") {
        setFieldError(form, resolved.field, resolved.key);
        return;
      }

      setFormError(resolved.key);
    },
    [locale, router, setFieldError, validate]
  );

  const handleGoogleSignIn = useCallback(() => {
    setFormError(undefined);
    google.startGoogleAuth();
  }, [google.startGoogleAuth]);

  const visibleError = formError ?? google.error;
  const isBusy = isPending || google.isPending;

  return (
    <div className="flex flex-col gap-8">
      <AuthFormHeader
        description={t("signIn.description")}
        title={t("signIn.title")}
      />

      {visibleError ? (
        <AuthFormError email={attemptedEmail} errorKey={visibleError} />
      ) : null}

      <form
        className="flex flex-col gap-5"
        noValidate
        onChange={clearFieldError}
        onSubmit={handleSubmit}
      >
        <TextField
          autoComplete="email"
          error={getErrorMessage(errors.email)}
          inputMode="email"
          label={t("fields.email.label")}
          name="email"
          placeholder={t("fields.email.placeholder")}
          required
          type="email"
        />

        <PasswordField
          autoComplete="current-password"
          error={getErrorMessage(errors.password)}
          hideLabel={t("fields.password.hide")}
          label={t("fields.password.label")}
          name="password"
          required
          showLabel={t("fields.password.show")}
        />

        <SubmitButton
          className="mt-1 w-full"
          disabled={google.isPending}
          isPending={isPending}
          pendingLabel={t("signIn.pending")}
          size="lg"
        >
          {t("signIn.submit")}
        </SubmitButton>
      </form>

      <Divider label={t("divider")} />

      <GoogleAuthButton
        disabled={isBusy}
        isPending={google.isPending}
        label={t("google")}
        onClick={handleGoogleSignIn}
      />

      <p className="text-muted-foreground text-center text-sm/5">
        {t("signIn.noAccount")}{" "}
        <Link className={TEXT_LINK_CLASS_NAME} href={SIGN_UP_LINK.href}>
          {t("signIn.signUpLink")}
        </Link>
      </p>
    </div>
  );
}
