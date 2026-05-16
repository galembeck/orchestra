ALTER TABLE "companies" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_slug_unique" UNIQUE("slug");