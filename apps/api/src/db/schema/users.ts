import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", [
	"CLIENT",
	"WORKER",
	"OWNER",
]);

export const profileTypeEnum = pgEnum("profile_type", [
	"ADMIN",
	"CLIENT",
	"PLATFORM_DEVELOPER",
]);

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	phone: varchar("phone", { length: 20 }),
	document: varchar("document", { length: 20 }),
	avatarUrl: text("avatar_url"),
	accountType: accountTypeEnum("account_type").notNull().default("CLIENT"),
	profileType: profileTypeEnum("profile_type").notNull().default("CLIENT"),
	zipCode: varchar("zip_code", { length: 10 }),
	street: varchar("street", { length: 255 }),
	number: varchar("number", { length: 20 }),
	complement: varchar("complement", { length: 100 }),
	neighborhood: varchar("neighborhood", { length: 100 }),
	city: varchar("city", { length: 100 }),
	state: varchar("state", { length: 2 }),
	deletedAt: timestamp("deleted_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
