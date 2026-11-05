import { randomUUID } from "node:crypto";
import type { CompanyRole } from "@orchestra/database/client";
import {
  createPrismaClient,
  type DatabaseClient,
} from "@orchestra/database/factory";
import { inject } from "vitest";
import { buildApp } from "../../src/app.js";
import type { AppConfig } from "../../src/config.js";
import type { Mailer, MailMessage } from "../../src/modules/mail/mailer.js";

const VERIFICATION_LINK_PATTERN =
  /https?:\/\/\S+\/api\/auth\/verify-email\?\S+/u;
const FIXTURE_PASSWORD = "harmonia2026";

export const TEST_WEB_URL = "http://localhost:3000";

const TEST_TABLES = [
  "accounts",
  "sessions",
  "verifications",
  "rate_limits",
  "users",
  "companies",
  "members",
  "invites",
  "job_roles",
  "company_job_roles",
  "member_job_roles",
] as const;

export interface RecordingMailer extends Mailer {
  sent: MailMessage[];
}

export const createRecordingMailer = (): RecordingMailer => {
  const sent: MailMessage[] = [];

  return {
    close: () => Promise.resolve(),
    send: (message) => {
      sent.push(message);
      return Promise.resolve();
    },
    sent,
  };
};

export const createTestConfig = (
  overrides: Partial<AppConfig> = {}
): AppConfig => ({
  authSecret: "test-secret-with-at-least-thirty-two-characters",
  googleOAuth: {
    clientId: "test-google-client-id",
    clientSecret: "test-google-client-secret",
  },
  isProduction: false,
  rateLimitEnabled: false,
  trustedProxyHops: 0,
  webUrl: TEST_WEB_URL,
  ...overrides,
});

let sharedDatabase: DatabaseClient | undefined;

export const getTestDatabase = () => {
  sharedDatabase ??= createPrismaClient({
    connectionString: inject("databaseUrl"),
  });
  return sharedDatabase;
};

export const resetDatabase = async () => {
  const tables = TEST_TABLES.map((table) => `"${table}"`).join(", ");
  await getTestDatabase().$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE`);
};

export const createTestApp = async (overrides: Partial<AppConfig> = {}) => {
  const mailer = createRecordingMailer();
  const database = getTestDatabase();
  const built = await buildApp({
    config: createTestConfig(overrides),
    database,
    logger: false,
    mailer,
  });

  return { ...built, database, mailer };
};

export type TestApp = Awaited<ReturnType<typeof createTestApp>>;

export const postAuth = (
  { app }: TestApp,
  path: string,
  payload: unknown,
  headers: Record<string, string> = {}
) =>
  app.inject({
    headers: {
      "content-type": "application/json",
      origin: TEST_WEB_URL,
      ...headers,
    },
    method: "POST",
    payload: JSON.stringify(payload),
    url: `/api/auth${path}`,
  });

const readCookieHeader = (header: string | string[] | undefined) => {
  if (!header) {
    return "";
  }
  const cookies = Array.isArray(header) ? header : [header];
  return cookies.map((cookie) => cookie.split(";")[0]).join("; ");
};

export interface CreateMemberFixtureOptions {
  companyName?: string;
  companySlug?: string;
  role: CompanyRole;
}

export interface MemberFixture {
  companyId: string;
  companySlug: string;
  cookie: string;
  userId: string;
}

export interface VerifiedUserFixture {
  cookie: string;
  email: string;
  userId: string;
}

export const createVerifiedUserFixture = async (
  testApp: TestApp,
  options: { email?: string } = {}
): Promise<VerifiedUserFixture> => {
  const email = options.email ?? `member-${randomUUID()}@example.com`;

  await postAuth(testApp, "/sign-up/email", {
    acceptedTerms: true,
    email,
    isAdult: true,
    name: "Test Member",
    password: FIXTURE_PASSWORD,
  });
  await testApp.backgroundTasks.drain();

  const message = testApp.mailer.sent.find((sent) => sent.to === email);
  if (!message) {
    throw new Error(`No verification email was sent to ${email}.`);
  }
  const link = message.text.match(VERIFICATION_LINK_PATTERN)?.[0];
  if (!link) {
    throw new Error(`No verification link found for ${email}.`);
  }

  const { pathname, search } = new URL(link);
  const verification = await testApp.app.inject({
    method: "GET",
    url: `${pathname}${search}`,
  });
  const cookie = readCookieHeader(verification.headers["set-cookie"]);

  const user = await testApp.database.user.findUniqueOrThrow({
    where: { email },
  });

  return { cookie, email, userId: user.id };
};

export const createMemberFixture = async (
  testApp: TestApp,
  options: CreateMemberFixtureOptions
): Promise<MemberFixture> => {
  const { cookie, userId } = await createVerifiedUserFixture(testApp);

  const companySlug = options.companySlug ?? `company-${randomUUID()}`;
  const company = await testApp.database.company.upsert({
    create: {
      name: options.companyName ?? "Test Company",
      ownerId: userId,
      slug: companySlug,
    },
    update: {},
    where: { slug: companySlug },
  });

  await testApp.database.member.create({
    data: { companyId: company.id, role: options.role, userId },
  });

  return {
    companyId: company.id,
    companySlug: company.slug,
    cookie,
    userId,
  };
};
