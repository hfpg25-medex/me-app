import { z } from 'zod'

export const submissionSchema = z.object({
  type: z.enum(['FMW', 'MDW', 'FME', 'PR']),
  data: z.object({
    clinicId: z.string().optional(),
    doctorId: z.string().optional(),
    helperDetails: z.object({
      helperName: z.string().min(1, 'Helper name is required'),
      fin: z.string().min(1, 'FIN is required'),
      dateOfBirth: z.string().min(1, 'Date of birth is required'),
      nationality: z.string().min(1, 'Nationality is required'),
      passportNumber: z.string().min(1, 'Passport number is required'),
    }),
    examinationDetails: z.object({
      visitDate: z.string().min(1, 'Visit date is required'),
      // Add other examination fields based on your form schema
    }),
  }),
  draftId: z.string().optional(),
  createdAt: z.string().optional(),
  status: z.enum(['completed', 'pending']).default('completed'),
})

export type SubmissionRequest = z.infer<typeof submissionSchema>
