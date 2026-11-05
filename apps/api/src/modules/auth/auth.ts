import type { DatabaseClient } from "@orchestra/database/factory";
import {
  AUTH_BASE_PATH,
  AUTH_COOKIE_PREFIX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  TERMS_VERSION,
} from "@orchestra/shared/constants/auth";
import { SIGN_IN_LINK } from "@orchestra/shared/constants/navigation";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";
import type { FastifyBaseLogger } from "fastify";
import type { AppConfig } from "../../config.js";
import type { BackgroundTasks } from "../../lib/background-tasks.js";
import type { Mailer } from "../mail/mailer.js";
import { localizePath, resolveLocale } from "../mail/resolve-locale.js";
import {
  renderExistingAccountEmail,
  renderVerificationEmail,
} from "../mail/templates/auth-emails.js";
import {
  resolveSignUpConsent,
  SIGN_IN_SOCIAL_PATH,
  SIGN_UP_EMAIL_PATH,
  validateAuthRequest,
} from "./auth-validation.js";

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

const SESSION_MAX_AGE_SECONDS = 30 * SECONDS_PER_DAY;
const SESSION_REFRESH_AGE_SECONDS = SECONDS_PER_DAY;
const SESSION_COOKIE_CACHE_SECONDS = 5 * SECONDS_PER_MINUTE;
const EMAIL_VERIFICATION_TTL_SECONDS = SECONDS_PER_HOUR;

const DEFAULT_RATE_LIMIT = { max: 100, window: SECONDS_PER_MINUTE };

const AUTH_RATE_LIMITS = {
  "/send-verification-email": { max: 3, window: 10 * SECONDS_PER_MINUTE },
  [SIGN_IN_SOCIAL_PATH]: { max: 10, window: SECONDS_PER_MINUTE },
  "/sign-in/email": { max: 5, window: SECONDS_PER_MINUTE },
  [SIGN_UP_EMAIL_PATH]: { max: 5, window: 10 * SECONDS_PER_MINUTE },
} as const;

export interface CreateAuthOptions {
  backgroundTasks: BackgroundTasks;
  config: AppConfig;
  database: DatabaseClient;
  logger: FastifyBaseLogger;
  mailer: Mailer;
}

export const createAuth = ({
  backgroundTasks,
  config,
  database,
  logger,
  mailer,
}: CreateAuthOptions) =>
  betterAuth({
    account: {
      accountLinking: {
        enabled: true,
        requireLocalEmailVerified: true,
        trustedProviders: ["google"],
      },
    },
    advanced: {
      backgroundTasks: { handler: backgroundTasks.track },
      cookiePrefix: AUTH_COOKIE_PREFIX,
      useSecureCookies: config.isProduction,
    },
    appName: "Orchestra",
    basePath: AUTH_BASE_PATH,
    baseURL: config.webUrl,
    database: prismaAdapter(database, { provider: "postgresql" }),
    databaseHooks: {
      user: {
        create: {
          before: async (user, context) => {
            const consent = await resolveSignUpConsent(context);

            if (!consent) {
              logger.warn(
                { path: context?.path },
                "rejected user creation without sign-up consent"
              );
              return false;
            }

            return {
              data: {
                ...user,
                adultConfirmedAt: consent.confirmedAt,
                termsAcceptedAt: consent.confirmedAt,
                termsVersion: TERMS_VERSION,
              },
            };
          },
        },
      },
    },
    emailAndPassword: {
      autoSignIn: false,
      enabled: true,
      maxPasswordLength: PASSWORD_MAX_LENGTH,
      minPasswordLength: PASSWORD_MIN_LENGTH,
      onExistingUserSignUp: async ({ user }, request) => {
        const locale = resolveLocale(request);
        const url = new URL(
          localizePath(locale, SIGN_IN_LINK.href),
          config.webUrl
        ).toString();

        await mailer.send({
          to: user.email,
          ...renderExistingAccountEmail({ locale, name: user.name, url }),
        });
      },
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      expiresIn: EMAIL_VERIFICATION_TTL_SECONDS,
      sendOnSignUp: true,
      sendVerificationEmail: async ({ url, user }, request) => {
        await mailer.send({
          to: user.email,
          ...renderVerificationEmail({
            locale: resolveLocale(request),
            name: user.name,
            url,
          }),
        });
      },
    },
    hooks: {
      before: validateAuthRequest,
    },
    logger: {
      level: config.isProduction ? "warn" : "info",
      log: (level, message, ...args) => {
        logger[level]({ args, scope: "auth" }, message);
      },
    },
    plugins: [
      customSession(async ({ session, user }) => {
        const member = await database.member.findUnique({
          include: { company: true },
          where: { userId: user.id },
        });

        return {
          session,
          user: {
            ...user,
            company: member
              ? { role: member.role, slug: member.company.slug }
              : null,
          },
        };
      }),
    ],
    rateLimit: {
      ...DEFAULT_RATE_LIMIT,
      customRules: AUTH_RATE_LIMITS,
      enabled: config.rateLimitEnabled,
      storage: "database",
    },
    secret: config.authSecret,
    session: {
      cookieCache: { enabled: true, maxAge: SESSION_COOKIE_CACHE_SECONDS },
      expiresIn: SESSION_MAX_AGE_SECONDS,
      updateAge: SESSION_REFRESH_AGE_SECONDS,
    },
    socialProviders: config.googleOAuth
      ? {
          google: {
            clientId: config.googleOAuth.clientId,
            clientSecret: config.googleOAuth.clientSecret,
            disableImplicitSignUp: true,
            prompt: "select_account",
          },
        }
      : {},
    telemetry: { enabled: false },
    trustedOrigins: [config.webUrl],
    user: {
      additionalFields: {
        adultConfirmedAt: { input: false, required: false, type: "date" },
        termsAcceptedAt: { input: false, required: false, type: "date" },
        termsVersion: { input: false, required: false, type: "string" },
      },
    },
  });

export type Auth = ReturnType<typeof createAuth>;
