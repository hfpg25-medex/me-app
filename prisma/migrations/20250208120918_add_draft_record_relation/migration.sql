/*
  Warnings:

  - A unique constraint covering the columns `[draftSubmissionId]` on the table `Record` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_submissionId_fkey";

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "draftSubmissionId" TEXT,
ALTER COLUMN "submissionId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Record_draftSubmissionId_key" ON "Record"("draftSubmissionId");

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_draftSubmissionId_fkey" FOREIGN KEY ("draftSubmissionId") REFERENCES "DraftSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
