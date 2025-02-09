/*
  Warnings:

  - A unique constraint covering the columns `[userId,examType,foreignerId]` on the table `DraftSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `foreignerId` to the `DraftSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DraftSubmission_userId_examType_key";

-- AlterTable
ALTER TABLE "DraftSubmission" ADD COLUMN     "foreignerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "DraftSubmission_foreignerId_idx" ON "DraftSubmission"("foreignerId");

-- CreateIndex
CREATE UNIQUE INDEX "DraftSubmission_userId_examType_foreignerId_key" ON "DraftSubmission"("userId", "examType", "foreignerId");
