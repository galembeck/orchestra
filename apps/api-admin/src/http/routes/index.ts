// apps/api-admin/src/http/routes/index.ts
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getAdminRolesRoute } from "./admin-roles/get-admin-roles.js";
import { createAdminUserRoute } from "./admin-users/create-admin-user.js";
import { getAdminUsersRoute } from "./admin-users/get-admin-users.js";
import { updateAdminUserPermissionsRoute } from "./admin-users/update-admin-user-permissions.js";
import { updateAdminUserRoleRoute } from "./admin-users/update-admin-user-role.js";
import { signInRoute } from "./auth/sign-in.js";
import { approveCompanyRoute } from "./companies/approve-company.js";
import { getCompanyDocumentsRoute } from "./companies/get-company-documents.js";
import { getCompanyRegistrationRoute } from "./companies/get-company-registration.js";
import { getCompanyRegistrationsRoute } from "./companies/get-registrations.js";
import { rejectCompanyRoute } from "./companies/reject-company.js";
import { getStatusRoute } from "./status/get-status.js";
import { getMeRoute } from "./users/get-me.js";

export const routes: FastifyPluginAsyncZod = async (app) => {
	await app.register(getStatusRoute);
	await app.register(signInRoute);
	await app.register(getMeRoute);
	await app.register(createAdminUserRoute);
	await app.register(getAdminUsersRoute);
	await app.register(updateAdminUserRoleRoute);
	await app.register(updateAdminUserPermissionsRoute);
	await app.register(getAdminRolesRoute);
	await app.register(getCompanyRegistrationsRoute);
	await app.register(getCompanyRegistrationRoute);
	await app.register(getCompanyDocumentsRoute);
	await app.register(approveCompanyRoute);
	await app.register(rejectCompanyRoute);
};
