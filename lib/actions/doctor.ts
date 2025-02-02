'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { doctorSchema } from '../validations/clinicDoctorSchemas'
import { z } from 'zod'

export async function updateDoctor(doctorId: string, data: {
  name: string
  mcr: string
}) {
  if (!doctorId) {
    console.error('No doctorId provided')
    return { success: false, error: 'No doctor ID provided' }
  }

  try {
    console.log("Updating doctor:", { doctorId, data })
    const validatedFields = doctorSchema.parse(data)
    console.log("Validated fields:", validatedFields)

    const doctor = await prisma.doctor.update({
      where: {
        id: doctorId,
      },
      data: validatedFields,
    })

    console.log("Updated doctor:", doctor)
    revalidatePath('/clinic-doctor-info')
    return { success: true, data: doctor }
  } catch (error) {
    console.error('Error updating doctor:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid doctor data', validationErrors: error.errors }
    }
    return { success: false, error: 'Failed to update doctor.' }
  }
}

export async function getDoctorList() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { success: true, data: doctors }
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return { success: false, error: 'Failed to fetch doctors.' }
  }
}
