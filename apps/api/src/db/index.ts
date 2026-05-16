import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as companiesSchema from "@/db/schema/companies.js";
import * as companyDocumentsSchema from "@/db/schema/company-documents.js";
import * as companyMembersSchema from "@/db/schema/company-members.js";
import * as rolePermissionsSchema from "@/db/schema/role-permissions.js";
import * as rolesSchema from "@/db/schema/roles.js";
import * as usersSchema from "@/db/schema/users.js";
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
