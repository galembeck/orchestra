import { and, eq, isNull } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { adminRoles } from "@/db/schema/admin-roles.js";
import { adminUsers } from "@/db/schema/admin-users.js";
import { authenticate } from "@/http/middlewares/authenticate.js";
import { AppError } from "@/lib/errors.js";
import { updateAdminUserRoleSchema } from "@/schemas/admin-users/update-admin-user-role.schema.js";

export const updateAdminUserRoleRoute: FastifyPluginAsyncZod = async (app) => {
	app.patch(
		"/admin-users/:id/role",
		{
			preHandler: [authenticate],
			schema: {
				summary: "Assign a role to an admin user",
				tags: ["Admin Users"],
				security: [{ cookieAuth: [] }],
				params: z.object({ id: z.string().uuid() }),
				body: updateAdminUserRoleSchema,
				response: {
					204: z.void(),
					401: z.object({ message: z.string() }),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const [role] = await app.db
				.select({ id: adminRoles.id })
				.from(adminRoles)
				.where(eq(adminRoles.id, req.body.roleId))
				.limit(1);

			if (!role) {
				throw new AppError(404, "Cargo não encontrado.");
			}

			const [updated] = await app.db
				.update(adminUsers)
				.set({ roleId: req.body.roleId, updatedAt: new Date() })
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
