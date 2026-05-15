import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const serviceCategories = pgTable("service_categories", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 100 }).notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type NewServiceCategory = typeof serviceCategories.$inferInsert;
