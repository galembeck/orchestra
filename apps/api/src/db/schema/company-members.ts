import {
	boolean,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { roles } from "./roles.js";
import { users } from "./users.js";

export const companyMembers = pgTable(
	"company_members",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		companyId: uuid("company_id")
			.notNull()
			.references(() => companies.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		roleId: uuid("role_id").references(() => roles.id, {
			onDelete: "set null",
		}),
		isOwner: boolean("is_owner").notNull().default(false),
		memberSince: timestamp("member_since").notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex("company_member_unique").on(table.companyId, table.userId),
	],
);

export type CompanyMember = typeof companyMembers.$inferSelect;
export type NewCompanyMember = typeof companyMembers.$inferInsert;
