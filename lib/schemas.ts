import { z } from "zod";

export const clinicDoctorSchema = z.object({
  clinic: z.string().min(1, "Please select a clinic"),
  doctor: z.string().min(1, "Please select a doctor"),
});

export const helperDetailsSchema = z.object({
  // fin: z.string().regex(/^[FMG]\d{7}[A-Z]$/, "Please enter a valid FIN"),
  fin: z.string().refine((val) => validateNRIC(val), "Please enter a valid FIN"),
  helperName: z.string().min(1, "Helper name is required"),
  visitDate: z.date({
    required_error: "Please select a visit date",
    invalid_type_error: "That's not a valid date",
  })
});

function validateNRIC(str: string) {
  if (str.length !== 9) 
      return false;

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

  const offset = (icArray[0] === "T" || icArray[0] === "G") ? 4 : 0;
  const temp = (offset + weight) % 11;

  const st = ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
  const fg = ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"];

  let theAlpha: string | undefined;
  if (icArray[0] === "S" || icArray[0] === "T") { 
      theAlpha = st[temp]; 
  } else if (icArray[0] === "F" || icArray[0] === "G") { 
      theAlpha = fg[temp]; 
  }

  return (icArray[8] === theAlpha);
}

export const examinationDetailsMDWSchema = z.object({
  weight: z.union([
    z.string().refine((val) => val === '', { message: "Weight is required" }),
    z.number().min(15, "Please input a valid weight").max(200, "Please input a valid weight"),
    z.null()
  ]),
  height: z.number().min(90, "Height must be at least 90cm").max(250, "Height must be at most 250cm"),
  bmi: z.number().nullable(),
  positiveTests: z.array(z.string()),
  suspiciousInjuries: z.boolean(),
  unintentionalWeightLoss: z.boolean(),
  policeReport: z.enum(["yes", "no"]).nullable(),
  remarks: z.string().max(500, "Remarks must be at most 500 characters"),
});

export const examinationDetailsMWSchema = z.object({
  positiveTests: z.array(z.string()),
  remarks: z.string().max(500, "Remarks must be at most 500 characters"),
});

export const medicalHistoryItemsSchema = z.array(z.string());

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

// export type HistoryItem = {
//   condition: string
//   hasCondition: boolean
//   details: string
// }

export const medicalHistoryItemSchema = z.object({
  condition: z.string(),
  hasCondition: z.boolean(),
  details: z.string()
})

export const medicalHistorySchema = z.array(medicalHistoryItemSchema)

export const formSchemaWP = z.object({
  clinicDoctor: clinicDoctorSchema,
  helperDetails: helperDetailsSchema,
  medicalHistory: medicalHistorySchema,
  examinationDetails: examinationDetailsMWSchema,
});

export type FormDataWP = z.infer<typeof formSchemaWP>;

