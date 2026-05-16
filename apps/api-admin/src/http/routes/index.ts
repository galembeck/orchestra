import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createAdminUserRoute } from "./admin-users/create-admin-user.js";
import { signInRoute } from "./auth/sign-in.js";
import { approveCompanyRoute } from "./companies/approve-company.js";
import { getCompanyRegistrationsRoute } from "./companies/get-registrations.js";
import { rejectCompanyRoute } from "./companies/reject-company.js";
import { getStatusRoute } from "./status/get-status.js";
import { getMeRoute } from "./users/get-me.js";

export const routes: FastifyPluginAsyncZod = async (app) => {
	await app.register(getStatusRoute);
	await app.register(signInRoute);
	await app.register(getMeRoute);
	await app.register(createAdminUserRoute);
	await app.register(getCompanyRegistrationsRoute);
	await app.register(approveCompanyRoute);
	await app.register(rejectCompanyRoute);
};
