import {
	pgEnum,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { roles } from "./roles.js";
import { users } from "./users.js";

export const invitationStatusEnum = pgEnum("invitation_status", [
	"PENDING",
	"ACCEPTED",
	"REJECTED",
	"EXPIRED",
]);

export const companyInvitations = pgTable("company_invitations", {
	id: uuid("id").primaryKey().defaultRandom(),
	companyId: uuid("company_id")
		.notNull()
		.references(() => companies.id, { onDelete: "cascade" }),
	invitedByUserId: uuid("invited_by_user_id")
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	email: varchar("email", { length: 255 }).notNull(),
	roleId: uuid("role_id").references(() => roles.id, {
		onDelete: "set null",
	}),
	token: varchar("token", { length: 255 }).notNull().unique(),
	status: invitationStatusEnum("status").notNull().default("PENDING"),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CompanyInvitation = typeof companyInvitations.$inferSelect;
export type NewCompanyInvitation = typeof companyInvitations.$inferInsert;
