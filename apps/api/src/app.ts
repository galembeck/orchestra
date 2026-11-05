import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import type { DatabaseClient } from "@orchestra/database/factory";
import Fastify, { type FastifyServerOptions } from "fastify";
import type { AppConfig } from "./config.js";
import { createBackgroundTasks } from "./lib/background-tasks.js";
import { createAuth } from "./modules/auth/auth.js";
import { authRoutes } from "./modules/auth/auth-routes.js";
import { companiesRoutes } from "./modules/companies/companies-routes.js";
import { AppError } from "./modules/errors/app-error.js";
import { invitesRoutes } from "./modules/invites/invites-routes.js";
import { jobRolesRoutes } from "./modules/job-roles/job-roles-routes.js";
import type { Mailer } from "./modules/mail/mailer.js";
import { membersRoutes } from "./modules/members/members-routes.js";
import { sessionPlugin } from "./modules/session/session-plugin.js";

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

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply
        .status(error.status)
        .send({ code: error.code, message: error.message });
    }
    app.log.error({ err: error }, "unhandled error");
    return reply
      .status(500)
      .send({ code: "INTERNAL_ERROR", message: "Internal server error" });
  });

  await app.register(helmet);
  await app.register(cors, {
    credentials: true,
    origin: config.webUrl,
  });
  await app.register(authRoutes, { auth, publicOrigin: config.webUrl });
  await app.register(sessionPlugin, { auth, database });
  await app.register(companiesRoutes, { database });
  await app.register(jobRolesRoutes, { database });
  await app.register(membersRoutes, { database });
  await app.register(invitesRoutes, { config, database, mailer });

  app.get("/health", () => ({ status: "ok" }));

  app.addHook("onClose", async () => {
    await backgroundTasks.drain();
  });

  return { app, auth, backgroundTasks };
}
