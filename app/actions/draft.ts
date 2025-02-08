"use server";

import { prisma } from "@/lib/prisma";
import { FormDataWP } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function saveDraft(data: FormDataWP, userId: string) {
  console.log("saveDraft called with:", { data, userId });

  try {
    // Input validation
    if (!data) {
      console.error("No form data provided");
      return { success: false, error: "No form data provided" };
    }
    if (!data.helperDetails) {
      console.error("No helper details in form data");
      return { success: false, error: "No helper details in form data" };
    }
    if (!data.helperDetails.fin) {
      console.error("No FIN in helper details");
      return { success: false, error: "No FIN in helper details" };
    }

    // Create or update draft submission and associated record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      try {
        // Create or update draft submission
        console.log("Attempting to save draft submission...");
        const draft = await tx.draftSubmission.upsert({
          where: {
            userId_examType: {
              userId,
              examType: "FME",
            },
          },
          update: {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            formData: data as any,
            updatedAt: new Date(),
          },
          create: {
            userId,
            examType: "FME",
            /* eslint-disable @typescript-eslint/no-explicit-any */
            formData: data as any,
            status: "draft",
          },
        });

        console.log("Draft saved successfully");

        // Prepare record data
        const recordData = {
          foreignerId: data.helperDetails.fin,
          name: data.helperDetails.helperName || "",
          agency: "MOM",
          type: "Full Medical Examination for Foreign Worker",
          status: "Draft",
          pending: "-",
          draftSubmissionId: draft.id,
        };

        console.log("Attempting to save record with data...");

        // Create or update associated record
        const record = await tx.record.upsert({
          where: {
            draftSubmissionId: draft.id,
          },
          update: {
            foreignerId: data.helperDetails.fin,
            name: data.helperDetails.helperName || "",
            status: "Draft",
            agency: "MOM",
            type: "Full Medical Examination for Foreign Worker",
            pending: "-",
          },
          create: recordData,
        });

        console.log("Record saved successfully:");

        return { draft, record };
      } catch (txError) {
        console.error("Transaction error:", txError);
        throw txError; // Re-throw to be caught by outer try-catch
      }
    });

    revalidatePath("/medical-exam/fme");
    revalidatePath("/records/history");

    return {
      success: true,
      draft: result.draft,
      lastSaved: result.draft.updatedAt,
    };
  } catch (error) {
    // Log detailed error information
    console.error("Error in saveDraft:", error);
    return {
      success: false,
      error: `Failed to save draft: ${error || "Unknown error"}`,
    };
  }
}
