import { toOAuthFormError } from "@orchestra/shared/constants/auth";
import { resolveAuthError } from "@orchestra/shared/utils/resolve-auth-error";
import { describe, expect, it } from "vitest";

describe("resolveAuthError", () => {
  it("treats rate limiting as a form error regardless of the code", () => {
    expect(resolveAuthError({ code: "termsRequired", status: 429 })).toEqual({
      key: "tooManyRequests",
      kind: "form",
    });
  });

  it("maps validation codes to the field they belong to", () => {
    expect(
      resolveAuthError({ code: "passwordNeedsDigit", status: 400 })
    ).toEqual({ field: "password", key: "passwordNeedsDigit", kind: "field" });
  });

  it("maps known Better Auth codes to form errors", () => {
    expect(
      resolveAuthError({ code: "EMAIL_NOT_VERIFIED", status: 403 })
    ).toEqual({ key: "emailNotVerified", kind: "form" });
  });

  it("falls back to a generic error for anything else", () => {
    expect(resolveAuthError({ code: "SOMETHING_NEW", status: 500 })).toEqual({
      key: "generic",
      kind: "form",
    });
  });
});

describe("toOAuthFormError", () => {
  it("ignores an empty query param", () => {
    expect(toOAuthFormError(null)).toBeUndefined();
  });

  it("asks new Google users to sign up first", () => {
    expect(toOAuthFormError("signup_disabled")).toBe("signUpRequired");
  });

  it("does not trust unexpected codes such as prototype keys", () => {
    expect(toOAuthFormError("constructor")).toBe("generic");
  });
});
