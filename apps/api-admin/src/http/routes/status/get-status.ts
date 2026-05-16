import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getStatusRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/status",
		{
			schema: {
				summary: "Health check",
				tags: ["System"],
				response: {
					200: z.object({ status: z.literal("ok") }),
				},
			},
		},
		async () => ({ status: "ok" as const }),
	);
};
