import { TERMS_VERSION } from "@orchestra/shared/constants/auth";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createTestApp,
  postAuth,
  resetDatabase,
  TEST_WEB_URL,
  type TestApp,
} from "./helpers/test-app.js";

const VALID_SIGN_UP = {
  acceptedTerms: true,
  email: "Maria.Silva@Example.com",
  isAdult: true,
  name: "  Maria Silva  ",
  password: "harmonia2026",
};

const NORMALIZED_EMAIL = "maria.silva@example.com";
const VERIFICATION_LINK_PATTERN =
  /https?:\/\/\S+\/api\/auth\/verify-email\?\S+/u;
const SESSION_COOKIE_PATTERN = /^orchestra\.session_token=/u;
const SIGN_IN_ATTEMPT_LIMIT = 5;

const readCookies = (header: string | string[] | undefined) => {
  if (!header) {
    return [];
  }
  return Array.isArray(header) ? header : [header];
};

const toCookieHeader = (cookies: string[]) =>
  cookies.map((cookie) => cookie.split(";")[0]).join("; ");

const signUp = (testApp: TestApp, overrides: Record<string, unknown> = {}) =>
  postAuth(testApp, "/sign-up/email", { ...VALID_SIGN_UP, ...overrides });

const signIn = (
  testApp: TestApp,
  password = VALID_SIGN_UP.password,
  headers: Record<string, string> = {}
) =>
  postAuth(
    testApp,
    "/sign-in/email",
    { email: NORMALIZED_EMAIL, password },
    headers
  );

const verifyLatestEmail = async (testApp: TestApp) => {
  await testApp.backgroundTasks.drain();
  const message = testApp.mailer.sent.at(-1);
  const link = message?.text.match(VERIFICATION_LINK_PATTERN)?.[0];

  if (!link) {
    throw new Error("No verification link was sent.");
  }

  const { pathname, search } = new URL(link);
  return testApp.app.inject({ method: "GET", url: `${pathname}${search}` });
};

describe("email sign-up", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("creates an unverified user with recorded consent and sends a verification email", async () => {
    const response = await signUp(testApp);

    expect(response.statusCode).toBe(200);
    expect(readCookies(response.headers["set-cookie"])).toHaveLength(0);

    const user = await testApp.database.user.findUniqueOrThrow({
      where: { email: NORMALIZED_EMAIL },
    });

    expect(user.name).toBe("Maria Silva");
    expect(user.emailVerified).toBe(false);
    expect(user.termsVersion).toBe(TERMS_VERSION);
    expect(user.termsAcceptedAt).toBeInstanceOf(Date);
    expect(user.adultConfirmedAt).toBeInstanceOf(Date);

    await testApp.backgroundTasks.drain();

    expect(testApp.mailer.sent).toHaveLength(1);
    expect(testApp.mailer.sent[0]?.to).toBe(NORMALIZED_EMAIL);
    expect(testApp.mailer.sent[0]?.subject).toBe(
      "Confirme seu e-mail na Orchestra"
    );
    expect(testApp.mailer.sent[0]?.text).toMatch(VERIFICATION_LINK_PATTERN);
  });

  it("writes the verification email in the visitor's language", async () => {
    await postAuth(testApp, "/sign-up/email", VALID_SIGN_UP, {
      cookie: "ORCHESTRA_LOCALE=en",
    });
    await testApp.backgroundTasks.drain();

    expect(testApp.mailer.sent[0]?.subject).toBe(
      "Confirm your email on Orchestra"
    );
  });

  it.each([
    [{ acceptedTerms: false }, "termsRequired"],
    [{ isAdult: undefined }, "ageRequired"],
    [{ name: "   " }, "nameRequired"],
    [{ email: "not-an-email" }, "emailInvalid"],
    [{ password: "short1" }, "passwordTooShort"],
    [{ password: "onlyletters" }, "passwordNeedsDigit"],
    [{ password: "1234567890" }, "passwordNeedsLetter"],
  ])("rejects %o with %s", async (overrides, code) => {
    const response = await signUp(testApp, overrides);

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ code });
    expect(await testApp.database.user.count()).toBe(0);
  });

  it("answers a duplicate sign-up like a new one and warns the account owner", async () => {
    await signUp(testApp);
    await testApp.backgroundTasks.drain();

    const duplicate = await signUp(testApp, { name: "Someone Else" });
    await testApp.backgroundTasks.drain();

    expect(duplicate.statusCode).toBe(200);
    expect(await testApp.database.user.count()).toBe(1);
    expect(testApp.mailer.sent).toHaveLength(2);
    expect(testApp.mailer.sent[1]?.subject).toBe(
      "Você já tem uma conta na Orchestra"
    );
    expect(testApp.mailer.sent[1]?.html).toContain(`${TEST_WEB_URL}/sign-in`);
  });
});

