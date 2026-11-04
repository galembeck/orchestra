import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Server-only environment (API, database, workers).
 * Never import this from client components.
 */
export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    API_HOST: z.string().default("0.0.0.0"),
    API_PORT: z.coerce.number().int().positive().default(3333),
    DATABASE_URL: z.url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    WEB_URL: z.url().default("http://localhost:3000"),
  },
});
