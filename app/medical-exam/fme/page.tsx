"use client";

import { saveDraft } from "@/app/actions/draft";
import { AcknowledgementPage } from "@/components/AcknowledgementPage";
import { FinChangeModal } from "@/components/FinChangeModal";
import { ClinicalExamination } from "@/components/medical-exam/ClinicalExamination";
import { ClinicDoctorDetails } from "@/components/medical-exam/ClinicDoctorDetails";
import { HelperDetails } from "@/components/medical-exam/HelperDetails";
import { MedicalHistory } from "@/components/medical-exam/MedicalHistory";
import { Tests } from "@/components/medical-exam/Tests";
import { MedicalSummary } from "@/components/medical-summary";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StepIndicator } from "@/components/ui/step-indicator";
import { examTitles } from "@/constants/exam-titles";
import { STEPS, StepType } from "@/constants/steps";
import { FormDataWP, formSchemaWP } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

const clinics = [
  {
    id: "1",
    name: "ABC Medical Clinic (Bukit Batok)",
    hciCode: "2M12345",
    contactNumber: "+65 69991234",
  },
  // { id: '2', name: 'Healthline 24Hr Clinic (Jurong East)', hciCode: '2M54321', contactNumber: '+65 69995678' },
];

/*
66 Bukit Batok Central #01-24, Singapore 675689
438 Jurong East #04-55, Singapore 289988
*/
const doctors = [
  { id: "1", name: "Dr. John Doe", mcrNumber: "M12345A" },
  { id: "2", name: "Dr. Sarah Chen", mcrNumber: "M67890B" },
];

import { Button } from "@/components/ui/button";
import { generateSamplePeople } from "@/lib/utils/sample-data";

// Generate sample data
const samplePerson = generateSamplePeople(1);

// Mock API call
const mockApiCall = async (fin: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const person = samplePerson.find((p) => p.fin === fin);

  if (person) {
    const dob = new Date(
      1980 + Math.floor(Math.random() * 20),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    const doe = new Date(dob.getFullYear() + 2, dob.getMonth(), dob.getDate());

    return {
      name: person.name,
      doe: doe.toISOString().split("T")[0],
      dob: dob.toISOString().split("T")[0],
      occupation: [
        "Driver",
        "Construction Worker",
        "Factory Worker",
        "Cleaner",
      ][Math.floor(Math.random() * 4)],
    };
  }
  return null;
};

export default function WPExamPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WPExamPageContent />
    </Suspense>
  );
}

