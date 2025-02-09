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
  // Validate required fields
  if (!data?.userId) {
    return { success: false, error: "User ID is required" };
  }
  if (!data?.examType) {
    return { success: false, error: "Exam type is required" };
  }
  if (!data?.formData) {
    return { success: false, error: "Form data is required" };
  }
  if (!data?.submissionId) {
    return { success: false, error: "Submission ID is required" };
  }
  if (!data?.foreignerId) {
    return { success: false, error: "FIN/WP number is required" };
  }
  if (!data?.agency) {
    return { success: false, error: "Agency is required" };
  }
  if (!data?.type) {
    return { success: false, error: "Type is required" };
  }
  if (!data?.name) {
    return { success: false, error: "Name is required" };
  }

  try {
    // Create submission and record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find existing draft for this user, exam type, and FIN
      const existingDraft = await tx.draftSubmission.findFirst({
        where: {
          userId: data.userId,
          examType: data.examType,
          foreignerId: data.foreignerId,
        },
      });

      console.log("Existing draft:", existingDraft);
      console.log("Data:", data);

      if (existingDraft) {
        // Delete the record associated with the draft
        await tx.record.deleteMany({
          where: {
            draftSubmissionId: existingDraft.id,
          },
        });

        // Delete the draft itself
        await tx.draftSubmission.delete({
          where: {
            id: existingDraft.id,
          },
        });
      }

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

      console.log("Submission:", submission);

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

      console.log("Record:", record);

      return { submission, record };
    });

    // Revalidate the records page to show the new record
    revalidatePath("/records/history");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating submission and record:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create submission and record";
    return { success: false, error: errorMessage };
  }
}
