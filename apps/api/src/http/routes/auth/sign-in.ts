import { users } from "@repo/db/schema/users.js";
import { eq, or } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyPassword } from "@/lib/crypto.js";

export const signInRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/auth/sign-in",
		{
			schema: {
				summary: "Authenticate and obtain access + refresh tokens",
				tags: ["Auth"],
				body: z.object({
					identifier: z.string().min(1),
					password: z.string().min(1),
					rememberMe: z.boolean().optional().default(false),
				}),
				response: {
					200: z.object({
						user: z.object({
							id: z.string().uuid(),
							name: z.string(),
							email: z.string(),
							accountType: z.enum(["CLIENT", "WORKER", "OWNER"]),
							profileType: z.enum(["ADMIN", "CLIENT", "PLATFORM_DEVELOPER"]),
						}),
					}),
					401: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const { identifier, password, rememberMe } = req.body;

			const [user] = await app.db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					passwordHash: users.passwordHash,
					accountType: users.accountType,
					profileType: users.profileType,
					deletedAt: users.deletedAt,
				})
				.from(users)
				.where(or(eq(users.email, identifier), eq(users.document, identifier)))
				.limit(1);

			if (!user || user.deletedAt !== null) {
				return reply.status(401).send({ message: "Credenciais inválidas." });
			}

			const valid = await verifyPassword(password, user.passwordHash);
			if (!valid) {
				return reply.status(401).send({ message: "Credenciais inválidas." });
			}

			const accessToken = app.jwt.sign({
				sub: user.id,
				profileType: user.profileType,
				accountType: user.accountType,
			});

			reply.setCookie("access_token", accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: rememberMe ? 7 * 24 * 60 * 60 : 15 * 60, // 7 days or 15 minutes
			});

			return reply.status(200).send({
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					accountType: user.accountType,
					profileType: user.profileType,
				},
			});
		},
	);
};
