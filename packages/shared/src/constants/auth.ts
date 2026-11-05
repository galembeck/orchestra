export const NAME_MAX_LENGTH = 120;

export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_MAX_LENGTH = 72;

export const MINIMUM_AGE = 18;

export const TERMS_VERSION = "2026-11-04";

export const AUTH_BASE_PATH = "/api/auth";

export const AUTH_COOKIE_PREFIX = "orchestra";

export const AUTH_ERROR_FIELDS = {
  ageRequired: "isAdult",
  emailInvalid: "email",
  emailRequired: "email",
  nameRequired: "name",
  nameTooLong: "name",
  passwordNeedsDigit: "password",
  passwordNeedsLetter: "password",
  passwordRequired: "password",
  passwordTooLong: "password",
  passwordTooShort: "password",
  termsRequired: "acceptedTerms",
} as const;

export type AuthErrorKey = keyof typeof AUTH_ERROR_FIELDS;

export const AUTH_ERROR_KEYS = Object.keys(
  AUTH_ERROR_FIELDS
) as readonly AuthErrorKey[];

export const isAuthErrorKey = (value: string): value is AuthErrorKey =>
  Object.hasOwn(AUTH_ERROR_FIELDS, value);

export const AUTH_FORM_ERROR_KEYS = [
  "accountNotLinked",
  "emailNotVerified",
  "generic",
  "invalidCredentials",
  "signUpRequired",
  "tooManyRequests",
] as const;

export type AuthFormErrorKey = (typeof AUTH_FORM_ERROR_KEYS)[number];

export const OAUTH_ERROR_FORM_ERRORS = {
  account_not_linked: "accountNotLinked",
  signup_disabled: "signUpRequired",
} as const satisfies Record<string, AuthFormErrorKey>;

export const toOAuthFormError = (
  code: string | null | undefined
): AuthFormErrorKey | undefined => {
  if (!code) {
    return;
  }

  return Object.hasOwn(OAUTH_ERROR_FORM_ERRORS, code)
    ? OAUTH_ERROR_FORM_ERRORS[code as keyof typeof OAUTH_ERROR_FORM_ERRORS]
    : "generic";
};

export const AUTH_ERROR_QUERY_PARAM = "error";
