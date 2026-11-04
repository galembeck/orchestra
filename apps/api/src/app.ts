import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { env } from "@orchestra/env/server";
import Fastify from "fastify";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
    },
  });

  await app.register(helmet);
  await app.register(cors, {
    credentials: true,
    origin: env.WEB_URL,
  });

  app.get("/health", () => ({ status: "ok" }));

  return app;
}
