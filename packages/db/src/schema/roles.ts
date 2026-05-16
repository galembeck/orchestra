import {
	boolean,
	pgTable,
	timestamp,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const roles = pgTable(
	"roles",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 255 }),
		key: varchar("key", { length: 100 }).notNull(),
		companyId: uuid("company_id").references(() => companies.id, {
			onDelete: "cascade",
		}),
		isSystem: boolean("is_system").notNull().default(false),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(t) => [unique("roles_key_company_unique").on(t.key, t.companyId)]
);

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
