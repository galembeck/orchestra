import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as adminUsersSchema from "@/db/schema/admin-users.js";
import { env } from "@/lib/env.js";

const client = postgres(env.DATABASE_URL);

const schema = {
	...adminUsersSchema,
};

export const db = drizzle(client, { schema });

export type Database = typeof db;
