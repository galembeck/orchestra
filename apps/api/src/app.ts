import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import type { DatabaseClient } from "@orchestra/database/factory";
import Fastify, { type FastifyServerOptions } from "fastify";
import type { AppConfig } from "./config.js";
import { createBackgroundTasks } from "./lib/background-tasks.js";
import { createAuth } from "./modules/auth/auth.js";
import { authRoutes } from "./modules/auth/auth-routes.js";
import type { Mailer } from "./modules/mail/mailer.js";

export interface BuildAppOptions {
  config: AppConfig;
  database: DatabaseClient;
  logger?: FastifyServerOptions["logger"];
  mailer: Mailer;
}

export async function buildApp({
  config,
  database,
  logger = { level: config.isProduction ? "info" : "debug" },
  mailer,
}: BuildAppOptions) {
  const app = Fastify({
    logger,
    trustProxy: (_address, hop) => hop < config.trustedProxyHops,
  });

  const backgroundTasks = createBackgroundTasks((error) => {
    app.log.error({ err: error }, "background task failed");
  });

  const auth = createAuth({
    backgroundTasks,
    config,
    database,
    logger: app.log,
    mailer,
  });

  await app.register(helmet);
  await app.register(cors, {
    credentials: true,
    origin: config.webUrl,
  });
  await app.register(authRoutes, { auth, publicOrigin: config.webUrl });

  app.get("/health", () => ({ status: "ok" }));

  app.addHook("onClose", async () => {
    await backgroundTasks.drain();
  });

  return { app, auth, backgroundTasks };
}
