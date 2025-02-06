import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SectionHeader } from "@/components/ui/section-header";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { StepIndicator } from "@/components/ui/step-indicator";
import { examTitles } from "@/constants/exam-titles";
import { useAuth } from "@/lib/context/auth-context";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";

interface SummaryProps {
  clinicDetails: {
    clinic: string;
    doctor: string;
    hciCode: string;
    contactNumber: string;
    mcrNumber: string;
  };
  helperDetails: {
    fin: string;
    name: string;
    visitDate: Date;
  };
  medicalHistory: Array<{
    condition: string;
    hasCondition: boolean;
    details?: string | null;
  }>;
  clinicalExamination: {
    weight: number;
    height: number;
    bmi: number;
    waistCircumference: number;
    waistUnit: string;
    systolicBP: number;
    diastolicBP: number;
    rightEyeVision: string;
    leftEyeVision: string;
    urineAlbumin: string;
    urineGlucose: string;
    pregnancyTest: string;
    colorVision: string;
    hearing: string;
  };
  tests: {
    radiological: { result: string; details: string | null };
    syphilis: string;
    malaria: string;
    hiv: string;
    hba1c?: string;
    lipids?: string;
  };
  onEdit: (
    section:
      | "clinic-doctor"
      | "helper-details"
      | "medical-history"
      | "clinical-examination"
      | "tests"
  ) => void;
  onSubmit: () => void;
}

