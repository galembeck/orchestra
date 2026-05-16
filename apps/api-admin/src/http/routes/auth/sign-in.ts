import { eq, or } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { adminUsers } from "@/db/schema/admin-users.js";
import { verifyPassword } from "@/lib/crypto.js";
import { signInSchema } from "@/schemas/auth/sign-in.schema.js";

export const signInRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/auth/sign-in",
		{
			schema: {
				summary:
					"Authenticate an admin user with e-mail or registration number",
				tags: ["Auth"],
				body: signInSchema,
				response: {
					200: z.object({
						user: z.object({
							id: z.string().uuid(),
							name: z.string(),
							email: z.string(),
						}),
					}),
					401: z.object({ message: z.string() }),
					403: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const { identifier, password, rememberMe } = req.body;

			const [user] = await app.db
				.select({
					id: adminUsers.id,
					name: adminUsers.name,
					email: adminUsers.email,
					passwordHash: adminUsers.passwordHash,
					isActive: adminUsers.isActive,
					deletedAt: adminUsers.deletedAt,
				})
				.from(adminUsers)
				.where(
					or(
						eq(adminUsers.email, identifier),
						eq(adminUsers.registration, identifier),
					),
				)
				.limit(1);

			if (!user || user.deletedAt !== null) {
				return reply.status(401).send({ message: "Credenciais inválidas." });
			}

			if (!user.isActive) {
				return reply.status(403).send({
					message: "Conta desativada. Entre em contato com o suporte.",
				});
			}

			const valid = await verifyPassword(password, user.passwordHash);
			if (!valid) {
				return reply.status(401).send({ message: "Credenciais inválidas." });
			}

			const accessToken = app.jwt.sign({
				sub: user.id,
				name: user.name,
				email: user.email,
			});

			reply.setCookie("admin_access_token", accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: rememberMe ? 7 * 24 * 60 * 60 : 15 * 60,
			});

			return reply.status(200).send({
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
				},
			});
		},
	);
};
