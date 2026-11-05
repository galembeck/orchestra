import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const AUTH_SECRET_MIN_LENGTH = 32;

export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    API_HOST: z.string().default("0.0.0.0"),
    API_PORT: z.coerce.number().int().positive().default(3333),
    BETTER_AUTH_SECRET: z.string().min(AUTH_SECRET_MIN_LENGTH),
    DATABASE_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    MAIL_FROM: z
      .string()
      .min(1)
      .default("Orchestra <no-reply@orchestra.local>"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    SMTP_URL: z.url().default("smtp://localhost:1025"),
    TRUSTED_PROXY_HOPS: z.coerce.number().int().min(0).default(0),
    WEB_URL: z.url().default("http://localhost:3000"),
  },
});
