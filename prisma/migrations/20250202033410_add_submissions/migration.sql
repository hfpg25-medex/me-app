-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "submissionId" TEXT NOT NULL,
    "clinicId" TEXT,
    "doctorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Submission_submissionId_key" ON "Submission"("submissionId");

-- CreateIndex
CREATE INDEX "Submission_userId_idx" ON "Submission"("userId");

-- CreateIndex
CREATE INDEX "Submission_examType_idx" ON "Submission"("examType");

-- CreateIndex
CREATE INDEX "Submission_submissionId_idx" ON "Submission"("submissionId");
