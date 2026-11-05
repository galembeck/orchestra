import { AUTH_ERROR_FIELDS } from "@orchestra/shared/constants/auth";
import { signInSchema, signUpSchema } from "@orchestra/shared/schemas/auth";
import { getFieldErrors } from "@orchestra/shared/utils/get-field-errors";
import { describe, expect, it } from "vitest";

const VALID_SIGN_UP = {
  acceptedTerms: true,
  email: "maria@example.com",
  isAdult: true,
  name: "Maria",
  password: "harmonia2026",
};

describe("signUpSchema", () => {
  it("accepts valid input and trims text fields", () => {
    const result = signUpSchema.parse({
      ...VALID_SIGN_UP,
      email: "  maria@example.com ",
      name: "  Maria  ",
    });

    expect(result.email).toBe("maria@example.com");
    expect(result.name).toBe("Maria");
  });

  it("reports one error key per invalid field", () => {
    const result = signUpSchema.safeParse({
      acceptedTerms: false,
      email: "",
      isAdult: false,
      name: "",
      password: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(getFieldErrors(result.error)).toEqual({
        acceptedTerms: "termsRequired",
        email: "emailRequired",
        isAdult: "ageRequired",
        name: "nameRequired",
        password: "passwordRequired",
      });
    }
  });

  it("uses only error keys that map to the field they describe", () => {
    const result = signUpSchema.safeParse({
      ...VALID_SIGN_UP,
      email: "nope",
      password: "abc",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      for (const [field, key] of Object.entries(getFieldErrors(result.error))) {
        expect(AUTH_ERROR_FIELDS[key as keyof typeof AUTH_ERROR_FIELDS]).toBe(
          field
        );
      }
    }
  });
});

describe("signInSchema", () => {
  it("does not apply sign-up password rules to sign-in", () => {
    expect(
      signInSchema.safeParse({ email: "maria@example.com", password: "x" })
        .success
    ).toBe(true);
  });
});