function WPExamPageContent() {
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState<StepType>(STEPS.SUBMISSION);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<
    string | undefined
  >("clinic-doctor");
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId");

  // Load draft data if draftId is provided
  React.useEffect(() => {
    const loadDraft = async () => {
      if (draftId) {
        setIsLoading(true);
        setIsPendingMe(true);
        try {
          const response = await fetch(`/api/drafts/${draftId}`);
          const data = await response.json();
          if (data.success) {
            const visitDate = new Date(data.data.helperDetails.visitDate);
            data.data = {
              ...data.data,
              helperDetails: {
                ...data.data.helperDetails,
                visitDate,
              },
            };
            methods.reset(data.data);
          }
        } catch (error) {
          console.error("Error loading draft:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDraft();
    setIsClient(true);
  }, [draftId]);

  const [isHelperDetailsEnabled, setIsHelperDetailsEnabled] = useState(false);
  const [isMedicalHistoryEnabled, setIsMedicalHistoryEnabled] = useState(false);
  const [isClinicalExaminationEnabled, setIsClinicalExaminationEnabled] =
    useState(false);
  const [isTestsEnabled, setIsTestsEnabled] = useState(false);
  const [isSummaryActive, setIsSummaryActive] = useState(false);
  const [isFinChangeModalOpen, setIsFinChangeModalOpen] = useState(false);
  const [tempFin, setTempFin] = useState("");
  const [finTouched, setFinTouched] = useState(false);
  const [visitDateTouched, setVisitDateTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isPendingMe, setIsPendingMe] = useState(false);
  const [isCompletedStates, setIsCompletedStates] = useState({
    helperDetails: false,
    clinicDoctor: false,
    medicalHistory: false,
    clinicalExamination: false,
    tests: false,
  });

  const methods = useForm<FormDataWP>({
    resolver: zodResolver(formSchemaWP),
    defaultValues: {
      clinicDoctor: { clinic: "", doctor: "" },
      helperDetails: { fin: "", helperName: "", visitDate: undefined },
      medicalHistory: [],
      clinicalExamination: {
        rightEyeVision: "6/5",
        leftEyeVision: "6/5",
        weight: 0,
        height: 0,
        bmi: 0,
        waistCircumference: 0,
        systolicBP: 0,
        diastolicBP: 0,
        colorVision: "normal",
        hearing: "normal",
        cardiovascularSystem: "normal",
        ecg: "normal",
        anaemia: "normal",
        respiratorySystem: "normal",
        gastroIntestinalSystem: "normal",
        neurologicalSystem: "normal",
        skin: "normal",
        musculoskeletalSystem: "normal",
        neck: "normal",
        genitourinarySystem: "normal",
        mentalHealth: "normal",
        others: null,
      },
      tests: {
        radiological: { result: "negative", details: null },
        syphilis: "negative",
        malaria: "negative",
        hiv: "negative",
        hba1c: "normal",
        lipids: "normal",
        urineAlbumin: "normal",
        urineGlucose: "normal",
        pregnancyTest: "negative",
      },
    },
  });

  const { watch, handleSubmit, trigger, setValue } = methods;

  const watchedValues = watch();

  // Auto-save effect
  const formValues = useWatch({ control: methods.control });

  useEffect(() => {
    const autoSave = async () => {
      // TODO: Replace with actual user ID from your auth system
      const userId = "user123";

      // Only attempt to save if we have the minimum required data
      if (
        !formValues?.helperDetails?.fin ||
        !isMedicalHistoryEnabled ||
        isSubmitted ||
        isSaving
      ) {
        return;
      }

      try {
        setIsSaving(true);
        const result = await saveDraft(formValues as FormDataWP, userId);
        if (result.success && result.lastSaved) {
          setLastSaved(new Date(result.lastSaved));
        } else if (!result.success) {
          console.error("Failed to auto-save:", result.error);
        }
      } catch (error) {
        console.error("Error auto-saving:", error);
      } finally {
        setIsSaving(false);
      }
    };

    const timeoutId = setTimeout(autoSave, 20000);
    return () => clearTimeout(timeoutId);
  }, [formValues, isMedicalHistoryEnabled, isSubmitted, isSaving]);

  const handleFinChange = async (value: string) => {
    if (isSummaryActive && value !== watchedValues.helperDetails.fin) {
      setTempFin(value);
      setIsFinChangeModalOpen(true);
    } else {
      setValue("helperDetails.fin", value);
      setFinTouched(false); // Reset the touched state
      await validateAndFetchHelperDetails(value);
    }
  };

  const validateAndFetchHelperDetails = async (fin: string) => {
    if (draftId?.length) {
      setIsPendingMe(true);
      return;
    }
    // Set initial state before API call
    setIsLoading(true);
    setIsPendingMe(true);
    setValue("helperDetails.helperName", "");

    try {
      const result = await mockApiCall(fin);
      if (result) {
        setValue("helperDetails.helperName", result.name);
        // Keep isPendingMe true if we found a result
      } else {
        setIsPendingMe(false);
      }
    } catch (error) {
      console.error("Error fetching helper details:", error);
      setIsPendingMe(false);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmFinChange = async () => {
    setValue("helperDetails.fin", tempFin);
    setIsFinChangeModalOpen(false);
    await validateAndFetchHelperDetails(tempFin);
  };

  const formatDate = (date: Date) => {
    return (
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " " +
      date
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase()
    );
  };

  const handleManualSave = async () => {
    if (!formValues.helperDetails?.fin || isSubmitted) {
      return;
    }

    try {
      setIsSaving(true);
      const result = await saveDraft(formValues as FormDataWP, "user123");
      if (result.success && result.lastSaved) {
        setLastSaved(new Date(result.lastSaved));
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinue = async (nextStep: string) => {
    let isValid = false;

    switch (nextStep) {
      case "helper-details":
        isValid = await trigger("clinicDoctor");
        console.log(watchedValues);
        console.log("isValid1=", isValid);
        if (isValid) {
          setIsHelperDetailsEnabled(true);
          setExpandedAccordion("helper-details");
          setIsCompletedStates((prev) => ({
            ...prev,
            clinicDoctor: isValid,
          }));
        }
        break;
      case "medical-history":
        isValid = await trigger("helperDetails");
        console.log(watchedValues);
        console.log("isValid2=", isValid);

        if (isValid) {
          setIsMedicalHistoryEnabled(true);
          setExpandedAccordion("medical-history");
          setIsCompletedStates((prev) => ({
            ...prev,
            helperDetails: isValid,
          }));
        }
        break;
      case "clinical-examination":
        isValid = await trigger("medicalHistory");
        console.log(watchedValues);
        console.log("isValid6=", isValid);
        if (isValid) {
          setIsClinicalExaminationEnabled(true);
          setExpandedAccordion("clinical-examination");
          setIsCompletedStates((prev) => ({
            ...prev,
            medicalHistory: isValid,
          }));
        }
        break;
      case "tests":
        console.log(watchedValues);
        isValid = await trigger("clinicalExamination");
        console.log(
          "Clinical Examination Errors:",
          methods.formState.errors.clinicalExamination
        );
        console.log("isValid7=", isValid);
        if (isValid) {
          setIsTestsEnabled(true);
          setExpandedAccordion("tests");
          console.log("isTestsEnabled", isTestsEnabled);
          setIsCompletedStates((prev) => ({
            ...prev,
            clinicalExamination: isValid,
          }));
        }
        break;
      case "summary":
        isValid = await trigger("tests");
        console.log(watchedValues);

        if (isValid) {
          setIsCompletedStates((prev) => ({
            ...prev,
            tests: isValid,
          }));
          setIsSummaryActive(true);
          setStep(STEPS.SUMMARY);
        }
        break;
    }
  };

  const handleEdit = (
    section:
      | "clinic-doctor"
      | "helper-details"
      | "medical-history"
      | "clinical-examination"
      | "tests"
  ) => {
    setStep(STEPS.SUBMISSION);
    setExpandedAccordion(section);
  };

  const onSubmit = async (data: FormDataWP) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted!", data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <AcknowledgementPage
        finNumber={watchedValues.helperDetails.fin}
        helperName={watchedValues.helperDetails.helperName}
        referenceNumber="6ME2108120002" // Replace with actual reference number if available
        submissionDateTime={new Date().toLocaleString()} // Current date and time for submission
      />
    );
  }

  const selectedClinicDetails = clinics.find(
    (clinic) => clinic.id === watchedValues.clinicDoctor.clinic
  );
  const selectedDoctorDetails = doctors.find(
    (doctor) => doctor.id === watchedValues.clinicDoctor.doctor
  );

  if (step === STEPS.SUMMARY) {
    return (
      <div className="container mx-auto px-3 w-full pt-8 pb-16">
        <MedicalSummary
          clinicDetails={{
            clinic: selectedClinicDetails?.name || "",
            doctor: selectedDoctorDetails?.name || "",
            hciCode: selectedClinicDetails?.hciCode || "",
            contactNumber: selectedClinicDetails?.contactNumber || "",
            mcrNumber: selectedDoctorDetails?.mcrNumber || "",
          }}
          helperDetails={{
            fin: watchedValues.helperDetails.fin,
            name: watchedValues.helperDetails.helperName,
            visitDate: watchedValues.helperDetails.visitDate,
          }}
          medicalHistory={watchedValues.medicalHistory}
          clinicalExamination={{
            weight: watchedValues.clinicalExamination.weight,
            height: watchedValues.clinicalExamination.height,
            bmi: watchedValues.clinicalExamination.bmi,
            waistCircumference:
              watchedValues.clinicalExamination.waistCircumference,
            waistUnit: watchedValues.clinicalExamination.waistUnit,
            systolicBP: watchedValues.clinicalExamination.systolicBP,
            diastolicBP: watchedValues.clinicalExamination.diastolicBP,
            rightEyeVision: watchedValues.clinicalExamination.rightEyeVision,
            leftEyeVision: watchedValues.clinicalExamination.leftEyeVision,
            colorVision: watchedValues.clinicalExamination.colorVision,
            hearing: watchedValues.clinicalExamination.hearing,
            cardiovascularSystem:
              watchedValues.clinicalExamination.cardiovascularSystem,
            ecg: watchedValues.clinicalExamination.ecg,
            anaemia: watchedValues.clinicalExamination.anaemia,
            respiratorySystem:
              watchedValues.clinicalExamination.respiratorySystem,
            gastroIntestinalSystem:
              watchedValues.clinicalExamination.gastroIntestinalSystem,
            neurologicalSystem:
              watchedValues.clinicalExamination.neurologicalSystem,
            skin: watchedValues.clinicalExamination.skin,
            musculoskeletalSystem:
              watchedValues.clinicalExamination.musculoskeletalSystem,
            neck: watchedValues.clinicalExamination.neck,
            genitourinarySystem:
              watchedValues.clinicalExamination.genitourinarySystem,
            mentalHealth: watchedValues.clinicalExamination.mentalHealth,
            others: watchedValues.clinicalExamination.others,
          }}
          tests={{
            radiological: watchedValues.tests.radiological,
            syphilis: watchedValues.tests.syphilis,
            malaria: watchedValues.tests.malaria,
            hiv: watchedValues.tests.hiv,
            hba1c: watchedValues.tests.hba1c || undefined,
            lipids: watchedValues.tests.lipids || undefined,
            urineAlbumin: watchedValues.tests.urineAlbumin,
            urineGlucose: watchedValues.tests.urineGlucose,
            pregnancyTest: watchedValues.tests.pregnancyTest,
          }}
          isSubmitting={isSubmitting}
          onEdit={handleEdit}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
    );
  }

  // Don't render form content until after hydration
  if (!isClient) {
    return (
      <div className="container mx-auto px-3 w-full pt-8 pb-16">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid gap-6 md:grid-cols-[2fr,1fr] px-3 w-full pt-8 pb-16">
      <div className="my-6 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{examTitles.fme}</h1>
        </div>
        <div className="flex items-center justify-end gap-4">
          {lastSaved && (
            <p className="text-sm text-gray-500">
              Last saved at {formatDate(lastSaved)}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSave}
            disabled={isSaving || isSubmitted || !formValues.helperDetails?.fin}
          >
            {isSaving ? "Saving..." : "Save draft"}
          </Button>
        </div>
        <StepIndicator
          className="mb-6"
          steps={[
            {
              number: 1,
              label: "Submission",
              isActive: step === STEPS.SUBMISSION,
              isEnabled: true,
            },
            {
              number: 2,
              label: "Summary",
              // @ts-expect-error to fix STEPS.SUMMARY error
              isActive: step === STEPS.SUMMARY,
              isEnabled: isSummaryActive,
            },
          ]}
        />
        <div className="border border-gray-300 px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <FormProvider {...methods}>
            <Accordion
              type="single"
              value={expandedAccordion}
              onValueChange={setExpandedAccordion}
              collapsible
            >
              <AccordionItem value="clinic-doctor">
                <AccordionTrigger isCompleted={isCompletedStates.clinicDoctor}>
                  Clinic & Doctor Details
                </AccordionTrigger>
                <ClinicDoctorDetails
                  isSummaryActive={isSummaryActive}
                  handleContinue={handleContinue}
                  clinics={clinics}
                  doctors={doctors}
                />
              </AccordionItem>
              <AccordionItem value="helper-details">
                <AccordionTrigger
                  isCompleted={isCompletedStates.helperDetails}
                  isDisabled={!isHelperDetailsEnabled}
                >
                  Person Details
                </AccordionTrigger>
                <HelperDetails
                  handleContinue={handleContinue}
                  handleFinChange={handleFinChange}
                  setFinTouched={setFinTouched}
                  setVisitDateTouched={setVisitDateTouched}
                  isSummaryActive={isSummaryActive}
                  finTouched={finTouched}
                  visitDateTouched={visitDateTouched}
                  isPendingMe={isPendingMe}
                  nextStep="medical-history"
                  requireVisitDate={true}
                  defaultToday={false}
                  sampleFin={
                    draftId
                      ? watchedValues.helperDetails.fin
                      : samplePerson[0].fin
                  }
                  isLoading={isLoading}
                />
              </AccordionItem>
              <AccordionItem value="medical-history">
                <AccordionTrigger
                  isCompleted={isCompletedStates.medicalHistory}
                  isDisabled={!isMedicalHistoryEnabled}
                >
                  Medical History
                </AccordionTrigger>
                <MedicalHistory
                  isSummaryActive={isSummaryActive}
                  handleContinue={handleContinue}
                />
              </AccordionItem>
              <AccordionItem value="clinical-examination">
                <AccordionTrigger
                  isCompleted={isCompletedStates.clinicalExamination}
                  isDisabled={!isClinicalExaminationEnabled}
                >
                  Clinical Examination
                </AccordionTrigger>
                <ClinicalExamination
                  isSummaryActive={isSummaryActive}
                  handleContinue={handleContinue}
                />
              </AccordionItem>
              <AccordionItem value="tests">
                <AccordionTrigger
                  isCompleted={isCompletedStates.tests}
                  isDisabled={!isTestsEnabled}
                >
                  Tests
                </AccordionTrigger>
                <Tests
                  isSummaryActive={isSummaryActive}
                  handleContinue={handleContinue}
                />
              </AccordionItem>
            </Accordion>
          </FormProvider>
        </div>
        <FinChangeModal
          isOpen={isFinChangeModalOpen}
          onClose={() => setIsFinChangeModalOpen(false)}
          onConfirm={confirmFinChange}
        />
      </div>
    </div>
  );
}
