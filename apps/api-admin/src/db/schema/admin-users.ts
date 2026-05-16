import {
	boolean,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	// Numeric sequence generated externally — used as an alternative login credential
	registration: varchar("registration", { length: 50 }).notNull().unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	avatarUrl: text("avatar_url"),
	isActive: boolean("is_active").notNull().default(true),
	deletedAt: timestamp("deleted_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
