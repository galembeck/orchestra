import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate.js";

export const getMeRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/user/me",
		{
			preHandler: [authenticate],
			schema: {
				summary: "Return the currently authenticated admin user",
				tags: ["Users"],
				response: {
					200: z.object({
						id: z.string().uuid(),
						name: z.string(),
						email: z.string(),
					}),
					401: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const { sub, name, email } = req.user;
			return reply.status(200).send({ id: sub, name, email });
		},
	);
};