describe("email sign-in", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
    await signUp(testApp);
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("blocks sign-in until the email is verified", async () => {
    const response = await signIn(testApp);

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({ code: "EMAIL_NOT_VERIFIED" });
  });

  it("verifies the email, signs the user in and keeps the session", async () => {
    const verification = await verifyLatestEmail(testApp);

    expect(verification.statusCode).toBe(302);

    const verificationCookies = readCookies(verification.headers["set-cookie"]);
    expect(
      verificationCookies.some((cookie) => SESSION_COOKIE_PATTERN.test(cookie))
    ).toBe(true);

    const user = await testApp.database.user.findUniqueOrThrow({
      where: { email: NORMALIZED_EMAIL },
    });
    expect(user.emailVerified).toBe(true);

    const signInResponse = await signIn(testApp);
    expect(signInResponse.statusCode).toBe(200);

    const sessionCookies = readCookies(signInResponse.headers["set-cookie"]);
    const sessionCookie = sessionCookies.find((cookie) =>
      SESSION_COOKIE_PATTERN.test(cookie)
    );
    expect(sessionCookie).toContain("HttpOnly");
    expect(sessionCookie).toContain("SameSite=Lax");

    const session = await testApp.app.inject({
      headers: { cookie: toCookieHeader(sessionCookies) },
      method: "GET",
      url: "/api/auth/get-session",
    });

    expect(session.statusCode).toBe(200);
    expect(session.json()).toMatchObject({
      user: { email: NORMALIZED_EMAIL, name: "Maria Silva" },
    });
  });

  it("rejects a wrong password without revealing which field was wrong", async () => {
    await verifyLatestEmail(testApp);

    const response = await signIn(testApp, "wrong-password-1");

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      code: "INVALID_EMAIL_OR_PASSWORD",
    });
  });
});

describe("Google sign-up consent", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("refuses to start a Google sign-up without consent", async () => {
    const response = await postAuth(testApp, "/sign-in/social", {
      additionalData: { acceptedTerms: true },
      provider: "google",
      requestSignUp: true,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ code: "ageRequired" });
  });

  it("starts a Google sign-up once consent is given", async () => {
    const response = await postAuth(testApp, "/sign-in/social", {
      additionalData: { acceptedTerms: true, isAdult: true },
      provider: "google",
      requestSignUp: true,
    });

    expect(response.statusCode).toBe(200);

    const { url } = response.json<{ url: string }>();
    expect(new URL(url).hostname).toBe("accounts.google.com");
  });

  it("lets existing users start a Google sign-in without consent fields", async () => {
    const response = await postAuth(testApp, "/sign-in/social", {
      provider: "google",
    });

    expect(response.statusCode).toBe(200);
  });
});

describe("rate limiting", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp({ rateLimitEnabled: true });
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("throttles repeated sign-in attempts even when the client spoofs its IP", async () => {
    const attempts = Array.from(
      { length: SIGN_IN_ATTEMPT_LIMIT + 1 },
      (_, attempt) => attempt
    );

    const statuses = await attempts.reduce<Promise<number[]>>(
      async (previous, attempt) => {
        const collected = await previous;
        const response = await signIn(testApp, "wrong-password-1", {
          "x-forwarded-for": `203.0.113.${attempt}`,
        });
        return [...collected, response.statusCode];
      },
      Promise.resolve([])
    );

    expect(statuses.slice(0, SIGN_IN_ATTEMPT_LIMIT)).not.toContain(429);
    expect(statuses.at(-1)).toBe(429);
  });
});
