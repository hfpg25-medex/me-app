"use client";

import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { SectionHeader } from "./ui/section-header";
import { StepIndicator } from "./ui/step-indicator";

interface SummaryProps {
  type: "MDW" | "FMW" | "PR";
  isSubmitting?: boolean;
  showTitle?: boolean;
  showStepIndicator?: boolean;
  allowEdit?: boolean;
  showDeclaration?: boolean;
  allowSubmit?: boolean;
  clinicDetails?: {
    clinic: string;
    doctor: string;
    hciCode: string;
    contactNumber: string;
    mcrNumber: string;
  };
  helperDetails: {
    fin: string;
    helperName: string;
    visitDate: Date | null;
  };
  examinationDetails: {
    weight?: string;
    height?: string;
    bmi?: number | null;
    positiveTests: string[];
    testResults?: Array<{
      name: string;
      result: string;
    }>;
    suspiciousInjuries?: boolean;
    unintentionalWeightLoss?: boolean;
    policeReport?: string | null;
    remarks: string;
  };
  onEdit: (
    section: "clinic-doctor" | "helper-details" | "examination-details"
  ) => void;
  onSubmit: () => void;
}

const TITLES = {
  MDW: "Six-monthly Medical Examination for Migrant Domestic Worker (MOM)",
  FMW: "Six-monthly Medical Examination for Female Migrant Worker (MOM)",
  PR: "Medical Examination for PR Application (ICA)",
};

const HELPER_SECTION_TITLES = {
  MDW: "Helper details",
  FMW: "Migrant worker details",
  PR: "Personal details",
};

export function Summary({
  type,
  clinicDetails,
  helperDetails,
  examinationDetails,
  onEdit,
  onSubmit,
  isSubmitting = false,
  showTitle = true,
  showStepIndicator = true,
  allowEdit = true,
  showDeclaration = true,
  allowSubmit = true,
}: SummaryProps) {
  const [declarationChecked, setDeclarationChecked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto space-y-6">
      {showTitle && (
        <h1 className="text-2xl font-semibold mb-6">{TITLES[type]}</h1>
      )}

      {showStepIndicator && (
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
      )}

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {/* Personal Details Section */}
          <Card className="p-4 shadow-md hover:shadow-lg transition-shadow rounded-md">
            <SectionHeader
              title={HELPER_SECTION_TITLES[type]}
              onEdit={() => onEdit("helper-details")}
              allowEdit={allowEdit}
            />
            <div className="grid gap-3 text-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm">FIN</div>
                  <div>{helperDetails.fin}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Name</div>
                  <div>{helperDetails.helperName}</div>
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
                  <div>{TITLES[type]}</div>
                </div> */}
              </div>
            </div>
          </Card>

          {/* Examination Details Section */}
          <Card className="p-4 shadow-md hover:shadow-lg transition-shadow rounded-md">
            <SectionHeader
              title="Examination details"
              onEdit={() => onEdit("examination-details")}
              allowEdit={allowEdit}
            />
            <div className="space-y-3 text-md">
              {/* Physical Measurements (MDW only) */}
              {type === "MDW" && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Weight</div>
                    <div>{examinationDetails.weight} kg</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Height</div>
                    <div>{examinationDetails.height} cm</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">BMI</div>
                    <div>{examinationDetails.bmi}</div>
                  </div>
                </div>
              )}

              {/* Test Results */}
              {(examinationDetails?.testResults?.length ?? 0 > 0) ? (
                <div className="space-y-2">
                  {examinationDetails &&
                    examinationDetails.testResults &&
                    examinationDetails.testResults.length > 0 &&
                    examinationDetails.testResults.map((test) => (
                      <div key={test.name}>
                        <div className="text-sm text-gray-500">{test.name}</div>
                        <p
                          className={cn(
                            "text-md",
                            test.result === "Positive/Reactive" &&
                              "text-red-500"
                          )}
                        >
                          {test.result}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p>No test results available.</p>
              )}

              {/* MDW-specific fields */}
              {type === "MDW" && (
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">
                      Signs of suspicious or unexplained injuries
                    </div>
                    <p
                      className={cn(
                        "text-md",
                        examinationDetails.suspiciousInjuries && "text-red-500"
                      )}
                    >
                      {examinationDetails.suspiciousInjuries ? "Yes" : "No"}
                    </p>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">
                      Unintentional weight loss
                    </div>
                    <p
                      className={cn(
                        "text-md",
                        examinationDetails.unintentionalWeightLoss &&
                          "text-red-500"
                      )}
                    >
                      {examinationDetails.unintentionalWeightLoss
                        ? "Yes"
                        : "No"}
                    </p>
                  </div>

                  {(examinationDetails.suspiciousInjuries ||
                    examinationDetails.unintentionalWeightLoss) && (
                    <div>
                      <div className="text-sm text-gray-500">
                        Has a police report been made?
                      </div>
                      <p className="text-md">
                        {examinationDetails.policeReport === "yes"
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Remarks */}
              <div>
                <div className="text-sm text-gray-500">Remarks</div>
                <p className="whitespace-pre-wrap text-md">
                  {examinationDetails.remarks || "-"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4 shadow-md hover:shadow-lg transition-shadow rounded-md">
            <SectionHeader
              title="Clinic & doctor details"
              onEdit={() => onEdit("clinic-doctor")}
              allowEdit={allowEdit}
            />

            {/* Clinic Details Section */}
            <div>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-500 text-sm">Clinic name</div>
                  <div>{clinicDetails?.clinic}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">HCI code</div>
                  <div>{clinicDetails?.hciCode}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Contact number</div>
                  <div>{clinicDetails?.contactNumber}</div>
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <div>
                  <div className="text-gray-500 text-sm">Doctor name</div>
                  <div className="flex items-center gap-2">
                    <span>{clinicDetails?.doctor}</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">
                    Medical Registration (MCR) no.
                  </div>
                  <div>{clinicDetails?.mcrNumber}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Declaration Section */}
      {showDeclaration && (
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <Card className="bg-blue-50 p-4 text-sm border-2 border-blue-100 shadow-md hover:shadow-lg transition-shadow rounded-md">
            <SectionHeader title="Declaration" />
            <p className="mb-4">Please read and acknowledge the following:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
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
      {allowSubmit && (
        <div className="flex justify-start mt-4">
          <Button
            onClick={onSubmit}
            disabled={!declarationChecked || isSubmitting}
            className="relative min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">Submit</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              </>
            ) : (
              "Submit"
            )}
          </Button>
          <LoadingOverlay isLoading={isSubmitting} message="Processing..." />
        </div>
      )}
    </div>
  );
}
