import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import fp from "fastify-plugin";
import { env } from "@/lib/env.js";

export const authPlugin = fp(async (app) => {
	await app.register(cookie, {
		secret: env.COOKIE_SECRET,
	});

	await app.register(jwt, {
		secret: env.JWT_SECRET,
		cookie: {
			cookieName: "admin_access_token",
			signed: false,
		},
		sign: {
			expiresIn: "15m",
		},
	});
});
