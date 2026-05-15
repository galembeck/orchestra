import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const companyDocumentTypeEnum = pgEnum("company_document_type", [
	"CNPJ",
	"SOCIAL_CONTRACT",
	"OPERATING_LICENSE",
	"OTHER",
]);

export const companyDocuments = pgTable("company_documents", {
	id: uuid("id").primaryKey().defaultRandom(),
	companyId: uuid("company_id")
		.notNull()
		.references(() => companies.id, { onDelete: "cascade" }),
	type: companyDocumentTypeEnum("type").notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	url: text("url").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CompanyDocument = typeof companyDocuments.$inferSelect;
export type NewCompanyDocument = typeof companyDocuments.$inferInsert;
