import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { submissionSchema } from '@/lib/validations/submission'
import { APIError, handleAPIError } from '@/lib/exceptions'
import { ZodError } from 'zod'
import { logInfo, logError, logWarning } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logWarning('Unauthorized access attempt', {
        action: 'submission_create',
        path: request.url
      })
      throw new APIError('Unauthorized', 401, 'UNAUTHORIZED')
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = submissionSchema.parse(body)
    
    logInfo('Received submission request', {
      userId: session.user.id,
      examType: validatedData.type,
      action: 'submission_create'
    })
    
    // Check if clinic exists if clinicId is provided
    if (validatedData.data.clinicId) {
      const clinic = await prisma.clinic.findUnique({
        where: { id: validatedData.data.clinicId }
      })
      if (!clinic) {
        logWarning('Clinic not found', {
          userId: session.user.id,
          clinicId: validatedData.data.clinicId,
          action: 'submission_create'
        })
        throw new APIError('Clinic not found', 404, 'CLINIC_NOT_FOUND')
      }
    }

    // Check if doctor exists if doctorId is provided
    if (validatedData.data.doctorId) {
      const doctor = await prisma.doctor.findUnique({
        where: { id: validatedData.data.doctorId }
      })
      if (!doctor) {
        logWarning('Doctor not found', {
          userId: session.user.id,
          doctorId: validatedData.data.doctorId,
          action: 'submission_create'
        })
        throw new APIError('Doctor not found', 404, 'DOCTOR_NOT_FOUND')
      }
    }

    // Generate a unique submission ID (format: ME + timestamp + random string)
    const submissionId = `ME${Date.now()}${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    // Save the submission to the database
    const submission = await prisma.$transaction(async (tx) => {
      // Create the submission
      const newSubmission = await tx.submission.create({
        data: {
          userId: session.user.id,
          examType: validatedData.type,
          formData: validatedData.data,
          submissionId,
          clinicId: validatedData.data.clinicId,
          doctorId: validatedData.data.doctorId,
          status: validatedData.status
        }
      })

      // Delete any existing draft if draftId is provided
      if (validatedData.draftId) {
        await tx.draftSubmission.deleteMany({
          where: { 
            id: validatedData.draftId,
            userId: session.user.id // Extra safety check
          }
        })
        logInfo('Deleted draft submission', {
          userId: session.user.id,
          draftId: validatedData.draftId,
          action: 'submission_create'
        })
      }

      return newSubmission
    })

    logInfo('Submission created successfully', {
      userId: session.user.id,
      submissionId: submission.submissionId,
      examType: validatedData.type,
      action: 'submission_create'
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Submission saved successfully',
      submissionId: submission.submissionId 
    })
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      logWarning('Validation error in submission', {
        errors: error.errors,
        action: 'submission_create'
      })
      return NextResponse.json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Invalid submission data',
        errors: error.errors
      }, { status: 400 })
    }

    // Log the error
    logError(error, {
      action: 'submission_create',
      component: 'submission_api'
    })

    // Handle other API errors
    return handleAPIError(error)
  }
}
