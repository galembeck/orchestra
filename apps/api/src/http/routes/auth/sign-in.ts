import { and, eq, gt, isNull } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { sessions, users } from "@/db/schema/index.js";
import {
	generateRefreshToken,
	hashRefreshToken,
	verifyPassword,
} from "@/lib/crypto.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const signInRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/auth/sign-in",
		{
			schema: {
				summary: "Authenticate and obtain access + refresh tokens",
				tags: ["Auth"],
				body: z.object({
					email: z.email(),
					password: z.string().min(1),
				}),
				response: {
					200: z.object({
						user: z.object({
							id: z.string().uuid(),
							name: z.string(),
							email: z.string(),
							accountType: z.enum(["CLIENT", "WORKER", "COMPANY"]),
							profileType: z.enum(["ADMIN", "CLIENT", "PLATFORM_DEVELOPER"]),
						}),
					}),
					401: z.object({ message: z.string() }),
				},
			},
		},
		async (req, reply) => {
			const { email, password } = req.body;

			const [user] = await app.db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					passwordHash: users.passwordHash,
					accountType: users.accountType,
					profileType: users.profileType,
					isActive: users.isActive,
				})
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			if (!user || !user.isActive) {
				return reply.status(401).send({ message: "Credenciais inválidas." });
			}

			const valid = await verifyPassword(password, user.passwordHash);
			if (!valid) {
				return reply.status(401).send({ message: "Credenciais inválidas." });
			}

			// Revoke any existing active sessions for this user
			await app.db
				.update(sessions)
				.set({ revokedAt: new Date() })
				.where(
					and(
						eq(sessions.userId, user.id),
						isNull(sessions.revokedAt),
						gt(sessions.expiresAt, new Date()),
					),
				);

			// Issue new refresh token and persist its hash
			const refreshToken = generateRefreshToken();
			const refreshTokenHash = hashRefreshToken(refreshToken);
			const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

			await app.db.insert(sessions).values({
				userId: user.id,
				refreshTokenHash,
				expiresAt,
			});

			// Sign access JWT — carries both platform profile and account type
			const accessToken = app.jwt.sign({
				sub: user.id,
				profileType: user.profileType,
				accountType: user.accountType,
			});

			reply
				.setCookie("access_token", accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					path: "/",
					maxAge: 15 * 60, // 15 minutes (seconds)
				})
				.setCookie("refresh_token", refreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					path: "/auth/refresh",
					maxAge: 7 * 24 * 60 * 60, // 7 days (seconds)
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
