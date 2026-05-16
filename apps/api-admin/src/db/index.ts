import * as companiesSchema from "@repo/db/schema/companies.js";
import * as usersSchema from "@repo/db/schema/users.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as adminUsersSchema from "@/db/schema/admin-users.js";
import { env } from "@/lib/env.js";

const client = postgres(env.DATABASE_URL);

const schema = {
	...adminUsersSchema,
	...companiesSchema,
	...usersSchema,
};

export const db = drizzle(client, { schema });

export type Database = typeof db;
