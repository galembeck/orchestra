import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { serviceCategories } from "./service-categories.js";

export const services = pgTable("services", {
	id: uuid("id").primaryKey().defaultRandom(),
	companyId: uuid("company_id")
		.notNull()
		.references(() => companies.id, { onDelete: "cascade" }),
	categoryId: uuid("category_id").references(() => serviceCategories.id, {
		onDelete: "set null",
	}),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	durationMinutes: integer("duration_minutes"),
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
