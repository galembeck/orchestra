import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const companyDocumentTypeEnum = pgEnum("company_document_type", [
	"CNPJ_DOCUMENT",
	"ADDRESS_PROOF",
	"OWNER_IDENTITY",
	"OPERATING_LICENSE",
]);

export const companyDocuments = pgTable("company_documents", {
	id: uuid("id").primaryKey().defaultRandom(),
	companyId: uuid("company_id")
		.notNull()
		.references(() => companies.id, { onDelete: "cascade" }),
	type: companyDocumentTypeEnum("type").notNull(),
	fileName: varchar("file_name", { length: 255 }).notNull(),
	filePath: varchar("file_path", { length: 500 }).notNull(),
	mimeType: varchar("mime_type", { length: 100 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CompanyDocument = typeof companyDocuments.$inferSelect;
export type NewCompanyDocument = typeof companyDocuments.$inferInsert;
