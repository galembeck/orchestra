import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const companyApprovalStatusEnum = pgEnum("company_approval_status", [
	"PENDING",
	"APPROVED",
	"REJECTED",
]);

export const companies = pgTable("companies", {
	id: uuid("id").primaryKey().defaultRandom(),
	socialReason: varchar("social_reason", { length: 255 }).notNull(),
	fantasyName: varchar("fantasy_name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
	ownerId: uuid("owner_id")
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	approvalStatus: companyApprovalStatusEnum("approval_status")
		.notNull()
		.default("PENDING"),
	approvedAt: timestamp("approved_at"),
	zipCode: varchar("zip_code", { length: 10 }),
	street: varchar("street", { length: 255 }),
	number: varchar("number", { length: 20 }),
	complement: varchar("complement", { length: 100 }),
	neighborhood: varchar("neighborhood", { length: 100 }),
	city: varchar("city", { length: 100 }),
	state: varchar("state", { length: 2 }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
