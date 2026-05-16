CREATE TYPE "public"."company_document_type" AS ENUM('CNPJ_DOCUMENT', 'ADDRESS_PROOF', 'OWNER_IDENTITY', 'OPERATING_LICENSE');--> statement-breakpoint
CREATE TABLE "company_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"type" "company_document_type" NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_path" varchar(500) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_documents" ADD CONSTRAINT "company_documents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;