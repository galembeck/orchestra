import { sql } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getStatusRoute: FastifyPluginCallbackZod = (app) => {
	app.get(
		"/status",
		{
			schema: {
				summary: "API health check",
				tags: ["System"],
				response: {
					200: z.object({
						status: z.literal("ok"),
						timestamp: z.string(),
						database: z.enum(["connected", "unavailable"]),
						version: z.string(),
					}),
				},
			},
		},
		async (_req, _reply) => {
			let database: "connected" | "unavailable" = "unavailable";

			try {
				await app.db.execute(sql`SELECT 1`);
				database = "connected";
			} catch {
				// always respond, even if DB is down
			}

			return {
				status: "ok" as const,
				timestamp: new Date().toISOString(),
				database,
				version: "1.0.0",
			};
		}
	);
};
