import { z } from 'zod'

export const clinicSchema = z.object({
  hci: z
    .string()
    .regex(/^[a-zA-Z0-9]{7}$/, { message: 'You must enter a valid HCI Code' }),
  contactNumber: z
    .string()
    .regex(/^[689]\d{7}$/, { message: 'You must enter a valid contact number.' }),
  name: z
    .string()
    .min(2, { message: 'Clinic name must be at least 2 characters' })
    .max(100, { message: 'Clinic name must be at most 100 characters' }),
  address: z
    .string()
    .min(5, { message: 'Address must be at least 5 characters' })
    .max(200, { message: 'Address must be at most 200 characters' }),
})

export const doctorSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be at most 100 characters' }),
  mcr: z
    .string()
    .regex(/^M\d{5}[A-Z]$/, { message: 'You must enter a valid MCR number.' }),
})

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(32, { message: 'Name must be at most 32 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  message: z
    .string()
    .min(2, { message: 'Message must be at least 2 characters' })
    .max(1000, { message: 'Message must be at most 1000 characters' }),
})
