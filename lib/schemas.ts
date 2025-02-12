import { z } from "zod";

export const clinicDoctorSchema = z.object({
  clinic: z.string().min(1, "Please select a clinic"),
  doctor: z.string().min(1, "Please select a doctor"),
});

export const helperDetailsSchema = z.object({
  fin: z
    .string()
    .refine((val) => validateNRIC(val), "Please enter a valid FIN"),
  helperName: z.string().min(1, "Person name is required"),
  visitDate: z.date({
    required_error: "Please select a visit date",
    invalid_type_error: "That's not a valid date",
  }),
});

export function validateNRIC(str: string) {
  if (str.length !== 9) return false;

  str = str.toUpperCase();

  const icArray: (string | number)[] = [];
  for (let i = 0; i < 9; i++) {
    icArray[i] = str.charAt(i);
  }

  icArray[1] = parseInt(icArray[1] as string, 10) * 2;
  icArray[2] = parseInt(icArray[2] as string, 10) * 7;
  icArray[3] = parseInt(icArray[3] as string, 10) * 6;
  icArray[4] = parseInt(icArray[4] as string, 10) * 5;
  icArray[5] = parseInt(icArray[5] as string, 10) * 4;
  icArray[6] = parseInt(icArray[6] as string, 10) * 3;
  icArray[7] = parseInt(icArray[7] as string, 10) * 2;

  let weight = 0;
  for (let i = 1; i < 8; i++) {
    weight += icArray[i] as number;
  }

  const offset = icArray[0] === "T" || icArray[0] === "G" ? 4 : 0;
  const temp = (offset + weight) % 11;

  const st = ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
  const fg = ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"];

  let theAlpha: string | undefined;
  if (icArray[0] === "S" || icArray[0] === "T") {
    theAlpha = st[temp];
  } else if (icArray[0] === "F" || icArray[0] === "G") {
    theAlpha = fg[temp];
  }

  return icArray[8] === theAlpha;
}

export const examinationDetailsMDWSchema = z.object({
  weight: z
    .number({
      required_error: "Please provide weight.",
      invalid_type_error: "Please input a valid weight",
    })
    .min(15, "Please input a valid weight")
    .max(200, "Please input a valid weight")
    .optional()
    .refine((val) => val === undefined || (val >= 15 && val <= 200), {
      message: "Please input a valid weight",
    }),
  height: z
    .string()
    .refine((val) => val !== "", {
      message: "Please provide height.",
    })
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 90 && num <= 250;
      },
      {
        message: "Please input a valid height",
      }
    )
    .transform((val) => Number(val)),
  bmi: z.number(),
  testTypes: z.array(z.string()),
  positiveTests: z.array(z.string()),
  suspiciousInjuries: z.boolean(),
  unintentionalWeightLoss: z.boolean(),
  policeReport: z.enum(["yes", "no"]).nullable(),
  remarks: z
    .string()
    .max(500, "Remarks must be at most 500 characters")
    .refine((val) => val === "" || val.trim().length > 0, {
      message: "Please enter your remarks",
    }),
});

export const clinicalExaminationSchema = z.object({
  weight: z
    .number()
    .min(15, "Please input a valid weight")
    .max(200, "Please input a valid weight"),
  height: z
    .number()
    .min(90, "Please input a valid height")
    .max(250, "Please input a valid height"),
  bmi: z.number(),
  waistCircumference: z
    .number()
    .min(5, "Please input a valid waist circumference")
    .max(200, "Please input a valid waist circumference"),
  waistUnit: z.enum(["cm", "inch"]).default("cm"),
  systolicBP: z
    .number()
    .min(30, "Please input a valid systolic BP")
    .max(300, "Please input a valid systolic BP"),
  diastolicBP: z
    .number()
    .min(10, "Please input a valid diastolic BP")
    .max(300, "Please input a valid diastolic BP"),
  rightEyeVision: z.string({ required_error: "Right eye vision is required" }),
  leftEyeVision: z.string({ required_error: "Left eye vision is required" }),
  colorVision: z.string().default("normal"),
  hearing: z.string().default("normal"),
  cardiovascularSystem: z.string().default("normal"),
  ecg: z.string().default("normal"),
  anaemia: z.string().default("normal"),
  respiratorySystem: z.string().default("normal"),
  gastroIntestinalSystem: z.string().default("normal"),
  neurologicalSystem: z.string().default("normal"),
  skin: z.string().default("normal"),
  musculoskeletalSystem: z.string().default("normal"),
  neck: z.string().default("normal"),
  genitourinarySystem: z.string().default("normal"),
  mentalHealth: z.string().default("normal"),
  others: z.string().nullable(),
});

export const testsSchema = z.object({
  radiological: z.object({
    result: z.string(),
    details: z.string().nullable(),
  }),
  urineAlbumin: z.string().default("normal"),
  urineGlucose: z.string().default("normal"),
  pregnancyTest: z.string().default("negative"),
  syphilis: z.string(),
  malaria: z.string(),
  hiv: z.string(),
  hba1c: z.string().nullable(),
  lipids: z.string().nullable(),
});

export const examinationDetailsMWSchema = z.object({
  testTypes: z.array(z.string()),
  positiveTests: z.array(z.string()),
  remarks: z
    .string()
    .max(500, "Remarks must be at most 500 characters")
    .refine((val) => val === "" || val.trim().length > 0, {
      message: "Please enter your remarks",
    }),
});

export const formSchemaMDW = z.object({
  clinicDoctor: clinicDoctorSchema,
  helperDetails: helperDetailsSchema,
  examinationDetails: examinationDetailsMDWSchema,
});

export type FormDataMDW = z.infer<typeof formSchemaMDW>;

export const formSchemaMW = z.object({
  clinicDoctor: clinicDoctorSchema,
  helperDetails: helperDetailsSchema,
  examinationDetails: examinationDetailsMWSchema,
});

export type FormDataMW = z.infer<typeof formSchemaMW>;

export const formSchemaPR = z.object({
  clinicDoctor: clinicDoctorSchema,
  helperDetails: helperDetailsSchema,
  examinationDetails: examinationDetailsMWSchema,
});

export type FormDataPR = z.infer<typeof formSchemaPR>;

export const medicalHistoryItemSchema = z.object({
  condition: z.string(),
  hasCondition: z.boolean(),
  details: z.string().optional(),
});

export type MedicalHistoryItem = z.infer<typeof medicalHistoryItemSchema>;

export const medicalHistorySchema = z.array(medicalHistoryItemSchema);

export const formSchemaWP = z.object({
  clinicDoctor: clinicDoctorSchema,
  helperDetails: helperDetailsSchema,
  medicalHistory: medicalHistorySchema,
  clinicalExamination: clinicalExaminationSchema,
  tests: testsSchema,
  fitnessAssessment: z.string(),
});

export type FormDataWP = z.infer<typeof formSchemaWP>;
