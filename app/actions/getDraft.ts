"use server";

import { prisma } from "@/lib/prisma";

export async function getDraft(draftSubmissionId: string) {
  try {
    const draft = await prisma.draftSubmission.findUnique({
      where: {
        id: draftSubmissionId,
      },
    });

    if (!draft) {
      return { success: false, error: "Draft not found" };
    }

    return {
      success: true,
      data: draft.formData as any,
    };
  } catch (error) {
    console.error("Error fetching draft:", error);
    return { success: false, error: "Failed to fetch draft" };
  }
}
