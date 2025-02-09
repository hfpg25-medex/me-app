import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteOldRecords() {
  try {
    // Get the 50 earliest records
    const oldRecords = await prisma.record.findMany({
      orderBy: {
        dateCreated: "asc",
      },
      take: 50,
      include: {
        submission: true,
        draftSubmission: true,
      },
    });

    console.log(`Found ${oldRecords.length} records to delete`);

    // Delete records and their associated submissions
    for (const record of oldRecords) {
      // Delete the record first (this will handle the foreign key constraints)
      await prisma.record.delete({
        where: {
          id: record.id,
        },
      });

      // Delete associated submission if it exists
      if (record.submissionId) {
        await prisma.submission.delete({
          where: {
            id: record.submissionId,
          },
        });
      }

      // Delete associated draft submission if it exists
      if (record.draftSubmissionId) {
        await prisma.draftSubmission.delete({
          where: {
            id: record.draftSubmissionId,
          },
        });
      }

      console.log(`Deleted record ${record.id} and its associated submissions`);
    }

    console.log("Successfully deleted old records and their submissions");
  } catch (error) {
    console.error("Error deleting records:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteOldRecords();
