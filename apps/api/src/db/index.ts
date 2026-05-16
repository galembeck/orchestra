import * as companiesSchema from "@repo/db/schema/companies.js";
import * as companyDocumentsSchema from "@repo/db/schema/company-documents.js";
import * as companyMembersSchema from "@repo/db/schema/company-members.js";
import * as rolePermissionsSchema from "@repo/db/schema/role-permissions.js";
import * as rolesSchema from "@repo/db/schema/roles.js";
import * as usersSchema from "@repo/db/schema/users.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env.js";

const client = postgres(env.DATABASE_URL);

const schema = {
	...companiesSchema,
	...companyDocumentsSchema,
	...companyMembersSchema,
	...rolePermissionsSchema,
	...rolesSchema,
	...usersSchema,
};

export const db = drizzle(client, { schema });

export type Database = typeof db;
