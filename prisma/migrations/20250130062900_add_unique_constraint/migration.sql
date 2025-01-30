/*
  Warnings:

  - A unique constraint covering the columns `[userId,examType]` on the table `DraftSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DraftSubmission_userId_examType_key" ON "DraftSubmission"("userId", "examType");
