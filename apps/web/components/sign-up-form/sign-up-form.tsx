"use client";

import {
  type AuthFormErrorKey,
  MINIMUM_AGE,
  PASSWORD_MIN_LENGTH,
} from "@orchestra/shared/constants/auth";
import {
  BUSINESS_SIGN_UP_LINK,
  SIGN_IN_LINK,
  SIGN_UP_LINK,
} from "@orchestra/shared/constants/navigation";
import { useSchemaForm } from "@orchestra/shared/hooks/use-schema-form";
import { signUpSchema } from "@orchestra/shared/schemas/auth";
import { resolveAuthError } from "@orchestra/shared/utils/resolve-auth-error";
import { Divider } from "@orchestra/ui/components/divider/divider";
import { PasswordField } from "@orchestra/ui/components/password-field/password-field";
import { SubmitButton } from "@orchestra/ui/components/submit-button/submit-button";
import { TextField } from "@orchestra/ui/components/text-field/text-field";
import { TEXT_LINK_CLASS_NAME } from "@orchestra/ui/lib/text-link-styles";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useCallback, useRef, useState } from "react";
import { AuthFormError } from "@/components/auth-form-error/auth-form-error";
import { AuthFormHeader } from "@/components/auth-form-header/auth-form-header";
import { CheckEmailNotice } from "@/components/check-email-notice/check-email-notice";
import { GoogleAuthButton } from "@/components/google-auth-button/google-auth-button";
import { useGoogleAuth } from "@/components/google-auth-button/use-google-auth";
import { ConsentFields } from "@/components/sign-up-form/consent-fields";
import { localizeHref } from "@/i18n/localize-href";
import { Link } from "@/i18n/navigation";
import { useAuthErrorMessage } from "@/i18n/use-auth-error-message";
import { authClient } from "@/lib/auth-client";

const CONSENT_FIELDS = ["acceptedTerms", "isAdult"] as const;

export interface SignUpFormProps {
  initialError?: AuthFormErrorKey;
}

export function SignUpForm({ initialError }: SignUpFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const getErrorMessage = useAuthErrorMessage();
  const formRef = useRef<HTMLFormElement>(null);
  const { clearFieldError, errors, setFieldError, validate, validateFields } =
    useSchemaForm(signUpSchema);
  const google = useGoogleAuth({ errorPath: SIGN_UP_LINK.href });

  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState(initialError);
  const [registeredEmail, setRegisteredEmail] = useState<string>();

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const values = validate(form);

      if (!values) {
        return;
      }

      setFormError(undefined);
      setIsPending(true);

      const { error } = await authClient.signUp.email({
        ...values,
        callbackURL: localizeHref("/", locale),
      });

      setIsPending(false);

      if (!error) {
        setRegisteredEmail(values.email);
        return;
      }

      const resolved = resolveAuthError(error);

      if (resolved.kind === "field") {
        setFieldError(form, resolved.field, resolved.key);
        return;
      }

      setFormError(resolved.key);
    },
    [locale, setFieldError, validate]
  );

  const handleGoogleSignUp = useCallback(() => {
    const form = formRef.current;

    if (!(form && validateFields(form, CONSENT_FIELDS))) {
      return;
    }

    setFormError(undefined);
    google.startGoogleAuth({ acceptedTerms: true, isAdult: true });
  }, [google.startGoogleAuth, validateFields]);

  const handleUseAnotherEmail = useCallback(() => {
    setRegisteredEmail(undefined);
  }, []);

  if (registeredEmail) {
    return (
      <CheckEmailNotice
        email={registeredEmail}
        onUseAnotherEmail={handleUseAnotherEmail}
      />
    );
  }

  const visibleError = formError ?? google.error;
  const isBusy = isPending || google.isPending;

  return (
    <div className="flex flex-col gap-8">
      <AuthFormHeader
        description={t("signUp.description")}
        title={t("signUp.title")}
      />

      {visibleError ? <AuthFormError errorKey={visibleError} /> : null}

      <form
        className="flex flex-col gap-5"
        noValidate
        onChange={clearFieldError}
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <TextField
          autoComplete="name"
          error={getErrorMessage(errors.name)}
          label={t("fields.name.label")}
          name="name"
          placeholder={t("fields.name.placeholder")}
          required
        />

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
          autoComplete="new-password"
          error={getErrorMessage(errors.password)}
          hideLabel={t("fields.password.hide")}
          hint={t("fields.password.hint", { min: PASSWORD_MIN_LENGTH })}
          label={t("fields.password.label")}
          minLength={PASSWORD_MIN_LENGTH}
          name="password"
          required
          showLabel={t("fields.password.show")}
        />

        <ConsentFields
          ageError={getErrorMessage(errors.isAdult)}
          ageLabel={t("signUp.age", { age: MINIMUM_AGE })}
          termsError={getErrorMessage(errors.acceptedTerms)}
        />

        <SubmitButton
          className="mt-1 w-full"
          disabled={google.isPending}
          isPending={isPending}
          pendingLabel={t("signUp.pending")}
          size="lg"
        >
          {t("signUp.submit")}
        </SubmitButton>
      </form>

      <Divider label={t("divider")} />

      <GoogleAuthButton
        disabled={isBusy}
        isPending={google.isPending}
        label={t("google")}
        onClick={handleGoogleSignUp}
      />

      <div className="text-muted-foreground flex flex-col items-center gap-2 text-center text-sm/5">
        <p>
          {t("signUp.hasAccount")}{" "}
          <Link className={TEXT_LINK_CLASS_NAME} href={SIGN_IN_LINK.href}>
            {t("signUp.signInLink")}
          </Link>
        </p>

        <p>
          {t.rich("signUp.businessPrompt", {
            link: (chunks) => (
              <Link
                className={TEXT_LINK_CLASS_NAME}
                href={BUSINESS_SIGN_UP_LINK.href}
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