export function MedicalSummary({
  clinicDetails,
  helperDetails,
  medicalHistory,
  clinicalExamination,
  tests,
  onEdit,
  onSubmit,
}: SummaryProps) {
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const { canEditSection, canSubmitReport } = usePermissions();
  const { user } = useAuth();
  const isNurse = user?.role === "nurse";

  //to remove
  console.log(canSubmitReport);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []); // Empty dependency array means this runs once on mount

  const handleEdit = (
    section:
      | "clinic-doctor"
      | "helper-details"
      | "medical-history"
      | "clinical-examination"
      | "tests"
  ) => {
    if (canEditSection(section)) {
      onEdit(section);
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-2xl font-semibold mb-6">{examTitles.fme}</h1>

      <StepIndicator
        className="mb-6"
        steps={[
          {
            number: 1,
            label: "Submission",
            isActive: false,
            isEnabled: true,
          },
          {
            number: 2,
            label: "Summary",
            isActive: true,
            isEnabled: true,
          },
        ]}
      />
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {/* Personal Details Section */}
          <Card className="p-4 shadow-md hover:shadow-lg transition-shadow rounded-md">
            <SectionHeader
              title="Personal details"
              onEdit={
                canEditSection("helper-details")
                  ? () => handleEdit("helper-details")
                  : undefined
              }
            />
            <div className="grid gap-3 text-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm">FIN</div>
                  <div>{helperDetails.fin}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Name</div>
                  <div>{helperDetails.name}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm">Date of visit</div>
                  <div>
                    {helperDetails.visitDate
                      ? format(helperDetails.visitDate, "dd MMM yyyy")
                      : "-"}
                  </div>
                </div>
                {/* <div>
                  <div className="text-gray-500">Medical type</div>
                  <div>{examTitles.fme}</div>
                </div> */}
              </div>
            </div>
          </Card>

          {/* Medical History Section */}
          <Card className="p-4 shadow-md hover:shadow-lg transition-shadow rounded-md">
            <SectionHeader
              title="Medical history"
              onEdit={() => handleEdit("medical-history")}
            />
            <div className="space-y-3 text-md">
              {medicalHistory.map((item) => (
                <div key={item.condition} className="space-y-1">
                  <div className="flex items-start align-middle justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm align-middle text-gray-500">
                        {item.condition}
                      </div>
                      {item.hasCondition && item.details && (
                        <div className="mt-1">{item.details}</div>
                      )}
                    </div>
                    <div
                      className={`w-12 text-right ${
                        item.hasCondition ? "text-red-500 font-medium" : ""
                      }`}
                    >
                      {item.hasCondition ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Clinical Examination Section */}
          <Card className="p-4 shadow-md hover:shadow-lg transition-shadow rounded-md">
            <SectionHeader
              title="Clinical examination"
              onEdit={
                canEditSection("clinical-examination")
                  ? () => handleEdit("clinical-examination")
                  : undefined
              }
            />
            <div className="space-y-3 text-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm">Weight</div>
                  <div>{clinicalExamination.weight} kg</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Height</div>
                  <div>{clinicalExamination.height} cm</div>
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">BMI</div>
                <div>
                  {clinicalExamination.bmi && clinicalExamination.bmi > 0
                    ? clinicalExamination.bmi.toFixed(2)
                    : "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Waist Circumference</div>
                <div>
                  {clinicalExamination.waistCircumference}{" "}
                  {clinicalExamination.waistUnit}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm">Systolic BP</div>
                  <div>{clinicalExamination.systolicBP} mmHg</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Diastolic BP</div>
                  <div>{clinicalExamination.diastolicBP} mmHg</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm">Right Eye Vision</div>
                  <div>{clinicalExamination.rightEyeVision}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Left Eye Vision</div>
                  <div>{clinicalExamination.leftEyeVision}</div>
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Urine Albumin</div>
                <div
                  className={
                    clinicalExamination.urineAlbumin === "abnormal"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {clinicalExamination.urineAlbumin === "abnormal"
                    ? "Abnormal"
                    : "Normal"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Urine Glucose</div>
                <div
                  className={
                    clinicalExamination.urineGlucose === "abnormal"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {clinicalExamination.urineGlucose === "abnormal"
                    ? "Abnormal"
                    : "Normal"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Pregnancy Test</div>
                <div
                  className={
                    clinicalExamination.pregnancyTest === "positive"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {clinicalExamination.pregnancyTest === "positive"
                    ? "Positive"
                    : "Negative"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Color Vision</div>
                <div
                  className={
                    clinicalExamination.colorVision === "abnormal"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {clinicalExamination.colorVision === "abnormal"
                    ? "Abnormal"
                    : "Normal"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Hearing</div>
                <div
                  className={
                    clinicalExamination.hearing === "abnormal"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {clinicalExamination.hearing === "abnormal"
                    ? "Abnormal"
                    : "Normal"}
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4 shadow-md hover:shadow-lg transition-shadow rounded-md">
            <SectionHeader
              title="Tests"
              onEdit={
                canEditSection("tests") ? () => handleEdit("tests") : undefined
              }
            />
            <div className="space-y-3 text-md">
              <div>
                <div className="text-gray-500 text-sm">Radiological</div>
                <div
                  className={
                    tests.radiological.result === "abnormal"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {tests.radiological.result === "abnormal"
                    ? "Abnormal"
                    : "Normal"}
                </div>
                {tests.radiological.details && (
                  <p>{tests.radiological.details}</p>
                )}
              </div>
              <div>
                <div className="text-gray-500 text-sm">Syphilis Screen</div>
                <div
                  className={
                    tests.syphilis === "positive" ? "text-red-500" : ""
                  }
                >
                  {tests.syphilis === "positive" ? "Positive" : "Negative"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">
                  Blood film for Malaria
                </div>
                <div
                  className={tests.malaria === "positive" ? "text-red-500" : ""}
                >
                  {tests.malaria === "positive" ? "Positive" : "Negative"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">HIV screen</div>
                <div className={tests.hiv === "positive" ? "text-red-500" : ""}>
                  {tests.hiv === "positive" ? "Positive" : "Negative"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">HbA1c or Glucose</div>
                <div
                  className={tests.hba1c === "abnormal" ? "text-red-500" : ""}
                >
                  {tests.hba1c === "abnormal" ? "Abnormal" : "Normal"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Blood lipids</div>
                <div
                  className={tests.lipids === "abnormal" ? "text-red-500" : ""}
                >
                  {tests.lipids === "abnormal" ? "Abnormal" : "Normal"}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Lab Tests Section */}
          <Card className="p-4 shadow-md hover:shadow-lg transition-shadow rounded-md">
            <div className="space-y-6">
              <div>
                <StatusBadge status="pending">Pending</StatusBadge>
                <h2 className="text-lg font-semibold mt-4 mb-6">
                  Lab tests & specialists
                </h2>
                <RadioGroup defaultValue="x-ray" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="x-ray" id="x-ray" />
                    <label htmlFor="x-ray">X-Ray</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blood" id="blood" />
                    <label htmlFor="blood">Blood Test</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cardio" id="cardio" />
                    <label htmlFor="cardio">
                      Cardiologist — Heartcare Specialists
                    </label>
                  </div>
                </RadioGroup>
              </div>
              <Separator />
              {/* Clinic Details Section */}
              <div>
                <div className="flex items-center justify-between mb-4"></div>
                <div className="space-y-4">
                  <SectionHeader
                    title="Clinic & doctor details"
                    onEdit={() => handleEdit("clinic-doctor")}
                  />
                  <div>
                    <div className="text-gray-500 text-sm">Clinic name</div>
                    <div>{clinicDetails.clinic}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">HCI code</div>
                    <div>{clinicDetails.hciCode}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Contact number</div>
                    <div>{clinicDetails.contactNumber}</div>
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <div>
                    <div className="text-gray-500 text-sm">Doctor name</div>
                    <div className="flex items-center gap-2">
                      <span>{clinicDetails.doctor}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">
                      Medical Registration (MCR) no.
                    </div>
                    <div>{clinicDetails.mcrNumber}</div>
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                      <div className="flex-1">
                        <div>X-Ray results submitted</div>
                        <div className="text-gray-500">2025-01-28 10:52am</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                      <div className="flex-1">
                        <div>Clinical exam completed</div>
                        <div className="text-gray-500">2025-01-27 5:23pm</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                      <div className="flex-1">
                        <div>Clinical exam created</div>
                        <div className="text-gray-500">2025-01-27 5:11pm</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Lab Tests Table */}
          <Card className="p-4 shadow-md hover:shadow-lg transition-shadow rounded-md">
            <SectionHeader
              title="Lab tests & specialist referrals"
              onEdit={() => {}}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Date submitted</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Results</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2">2025-01-25 10:52</td>
                    <td>X-Ray</td>
                    <td>
                      <StatusBadge status="normal">Normal</StatusBadge>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">2025-01-25 10:52</td>
                    <td>Blood Test</td>
                    <td>
                      <StatusBadge status="pending">Pending</StatusBadge>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">2025-01-25 10:52</td>
                    <td>Cardiologist - Hearcare Specialists</td>
                    <td>
                      <StatusBadge status="pending">Pending</StatusBadge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Declaration Section */}
      {!isNurse && (
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <Card className="bg-blue-50 p-4 text-sm shadow-md hover:shadow-lg transition-shadow rounded-md border-2 border-blue-100">
            <SectionHeader title="Declaration" />
            <p className="mb-0">Please read and acknowledge the following:</p>
            <ul className="list-disc pl-4 mb-4">
              <li>
                I am authorised by the clinic to submit the results and make the
                declarations in this form on its behalf.
              </li>
              <li>
                By submitting this form, I understand that the information given
                will be submitted to the Controller or an authorised officer who
                may act on the information given by me. I further declare that
                the information provided by me is true to the best of my
                knowledge and belief.
              </li>
            </ul>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="declaration"
                checked={declarationChecked}
                onCheckedChange={(checked) =>
                  setDeclarationChecked(checked as boolean)
                }
              />
              <Label htmlFor="declaration">
                I declare that all of the above is true.
              </Label>
            </div>
          </Card>
        </div>
      )}
      <div className="flex justify-start mt-4">
        <Button type="button" onClick={onSubmit} disabled={!declarationChecked}>
          {isNurse ? "Submit for review" : "Submit report"}
        </Button>
      </div>
    </div>
  );
}
