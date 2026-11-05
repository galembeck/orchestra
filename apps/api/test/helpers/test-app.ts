import {
  createPrismaClient,
  type DatabaseClient,
} from "@orchestra/database/factory";
import { inject } from "vitest";
import { buildApp } from "../../src/app.js";
import type { AppConfig } from "../../src/config.js";
import type { Mailer, MailMessage } from "../../src/modules/mail/mailer.js";

export const TEST_WEB_URL = "http://localhost:3000";

const TEST_TABLES = [
  "accounts",
  "sessions",
  "verifications",
  "rate_limits",
  "users",
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
