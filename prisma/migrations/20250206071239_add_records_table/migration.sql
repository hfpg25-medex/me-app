-- CreateTable
CREATE TABLE "Record" (
    "id" TEXT NOT NULL,
    "foreignerId" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "agency" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "pending" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Record_submissionId_key" ON "Record"("submissionId");

-- CreateIndex
CREATE INDEX "Record_foreignerId_idx" ON "Record"("foreignerId");

-- CreateIndex
CREATE INDEX "Record_status_idx" ON "Record"("status");

-- CreateIndex
CREATE INDEX "Record_dateCreated_idx" ON "Record"("dateCreated");

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
