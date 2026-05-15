import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { registerClientRoute } from "./auth/register-client.js";
import { registerOwnerRoute } from "./auth/register-owner.js";
import { signInRoute } from "./auth/sign-in.js";
import { getStatusRoute } from "./status/get-status.js";
import { getMeRoute } from "./users/get-me.js";

export const routes: FastifyPluginAsyncZod = async (app) => {
	await app.register(getStatusRoute);
	await app.register(registerClientRoute);
	await app.register(registerOwnerRoute);
	await app.register(signInRoute);
	await app.register(getMeRoute);
};
