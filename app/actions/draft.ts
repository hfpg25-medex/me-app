"use server";

import { prisma } from "@/lib/prisma";
import { FormDataWP } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function saveDraft(data: FormDataWP, userId: string) {
  try {
    const draft = await prisma.draftSubmission.upsert({
      where: {
        userId_examType: {
          userId,
          examType: 'FME'
        }
      },
      update: {
        formData: data as any,
        updatedAt: new Date(),
      },
      create: {
        userId,
        examType: 'FME',
        formData: data as any,
        status: 'draft'
      },
    });

    revalidatePath("/medical-exam/fme");
    return { success: true, draft, lastSaved: draft.updatedAt };
  } catch (error) {
    console.error("Error saving draft:", error);
    return { success: false, error: "Failed to save draft" };
  }
}
