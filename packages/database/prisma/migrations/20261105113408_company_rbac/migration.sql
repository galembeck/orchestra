-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('ADMIN', 'BILLING', 'MEMBER');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "role" "CompanyRole" NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "CompanyRole" NOT NULL DEFAULT 'MEMBER',
    "token" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_id" TEXT NOT NULL,
    "author_id" TEXT,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_roles" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "job_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_job_roles" (
    "company_id" TEXT NOT NULL,
    "job_role_id" TEXT NOT NULL,

    CONSTRAINT "company_job_roles_pkey" PRIMARY KEY ("company_id","job_role_id")
);

-- CreateTable
CREATE TABLE "member_job_roles" (
    "member_id" TEXT NOT NULL,
    "job_role_id" TEXT NOT NULL,

    CONSTRAINT "member_job_roles_pkey" PRIMARY KEY ("member_id","job_role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "members_user_id_key" ON "members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "invites_token_key" ON "invites"("token");

-- CreateIndex
CREATE INDEX "invites_email_idx" ON "invites"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invites_email_company_id_key" ON "invites"("email", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_roles_key_key" ON "job_roles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "job_roles_slug_key" ON "job_roles"("slug");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_job_roles" ADD CONSTRAINT "company_job_roles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_job_roles" ADD CONSTRAINT "company_job_roles_job_role_id_fkey" FOREIGN KEY ("job_role_id") REFERENCES "job_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_job_roles" ADD CONSTRAINT "member_job_roles_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_job_roles" ADD CONSTRAINT "member_job_roles_job_role_id_fkey" FOREIGN KEY ("job_role_id") REFERENCES "job_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
