import {
  signUpConsentSchema,
  signUpSchema,
} from "@orchestra/shared/schemas/auth";
import {
  APIError,
  addOAuthServerContext,
  createAuthMiddleware,
  getOAuthState,
} from "better-auth/api";
import { z } from "zod";

export const SIGN_UP_EMAIL_PATH = "/sign-up/email";

export const SIGN_IN_SOCIAL_PATH = "/sign-in/social";

const SIGN_UP_CONSENT_CONTEXT_KEY = "signUpConsent";

const signUpConsentContextSchema = z.object({
  confirmedAt: z.iso.datetime(),
});

const signUpSocialBodySchema = z.object({
  additionalData: z.unknown().optional(),
  requestSignUp: z.boolean().optional(),
});

const toValidationError = (error: z.ZodError) => {
  const [issue] = error.issues;

  return new APIError("BAD_REQUEST", {
    code: issue?.message ?? "VALIDATION_ERROR",
    field: issue?.path.join("."),
    message: "Invalid sign-up data.",
  });
};

export const validateAuthRequest = createAuthMiddleware(async (ctx) => {
  if (ctx.path === SIGN_UP_EMAIL_PATH) {
    const result = signUpSchema.safeParse(ctx.body);

    if (!result.success) {
      throw toValidationError(result.error);
    }

    return {
      context: {
        body: {
          ...ctx.body,
          email: result.data.email,
          name: result.data.name,
        },
      },
    };
  }

  if (ctx.path !== SIGN_IN_SOCIAL_PATH) {
    return;
  }

  const { additionalData, requestSignUp } = signUpSocialBodySchema.parse(
    ctx.body ?? {}
  );

  if (!requestSignUp) {
    return;
  }

  const consent = signUpConsentSchema.safeParse(additionalData);

  if (!consent.success) {
    throw toValidationError(consent.error);
  }

  await addOAuthServerContext({
    [SIGN_UP_CONSENT_CONTEXT_KEY]: { confirmedAt: new Date().toISOString() },
  });
});

export interface SignUpConsentRecord {
  confirmedAt: Date;
}

interface ConsentLookupContext {
  body?: unknown;
  path?: string;
}

export const resolveSignUpConsent = async (
  context: ConsentLookupContext | null
): Promise<SignUpConsentRecord | null> => {
  if (context?.path === SIGN_UP_EMAIL_PATH) {
    return signUpConsentSchema.safeParse(context.body).success
      ? { confirmedAt: new Date() }
      : null;
  }

  const state = await getOAuthState().catch(() => null);
  const consent = signUpConsentContextSchema.safeParse(
    state?.serverContext?.[SIGN_UP_CONSENT_CONTEXT_KEY]
  );

  return consent.success
    ? { confirmedAt: new Date(consent.data.confirmedAt) }
    : null;
};
