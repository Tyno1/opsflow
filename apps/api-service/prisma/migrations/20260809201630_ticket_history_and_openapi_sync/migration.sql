/*
  Warnings:

  - You are about to drop the column `authorId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `authorUserId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `invites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitedByUserId` to the `invites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `organization_domains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketActivityType" AS ENUM ('STATUS_CHANGED', 'PRIORITY_CHANGED', 'ASSIGNED', 'CATEGORY_CHANGED');

-- CreateEnum
CREATE TYPE "ClassificationSource" AS ENUM ('AI', 'MANUAL');

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_authorId_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "authorId",
ADD COLUMN     "authorUserId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "invites" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invitedByUserId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "organization_domains" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "subject",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ticket_activities" (
    "id" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "actorUserId" UUID,
    "type" "TicketActivityType" NOT NULL,
    "fromValue" TEXT,
    "toValue" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_assignments" (
    "id" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "assigneeUserId" UUID NOT NULL,
    "assignedByUserId" UUID,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "ticket_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_summaries" (
    "id" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "summary" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_classifications" (
    "id" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "priority" "TicketPriority" NOT NULL,
    "sentiment" "Sentiment" NOT NULL,
    "source" "ClassificationSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticket_activities_ticketId_createdAt_idx" ON "ticket_activities"("ticketId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ticket_assignments_ticketId_assignedAt_idx" ON "ticket_assignments"("ticketId", "assignedAt" DESC);

-- CreateIndex
CREATE INDEX "ticket_summaries_ticketId_createdAt_idx" ON "ticket_summaries"("ticketId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ticket_classifications_ticketId_createdAt_idx" ON "ticket_classifications"("ticketId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_activities" ADD CONSTRAINT "ticket_activities_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_activities" ADD CONSTRAINT "ticket_activities_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignments" ADD CONSTRAINT "ticket_assignments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignments" ADD CONSTRAINT "ticket_assignments_assigneeUserId_fkey" FOREIGN KEY ("assigneeUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignments" ADD CONSTRAINT "ticket_assignments_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_summaries" ADD CONSTRAINT "ticket_summaries_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_classifications" ADD CONSTRAINT "ticket_classifications_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
