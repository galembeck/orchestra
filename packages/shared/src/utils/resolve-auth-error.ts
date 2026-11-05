import {
  AUTH_ERROR_FIELDS,
  type AuthErrorKey,
  type AuthFormErrorKey,
  isAuthErrorKey,
} from "@orchestra/shared/constants/auth";

const TOO_MANY_REQUESTS_STATUS = 429;

const SERVER_CODE_FORM_ERRORS: Record<string, AuthFormErrorKey> = {
  EMAIL_NOT_VERIFIED: "emailNotVerified",
  INVALID_EMAIL_OR_PASSWORD: "invalidCredentials",
};

export interface AuthErrorLike {
  code?: string;
  status?: number;
}

export type ResolvedAuthError =
  | { field: string; key: AuthErrorKey; kind: "field" }
  | { key: AuthFormErrorKey; kind: "form" };

export const resolveAuthError = ({
  code,
  status,
}: AuthErrorLike): ResolvedAuthError => {
  if (status === TOO_MANY_REQUESTS_STATUS) {
    return { key: "tooManyRequests", kind: "form" };
  }

  if (code && isAuthErrorKey(code)) {
    return { field: AUTH_ERROR_FIELDS[code], key: code, kind: "field" };
  }

  return {
    key: (code && SERVER_CODE_FORM_ERRORS[code]) || "generic",
    kind: "form",
  };
};
