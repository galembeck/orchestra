import { prisma } from "@orchestra/database";
import { env } from "@orchestra/env/server";
import { buildApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createSmtpMailer } from "./modules/mail/mailer.js";

const mailer = createSmtpMailer({ from: env.MAIL_FROM, url: env.SMTP_URL });

const { app } = await buildApp({
  config: loadConfig(),
  database: prisma,
  mailer,
});

const releaseResources = async () => {
  await mailer.close();
  await prisma.$disconnect();
};

const shutdown = async (signal: NodeJS.Signals) => {
  app.log.info({ signal }, "shutting down");
  await app.close();
  await releaseResources();
  process.exit(0);
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

try {
  await app.listen({ host: env.API_HOST, port: env.API_PORT });
} catch (error) {
  app.log.error(error);
  await releaseResources();
  process.exit(1);
}
