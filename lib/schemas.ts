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

function validateNRIC(str:String) {
  if (str.length != 9) 
      return false;

  str = str.toUpperCase();

  var i, 
      icArray = [];
  for(i = 0; i < 9; i++) {
      icArray[i] = str.charAt(i);
  }

  icArray[1] = parseInt(icArray[1], 10) * 2;
  icArray[2] = parseInt(icArray[2], 10) * 7;
  icArray[3] = parseInt(icArray[3], 10) * 6;
  icArray[4] = parseInt(icArray[4], 10) * 5;
  icArray[5] = parseInt(icArray[5], 10) * 4;
  icArray[6] = parseInt(icArray[6], 10) * 3;
  icArray[7] = parseInt(icArray[7], 10) * 2;

  var weight = 0;
  for(i = 1; i < 8; i++) {
      weight += icArray[i];
  }

  var offset = (icArray[0] == "T" || icArray[0] == "G") ? 4:0;
  var temp = (offset + weight) % 11;

  var st = ["J","Z","I","H","G","F","E","D","C","B","A"];
  var fg = ["X","W","U","T","R","Q","P","N","M","L","K"];

  var theAlpha;
  if (icArray[0] == "S" || icArray[0] == "T") { theAlpha = st[temp]; }
  else if (icArray[0] == "F" || icArray[0] == "G") { theAlpha = fg[temp]; }

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

