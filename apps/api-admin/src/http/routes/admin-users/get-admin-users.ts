import { eq, isNull } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { adminRoles } from "@/db/schema/admin-roles.js";
import { adminUsers } from "@/db/schema/admin-users.js";
import { authenticate } from "@/http/middlewares/authenticate.js";

export const getAdminUsersRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/admin-users",
		{
			preHandler: [authenticate],
			schema: {
				summary: "List all admin users",
				tags: ["Admin Users"],
				security: [{ cookieAuth: [] }],
				response: {
					200: z.array(
						z.object({
							id: z.string().uuid(),
							name: z.string(),
							email: z.string(),
							registration: z.string(),
							avatarUrl: z.string().nullable(),
							isActive: z.boolean(),
							createdAt: z.string(),
							role: z
								.object({
									id: z.string().uuid(),
									key: z.string(),
									name: z.string(),
								})
								.nullable(),
							permissionOverrides: z.record(z.unknown()).nullable(),
						}),
					),
					401: z.object({ message: z.string() }),
				},
			},
		},
		async (_req, reply) => {
			const rows = await app.db
				.select({
					id: adminUsers.id,
					name: adminUsers.name,
					email: adminUsers.email,
					registration: adminUsers.registration,
					avatarUrl: adminUsers.avatarUrl,
					isActive: adminUsers.isActive,
					createdAt: adminUsers.createdAt,
					roleId: adminUsers.roleId,
					permissionOverrides: adminUsers.permissionOverrides,
					roleKey: adminRoles.key,
					roleName: adminRoles.name,
				})
				.from(adminUsers)
				.leftJoin(adminRoles, eq(adminUsers.roleId, adminRoles.id))
				.where(isNull(adminUsers.deletedAt))
				.orderBy(adminUsers.name);

			return reply.status(200).send(
				rows.map((row) => ({
					id: row.id,
					name: row.name,
					email: row.email,
					registration: row.registration,
					avatarUrl: row.avatarUrl,
					isActive: row.isActive,
					createdAt: row.createdAt.toISOString(),
					role:
						row.roleId && row.roleKey && row.roleName
							? { id: row.roleId, key: row.roleKey, name: row.roleName }
							: null,
					permissionOverrides:
						(row.permissionOverrides as Record<string, unknown> | null) ?? null,
				})),
			);
		},
	);
};
