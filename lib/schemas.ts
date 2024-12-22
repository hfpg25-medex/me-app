import { z } from "zod";

export const clinicDoctorSchema = z.object({
  clinic: z.string().min(1, "Please select a clinic"),
  doctor: z.string().min(1, "Please select a doctor"),
});

export const helperDetailsSchema = z.object({
  fin: z.string().regex(/^[FMG]\d{7}[A-Z]$/, "Please enter a valid FIN"),
  helperName: z.string().min(1, "Helper name is required"),
  visitDate: z.date({
    required_error: "Please select a visit date",
    invalid_type_error: "That's not a valid date",
  }),
});

export const examinationDetailsSchema = z.object({
  weight: z.number().min(15, "Weight must be at least 15kg").max(200, "Weight must be at most 200kg"),
  height: z.number().min(90, "Height must be at least 90cm").max(250, "Height must be at most 250cm"),
  bmi: z.number().nullable(),
  positiveTests: z.array(z.string()),
  suspiciousInjuries: z.boolean(),
  unintentionalWeightLoss: z.boolean(),
  policeReport: z.enum(["yes", "no"]).nullable(),
  remarks: z.string().max(500, "Remarks must be at most 500 characters"),
});

export const formSchema = z.object({
  clinicDoctor: clinicDoctorSchema,
  helperDetails: helperDetailsSchema,
  examinationDetails: examinationDetailsSchema,
});

export type FormData = z.infer<typeof formSchema>;

