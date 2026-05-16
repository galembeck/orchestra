import { eq, or } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { adminUsers } from "@/db/schema/admin-users.js";
import { hashPassword } from "@/lib/crypto.js";
import { createAdminUserSchema } from "@/schemas/admin-users/create-admin-user.schema.js";

export const createAdminUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/admin-users",
		{
			schema: {
				summary: "Create a new admin user",
				tags: ["Admin Users"],
				body: createAdminUserSchema,
				response: {
					201: z.object({
						user: z.object({
							id: z.string().uuid(),
							name: z.string(),
							email: z.string(),
							registration: z.string(),
							avatarUrl: z.string().nullable(),
							isActive: z.boolean(),
							createdAt: z.date(),
						}),
					}),
					409: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const { name, email, registration, password, avatarUrl } = req.body;

			const [existing] = await app.db
				.select({ id: adminUsers.id })
				.from(adminUsers)
				.where(
					or(
						eq(adminUsers.email, email),
						eq(adminUsers.registration, registration),
					),
				)
				.limit(1);

			if (existing) {
				return reply
					.status(409)
					.send({ message: "E-mail ou matrícula já cadastrado." });
			}

			const passwordHash = await hashPassword(password);

			const [user] = await app.db
				.insert(adminUsers)
				.values({ name, email, registration, passwordHash, avatarUrl })
				.returning({
					id: adminUsers.id,
					name: adminUsers.name,
					email: adminUsers.email,
					registration: adminUsers.registration,
					avatarUrl: adminUsers.avatarUrl,
					isActive: adminUsers.isActive,
					createdAt: adminUsers.createdAt,
				});

			return reply.status(201).send({ user });
		},
	);
};
