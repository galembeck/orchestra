import {
	boolean,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const roles = pgTable("roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	key: varchar("key", { length: 100 }).notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	description: text("description"),
	// null = system-wide role; set = company-scoped custom role
	companyId: uuid("company_id").references(() => companies.id, {
		onDelete: "cascade",
	}),
	isSystem: boolean("is_system").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
