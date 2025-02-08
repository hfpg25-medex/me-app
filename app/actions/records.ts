"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSubmissionAndRecord(data: {
  userId: string;
  examType: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  formData: any;
  submissionId: string;
  clinicId?: string;
  doctorId?: string;
  foreignerId: string;
  agency: string;
  type: string;
  name: string;
}) {
  try {
    // Create submission and record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the submission first
      const submission = await tx.submission.create({
        data: {
          userId: data.userId,
          examType: data.examType,
          formData: data.formData,
          submissionId: data.submissionId,
          clinicId: data.clinicId,
          doctorId: data.doctorId,
          status: "completed",
        },
      });

      // Create the record linked to the submission
      const record = await tx.record.create({
        data: {
          foreignerId: data.foreignerId,
          agency: data.agency,
          type: data.type,
          name: data.name,
          status: "Submitted",
          pending: "3/3",
          submissionId: submission.id,
        },
      });

      return { submission, record };
    });

    // Revalidate the records page to show the new record
    revalidatePath("/records/history");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating submission and record:", error);
    return { success: false, error: "Failed to create submission and record" };
  }
}
