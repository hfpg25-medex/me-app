"use client";

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
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

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

// Mock API call
const mockApiCall = async (fin: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Mock response
  if (fin === "F2770033X") {
    return {
      name: "R** ME**",
      doe: "2025-08-10",
      dob: "1990-01-01",
      occupation: "Driver",
    };
  }
  return null;
};

export default function WPExamPage() {
  const [step, setStep] = useState<StepType>(STEPS.SUBMISSION);
  const [expandedAccordion, setExpandedAccordion] = useState<
    string | undefined
  >("clinic-doctor");
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
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission
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
        urineAlbumin: "normal",
        urineGlucose: "normal",
        pregnancyTest: "negative",
        colorVision: "normal",
        hearing: "normal",
      },
      tests: {
        radiological: { result: "negative", details: null },
        syphilis: "negative",
        malaria: "negative",
        hiv: "negative",
        hba1c: "normal",
        lipids: "normal",
      },
    },
  });

  const { watch, handleSubmit, trigger, setValue } = methods;

  const watchedValues = watch();

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
    // trigger('helperDetails')
    const result = await mockApiCall(fin);
    if (result) {
      setValue("helperDetails.helperName", result.name);
      setIsPendingMe(true);
    } else {
      setValue("helperDetails.helperName", "");
      setIsPendingMe(false);
    }
  };

  const confirmFinChange = async () => {
    setValue("helperDetails.fin", tempFin);
    setIsFinChangeModalOpen(false);
    await validateAndFetchHelperDetails(tempFin);
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

  const onSubmit = (data: FormDataWP) => {
    console.log("Form submitted!", data);
    setIsSubmitted(true);
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
            urineAlbumin: watchedValues.clinicalExamination.urineAlbumin,
            urineGlucose: watchedValues.clinicalExamination.urineGlucose,
            pregnancyTest: watchedValues.clinicalExamination.pregnancyTest,
            colorVision: watchedValues.clinicalExamination.colorVision,
            hearing: watchedValues.clinicalExamination.hearing,
          }}
          tests={{
            radiological: watchedValues.tests.radiological,
            syphilis: watchedValues.tests.syphilis,
            malaria: watchedValues.tests.malaria,
            hiv: watchedValues.tests.hiv,
            hba1c: watchedValues.tests.hba1c || undefined,
            lipids: watchedValues.tests.lipids || undefined,
          }}
          onEdit={handleEdit}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto grid gap-6 md:grid-cols-[2fr,1fr] px-3 w-full pt-8 pb-16">
      <div className="my-6 ">
        <h1 className="text-2xl font-bold mb-6">{examTitles.fme}</h1>
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
