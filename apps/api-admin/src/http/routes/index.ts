import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createAdminUserRoute } from "./admin-users/create-admin-user.js";
import { signInRoute } from "./auth/sign-in.js";
import { getStatusRoute } from "./status/get-status.js";

export const routes: FastifyPluginAsyncZod = async (app) => {
	await app.register(getStatusRoute);
	await app.register(signInRoute);
	await app.register(createAdminUserRoute);
};
