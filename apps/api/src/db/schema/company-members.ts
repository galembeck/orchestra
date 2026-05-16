import { boolean, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { roles } from "./roles.js";
import { users } from "./users.js";

export const companyMembers = pgTable("company_members", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	companyId: uuid("company_id")
		.notNull()
		.references(() => companies.id, { onDelete: "cascade" }),
	roleId: uuid("role_id").references(() => roles.id, { onDelete: "set null" }),
	isOwner: boolean("is_owner").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CompanyMember = typeof companyMembers.$inferSelect;
export type NewCompanyMember = typeof companyMembers.$inferInsert;
