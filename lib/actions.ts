'use server'

import { contactFormSchema, clinicSchema, doctorSchema } from '@/lib/schema'
import { z } from 'zod'

export async function contactFormAction(
  _prevState: unknown,
  formData: FormData
) {
  const defaultValues = z
    .record(z.string(), z.string())
    .parse(Object.fromEntries(formData.entries()))

  try {
    const data = contactFormSchema.parse(Object.fromEntries(formData))

    // This simulates a slow response like a form submission.
    // Replace this with your actual form submission logic.
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(data)

    return {
      defaultValues: {
        name: '',
        email: '',
        message: '',
      },
      success: true,
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(', '),
          ])
        ),
      }
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    }
  }
}

export async function clinicAction(
  _prevState: unknown,
  formData: FormData
) {
  const defaultValues = z
    .record(z.string(), z.string())
    .parse(Object.fromEntries(formData.entries()))

  try {
    const data = clinicSchema.parse(Object.fromEntries(formData))

    // This simulates a slow response like a form submission.
    // Replace this with your actual form submission logic.
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(data)

    return {
      defaultValues: {
        name: '',
        hcCode: '',
        contactNumber: '',
        address: '',
      },
      success: true,
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(', '),
          ])
        ),
      }
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    }
  }
}

export async function doctorAction(
  _prevState: unknown,
  formData: FormData
) {
  const defaultValues = z
    .record(z.string(), z.string())
    .parse(Object.fromEntries(formData.entries()))

  try {
    const data = doctorSchema.parse(Object.fromEntries(formData))

    // This simulates a slow response like a form submission.
    // Replace this with your actual form submission logic.
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(data)

    return {
      defaultValues: {
        name: '',
        mcr: '',
        specialization: '',
      },
      success: true,
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(', '),
          ])
        ),
      }
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    }
  }
}

export async function clinicDetailsAction(
  _prevState: unknown,
  formData: FormData
) {
  const defaultValues = z
    .record(z.string(), z.string())
    .parse(Object.fromEntries(formData.entries()))

  try {
    const data = clinicSchema.parse(Object.fromEntries(formData))

    // This simulates a slow response like a form submission.
    // Replace this with your actual form submission logic.
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(data)

    return {
      defaultValues: {
        hcCode: '',
        contactNumber: '',
      },
      success: true,
      errors: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        defaultValues,
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(', '),
          ])
        ),
      }
    }

    return {
      defaultValues,
      success: false,
      errors: null,
    }
  }
}

