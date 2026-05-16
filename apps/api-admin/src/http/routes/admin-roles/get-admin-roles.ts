import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { adminRoles } from "@/db/schema/admin-roles.js";
import { authenticate } from "@/http/middlewares/authenticate.js";

export const getAdminRolesRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/admin-roles",
		{
			preHandler: [authenticate],
			schema: {
				summary: "List all admin roles",
				tags: ["Admin Roles"],
				security: [{ cookieAuth: [] }],
				response: {
					200: z.array(
						z.object({
							id: z.string().uuid(),
							key: z.string(),
							name: z.string(),
							description: z.string().nullable(),
							permissions: z.record(z.unknown()),
						}),
					),
					401: z.object({ message: z.string() }),
				},
			},
		},
		async (_req, reply) => {
			const roles = await app.db
				.select({
					id: adminRoles.id,
					key: adminRoles.key,
					name: adminRoles.name,
					description: adminRoles.description,
					permissions: adminRoles.permissions,
				})
				.from(adminRoles)
				.orderBy(adminRoles.name);

			return reply.status(200).send(
				roles.map((r) => ({
					...r,
					permissions: r.permissions as Record<string, unknown>,
				})),
			);
		},
	);
};
