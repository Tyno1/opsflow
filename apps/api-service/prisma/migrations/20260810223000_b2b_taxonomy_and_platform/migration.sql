-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('PLATFORM_SUPPORT', 'PLATFORM_ADMIN');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('INCIDENT', 'SERVICE_REQUEST', 'PROBLEM', 'CHANGE');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('OWNER', 'ADMIN', 'AGENT', 'REQUESTER', 'VENDOR');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING (CASE WHEN "role"::text = 'CUSTOMER' THEN 'REQUESTER'::"Role_new" ELSE "role"::text::"Role_new" END);
ALTER TABLE "invites" ALTER COLUMN "role" TYPE "Role_new" USING (CASE WHEN "role"::text = 'CUSTOMER' THEN 'REQUESTER'::"Role_new" ELSE "role"::text::"Role_new" END);
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TicketActivityType" ADD VALUE 'TYPE_CHANGED';
ALTER TYPE "TicketActivityType" ADD VALUE 'DEPARTMENT_CHANGED';

-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_ON_REQUESTER', 'RESOLVED', 'CLOSED');
ALTER TABLE "public"."tickets" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tickets" ALTER COLUMN "status" TYPE "TicketStatus_new" USING (CASE WHEN "status"::text = 'WAITING_ON_CUSTOMER' THEN 'WAITING_ON_REQUESTER'::"TicketStatus_new" ELSE "status"::text::"TicketStatus_new" END);
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "public"."TicketStatus_old";
ALTER TABLE "tickets" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_invitedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "organization_branding" DROP CONSTRAINT "organization_branding_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ticket_assignments" DROP CONSTRAINT "ticket_assignments_assigneeUserId_fkey";

-- AlterTable
ALTER TABLE "invites" ALTER COLUMN "invitedByUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "organization_domains" DROP COLUMN "hostingActivatedAt",
DROP COLUMN "hostingStatus",
DROP COLUMN "purposes";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "privacyUrl",
DROP COLUMN "supportFooterText",
DROP COLUMN "termsUrl";

-- AlterTable
ALTER TABLE "ticket_activities" ADD COLUMN     "platformAccessSessionId" UUID;

-- AlterTable
ALTER TABLE "ticket_assignments" ALTER COLUMN "assigneeUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ticket_classifications" DROP COLUMN "category",
ADD COLUMN     "categoryId" UUID,
ADD COLUMN     "departmentId" UUID,
ADD COLUMN     "shouldEscalate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subcategoryId" UUID,
ADD COLUMN     "type" "TicketType" NOT NULL DEFAULT 'INCIDENT';

-- AlterTable
ALTER TABLE "ticket_summaries" ADD COLUMN     "keyPoints" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "category",
ADD COLUMN     "categoryId" UUID,
ADD COLUMN     "departmentId" UUID,
ADD COLUMN     "subcategoryId" UUID,
ADD COLUMN     "type" "TicketType" NOT NULL DEFAULT 'INCIDENT';

-- DropTable
DROP TABLE "organization_branding";

-- DropEnum
DROP TYPE "BrandingSource";

-- DropEnum
DROP TYPE "BrandingStatus";

-- DropEnum
DROP TYPE "DomainHostingStatus";

-- DropEnum
DROP TYPE "DomainPurpose";

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategories" (
    "id" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_users" (
    "id" UUID NOT NULL,
    "identityProvider" "IdentityProvider" NOT NULL,
    "externalId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "PlatformRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_access_sessions" (
    "id" UUID NOT NULL,
    "platformUserId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "platform_access_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "departments_organizationId_isActive_idx" ON "departments"("organizationId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "departments_organizationId_name_key" ON "departments"("organizationId", "name");

-- CreateIndex
CREATE INDEX "categories_departmentId_isActive_idx" ON "categories"("departmentId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "categories_departmentId_name_key" ON "categories"("departmentId", "name");

-- CreateIndex
CREATE INDEX "subcategories_categoryId_isActive_idx" ON "subcategories"("categoryId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "subcategories_categoryId_name_key" ON "subcategories"("categoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "platform_users_email_key" ON "platform_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "platform_users_identityProvider_externalId_key" ON "platform_users"("identityProvider", "externalId");

-- CreateIndex
CREATE INDEX "platform_access_sessions_organizationId_startedAt_idx" ON "platform_access_sessions"("organizationId", "startedAt" DESC);

-- CreateIndex
CREATE INDEX "platform_access_sessions_platformUserId_endedAt_idx" ON "platform_access_sessions"("platformUserId", "endedAt");

-- CreateIndex
CREATE INDEX "tickets_departmentId_idx" ON "tickets"("departmentId");

-- CreateIndex
CREATE INDEX "tickets_categoryId_idx" ON "tickets"("categoryId");

-- CreateIndex
CREATE INDEX "tickets_subcategoryId_idx" ON "tickets"("subcategoryId");

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_activities" ADD CONSTRAINT "ticket_activities_platformAccessSessionId_fkey" FOREIGN KEY ("platformAccessSessionId") REFERENCES "platform_access_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignments" ADD CONSTRAINT "ticket_assignments_assigneeUserId_fkey" FOREIGN KEY ("assigneeUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_classifications" ADD CONSTRAINT "ticket_classifications_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_classifications" ADD CONSTRAINT "ticket_classifications_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_classifications" ADD CONSTRAINT "ticket_classifications_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_access_sessions" ADD CONSTRAINT "platform_access_sessions_platformUserId_fkey" FOREIGN KEY ("platformUserId") REFERENCES "platform_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_access_sessions" ADD CONSTRAINT "platform_access_sessions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

