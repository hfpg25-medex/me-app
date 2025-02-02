'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { clinicSchema } from '../validations/clinicDoctorSchemas'

export async function updateClinic(clinicId: string, data: {
  name: string
  hci: string
  contactNumber: string
  address: string
}) {
  try {
    const validatedFields = clinicSchema.parse(data)

    const clinic = await prisma.clinic.update({
      where: {
        id: clinicId,
      },
      data: validatedFields,
    })

    revalidatePath('/clinic-doctor-info')
    return { success: true, data: clinic }
  } catch (error) {
    return { success: false, error: 'Failed to update clinic.' }
  }
}

export async function getClinicList() {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { success: true, data: clinics }
  } catch (error) {
    return { success: false, error: 'Failed to fetch clinics.' }
  }
}
