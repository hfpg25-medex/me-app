"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { clinicSchema } from "../validations/clinicDoctorSchemas";

export async function updateClinic(
  clinicId: string,
  data: {
    name: string;
    hci: string;
    contactNumber: string;
    address: string;
  }
) {
  if (!clinicId) {
    console.error("No clinicId provided");
    return { success: false, error: "No clinic ID provided" };
  }

  try {
    console.log("Updating clinic:", { clinicId, data });
    const validatedFields = clinicSchema.parse(data);
    console.log("Validated fields:", validatedFields);

    const clinic = await prisma.clinic.update({
      where: {
        id: clinicId,
      },
      data: validatedFields,
    });

    console.log("Updated clinic:", clinic);
    revalidatePath("/clinic-doctor-info");
    return { success: true, data: clinic };
  } catch (error) {
    console.error("Error updating clinic:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid clinic data",
        validationErrors: error.errors,
      };
    }
    return { success: false, error: "Failed to update clinic." };
  }
}

export async function getClinicList() {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: clinics };
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return { success: false, error: "Failed to fetch clinics." };
  }
}
