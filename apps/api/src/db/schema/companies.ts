import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const companyApprovalStatusEnum = pgEnum("company_approval_status", [
	"PENDING",
	"APPROVED",
	"REJECTED",
]);

export const segmentEnum = pgEnum("segment", [
	"RESIDENTIAL",
	"BUSINESS",
	"INDUSTRIAL",
]);

export const companies = pgTable("companies", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull(),
	phone: varchar("phone", { length: 20 }),
	document: varchar("document", { length: 30 }),
	logoUrl: text("logo_url"),
	description: text("description"),
	segment: segmentEnum("segment"),
	approvalStatus: companyApprovalStatusEnum("approval_status")
		.notNull()
		.default("PENDING"),
	ownerId: uuid("owner_id")
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	// Address
	street: varchar("street", { length: 255 }),
	number: varchar("number", { length: 20 }),
	complement: varchar("complement", { length: 100 }),
	neighborhood: varchar("neighborhood", { length: 100 }),
	city: varchar("city", { length: 100 }),
	state: varchar("state", { length: 2 }),
	zipCode: varchar("zip_code", { length: 10 }),
	// Configuration
	maxTeamSize: integer("max_team_size"),
	allowPublicBooking: boolean("allow_public_booking").notNull().default(false),
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
