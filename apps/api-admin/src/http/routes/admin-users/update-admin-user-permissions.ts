import { and, eq, isNull } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { adminUsers } from "@/db/schema/admin-users.js";
import { authenticate } from "@/http/middlewares/authenticate.js";
import { AppError } from "@/lib/errors.js";
import { updateAdminUserPermissionsSchema } from "@/schemas/admin-users/update-admin-user-permissions.schema.js";

export const updateAdminUserPermissionsRoute: FastifyPluginAsyncZod = async (
	app,
) => {
	app.patch(
		"/admin-users/:id/permissions",
		{
			preHandler: [authenticate],
			schema: {
				summary: "Update per-user permission overrides",
				tags: ["Admin Users"],
				security: [{ cookieAuth: [] }],
				params: z.object({ id: z.string().uuid() }),
				body: updateAdminUserPermissionsSchema,
				response: {
					204: z.void(),
					401: z.object({ message: z.string() }),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const [updated] = await app.db
				.update(adminUsers)
				.set({
					permissionOverrides: req.body.permissionOverrides,
					updatedAt: new Date(),
				})
				.where(
					and(eq(adminUsers.id, req.params.id), isNull(adminUsers.deletedAt)),
				)
				.returning({ id: adminUsers.id });

			if (!updated) {
				throw new AppError(404, "Administrador não encontrado.");
			}

			return reply.status(204).send();
		},
	);
};
