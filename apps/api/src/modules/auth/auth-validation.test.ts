import { describe, expect, it } from "vitest";
import { resolveSignUpConsent, SIGN_UP_EMAIL_PATH } from "./auth-validation.js";

describe("resolveSignUpConsent", () => {
  it("accepts an email sign-up that carries both confirmations", async () => {
    const consent = await resolveSignUpConsent({
      body: { acceptedTerms: true, isAdult: true },
      path: SIGN_UP_EMAIL_PATH,
    });

    expect(consent?.confirmedAt).toBeInstanceOf(Date);
  });

  it("rejects an email sign-up missing a confirmation", async () => {
    await expect(
      resolveSignUpConsent({
        body: { acceptedTerms: true },
        path: SIGN_UP_EMAIL_PATH,
      })
    ).resolves.toBeNull();
  });

  it("rejects an OAuth callback without server-side consent", async () => {
    await expect(
      resolveSignUpConsent({ path: "/callback/google" })
    ).resolves.toBeNull();
  });

  it("rejects user creation outside any request", async () => {
    await expect(resolveSignUpConsent(null)).resolves.toBeNull();
  });
});
