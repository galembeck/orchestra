CREATE TYPE "public"."company_approval_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('CLIENT', 'WORKER', 'OWNER');--> statement-breakpoint
CREATE TYPE "public"."profile_type" AS ENUM('ADMIN', 'CLIENT', 'PLATFORM_DEVELOPER');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"social_reason" varchar(255) NOT NULL,
	"fantasy_name" varchar(255) NOT NULL,
	"cnpj" varchar(18) NOT NULL,
	"owner_id" uuid NOT NULL,
	"approval_status" "company_approval_status" DEFAULT 'PENDING' NOT NULL,
	"approved_at" timestamp,
	"zip_code" varchar(10),
	"street" varchar(255),
	"number" varchar(20),
	"complement" varchar(100),
	"neighborhood" varchar(100),
	"city" varchar(100),
	"state" varchar(2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "company_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"role_id" uuid,
	"is_owner" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_key" varchar(100) NOT NULL,
	CONSTRAINT "role_permissions_role_key_unique" UNIQUE("role_id","permission_key")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"key" varchar(100) NOT NULL,
	"company_id" uuid,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_key_company_unique" UNIQUE("key","company_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"phone" varchar(20),
	"document" varchar(20),
	"avatar_url" text,
	"account_type" "account_type" DEFAULT 'CLIENT' NOT NULL,
	"profile_type" "profile_type" DEFAULT 'CLIENT' NOT NULL,
	"zip_code" varchar(10),
	"street" varchar(255),
	"number" varchar(20),
	"complement" varchar(100),
	"neighborhood" varchar(100),
	"city" varchar(100),
	"state" varchar(2),
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;