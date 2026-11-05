"use client";

import type { AuthFormErrorKey } from "@orchestra/shared/constants/auth";
import type { SignUpConsentInput } from "@orchestra/shared/schemas/auth";
import { resolveAuthError } from "@orchestra/shared/utils/resolve-auth-error";
import { useLocale } from "next-intl";
import { useCallback, useState } from "react";
import { localizeHref } from "@/i18n/localize-href";
import { authClient } from "@/lib/auth-client";

export interface UseGoogleAuthOptions {
  errorPath: string;
}

export function useGoogleAuth({ errorPath }: UseGoogleAuthOptions) {
  const locale = useLocale();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<AuthFormErrorKey>();

  const startGoogleAuth = useCallback(
    async (consent?: SignUpConsentInput) => {
      setError(undefined);
      setIsPending(true);

      const homeHref = localizeHref("/", locale);
      const { error: authError } = await authClient.signIn.social({
        additionalData: consent,
        callbackURL: homeHref,
        errorCallbackURL: localizeHref(errorPath, locale),
        newUserCallbackURL: homeHref,
        provider: "google",
        requestSignUp: consent !== undefined,
      });

      if (!authError) {
        return;
      }

      const resolved = resolveAuthError(authError);
      setError(resolved.kind === "form" ? resolved.key : "generic");
      setIsPending(false);
    },
    [errorPath, locale]
  );

  return { error, isPending, startGoogleAuth };
}
