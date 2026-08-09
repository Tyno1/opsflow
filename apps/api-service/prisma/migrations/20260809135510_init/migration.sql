-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'AGENT', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING_APPROVAL', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "IdentityProvider" AS ENUM ('ENTRA_ID');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('positive', 'neutral', 'negative', 'angry');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TICKET_STATUS_CHANGED', 'TICKET_AGENT_REPLIED', 'TICKET_ASSIGNED', 'STAFF_INVITED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('SENT', 'SUPPRESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "BrandingSource" AS ENUM ('AUTO_FETCHED', 'CUSTOM', 'DEFAULT');

-- CreateEnum
CREATE TYPE "BrandingStatus" AS ENUM ('PENDING', 'FETCHED', 'NOT_FOUND', 'FAILED');

-- CreateEnum
CREATE TYPE "DomainPurpose" AS ENUM ('AUTH_MATCHING', 'CUSTOM_HOSTING');

-- CreateEnum
CREATE TYPE "DomainHostingStatus" AS ENUM ('NOT_REQUESTED', 'PENDING_CNAME', 'PENDING_CERT', 'ACTIVE', 'FAILED');

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "supportEmail" TEXT NOT NULL,
    "termsUrl" TEXT,
    "privacyUrl" TEXT,
    "supportFooterText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_branding" (
    "organizationId" UUID NOT NULL,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "primaryColor" TEXT,
    "accentColor" TEXT,
    "fontFamily" TEXT,
    "hideAttribution" BOOLEAN NOT NULL DEFAULT false,
    "source" "BrandingSource" NOT NULL DEFAULT 'DEFAULT',
    "brandingStatus" "BrandingStatus" NOT NULL DEFAULT 'PENDING',
    "fetchedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_branding_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "organization_domains" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "domain" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "purposes" "DomainPurpose"[],
    "hostingStatus" "DomainHostingStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "hostingActivatedAt" TIMESTAMP(3),

    CONSTRAINT "organization_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "identityProvider" "IdentityProvider" NOT NULL,
    "externalId" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role",
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invites" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT,
    "sentiment" "Sentiment",
    "createdById" UUID NOT NULL,
    "assignedToId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "isInternalNote" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'EMAIL',
    "relatedTicketId" UUID,
    "status" "NotificationStatus" NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_subdomain_key" ON "organizations"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "organization_domains_domain_key" ON "organization_domains"("domain");

-- CreateIndex
CREATE INDEX "organization_domains_organizationId_idx" ON "organization_domains"("organizationId");

-- CreateIndex
CREATE INDEX "users_organizationId_status_idx" ON "users"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "users_identityProvider_externalId_key" ON "users"("identityProvider", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "users_organizationId_email_key" ON "users"("organizationId", "email");

-- CreateIndex
CREATE INDEX "invites_organizationId_status_idx" ON "invites"("organizationId", "status");

-- CreateIndex
CREATE INDEX "invites_organizationId_email_idx" ON "invites"("organizationId", "email");

-- CreateIndex
CREATE INDEX "tickets_organizationId_status_idx" ON "tickets"("organizationId", "status");

-- CreateIndex
CREATE INDEX "tickets_organizationId_assignedToId_idx" ON "tickets"("organizationId", "assignedToId");

-- CreateIndex
CREATE INDEX "comments_ticketId_idx" ON "comments"("ticketId");

-- CreateIndex
CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "notifications_organizationId_idx" ON "notifications"("organizationId");

-- AddForeignKey
ALTER TABLE "organization_branding" ADD CONSTRAINT "organization_branding_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_domains" ADD CONSTRAINT "organization_domains_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_relatedTicketId_fkey" FOREIGN KEY ("relatedTicketId") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
