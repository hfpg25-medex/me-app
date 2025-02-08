"use client";

import { createSubmissionAndRecord } from "@/app/actions/records";
import { AcknowledgementPage } from "@/components/AcknowledgementPage";
import { FinChangeModal } from "@/components/FinChangeModal";
import { ClinicDoctorDetails } from "@/components/medical-exam/ClinicDoctorDetails";
import { ExaminationDetails } from "@/components/medical-exam/ExaminationDetailsMW";
import { HelperDetails } from "@/components/medical-exam/HelperDetails";
import { Summary } from "@/components/Summary";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StepIndicator } from "@/components/ui/step-indicator";
import { examTitles } from "@/constants/exam-titles";
import { STEPS, StepType } from "@/constants/steps";
import { getCurrentUserId } from "@/lib/auth";
import { FormDataMW, formSchemaMW } from "@/lib/schemas";
import { generateSamplePeople } from "@/lib/utils/sample-data";
import { generateSubmissionId } from "@/lib/utils/submission";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const submissionId = generateSubmissionId("FMW");

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

// Generate sample data
const samplePerson = generateSamplePeople(1);

// Mock API call
const mockApiCall = async (fin: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Find person by FIN
  const person = samplePerson.find((p) => p.fin === fin);

  if (person) {
    return {
      name: person.name,
      testTypes: [
        "Pregnancy",
        "Syphilis test",
        "HIV",
        "Chest X-ray to screen for TB",
      ],
    };
  }
  return null;
};

export default function FMWExamPage() {
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState<StepType>(STEPS.SUBMISSION);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<
    string | undefined
  >("clinic-doctor");

  // This effect runs once after hydration
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  const [isHelperDetailsEnabled, setIsHelperDetailsEnabled] = useState(false);
  const [isExaminationEnabled, setIsExaminationEnabled] = useState(false);
  const [isSummaryActive, setIsSummaryActive] = useState(false);
  const [isFinChangeModalOpen, setIsFinChangeModalOpen] = useState(false);
  const [tempFin, setTempFin] = useState("");
  const [testTypes, setTestTypes] = useState<string[]>([]);
  const [finTouched, setFinTouched] = useState(false);
  const [visitDateTouched, setVisitDateTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPendingMe, setIsPendingMe] = useState(false);

  //To remove
  console.log(isSubmitting);

  // Add completion state for each section
  const [isClinicDoctorCompleted, setIsClinicDoctorCompleted] = useState(false);
  const [isHelperDetailsCompleted, setIsHelperDetailsCompleted] =
    useState(false);
  const [isExaminationCompleted, setIsExaminationCompleted] = useState(false);

  const methods = useForm<FormDataMW>({
    resolver: zodResolver(formSchemaMW),
    defaultValues: {
      clinicDoctor: { clinic: "", doctor: "" },
      helperDetails: { fin: "", helperName: "", visitDate: undefined },
      examinationDetails: {
        positiveTests: [],
        remarks: "",
      },
    },
  });

  const { setValue, watch, trigger, handleSubmit } = methods;
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
    // Set initial state before API call
    setIsLoading(true);
    setIsPendingMe(true);
    setValue("helperDetails.helperName", "");
    setTestTypes([]);

    try {
      const result = await mockApiCall(fin);
      if (result) {
        setValue("helperDetails.helperName", result.name);
        setTestTypes(result.testTypes);
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

  const handleContinue = async (nextStep: string) => {
    let isValid = false;

    switch (nextStep) {
      case "helper-details":
        isValid = await trigger("clinicDoctor");
        if (isValid) {
          setIsHelperDetailsEnabled(true);
          setIsClinicDoctorCompleted(true);
          setExpandedAccordion("helper-details");
        }
        break;
      case "examination-details":
        isValid = await trigger("helperDetails");
        if (isValid) {
          setIsExaminationEnabled(true);
          setIsHelperDetailsCompleted(true);
          setExpandedAccordion("examination-details");
        }
        break;
      case "summary":
        isValid = await trigger("examinationDetails");
        if (isValid) {
          setIsExaminationCompleted(true);
          setIsSummaryActive(true);
          setStep(STEPS.SUMMARY);
        }
        break;
    }
  };

  const handleEdit = (
    section: "clinic-doctor" | "helper-details" | "examination-details"
  ) => {
    setStep(STEPS.SUBMISSION);
    setExpandedAccordion(section);
  };

  const onSubmit = async (data: FormDataMW) => {
    setIsSubmitting(true);
    try {
      const userId = getCurrentUserId();

      const result = await createSubmissionAndRecord({
        userId,
        examType: "FMW",
        formData: data,
        submissionId,
        clinicId: data.clinicDoctor.clinic,
        doctorId: data.clinicDoctor.doctor,
        foreignerId: data.helperDetails.fin,
        agency: "MOM",
        type: "Medical Examination for Female Migrant Worker",
        name: data.helperDetails.helperName,
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        console.error("Failed to submit form:", result.error);
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <AcknowledgementPage
        finNumber={watchedValues.helperDetails.fin}
        helperName={watchedValues.helperDetails.helperName}
        referenceNumber={submissionId}
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
        <Summary
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
            visitDate: watchedValues.helperDetails.visitDate || null,
          }}
          examinationDetails={{
            positiveTests: watchedValues.examinationDetails.positiveTests,
            testResults: testTypes.map((test) => ({
              name: test,
              result: watchedValues.examinationDetails.positiveTests.includes(
                test
              )
                ? "Positive/Reactive"
                : "Negative/Non-reactive",
            })),
            remarks: watchedValues.examinationDetails.remarks,
          }}
          type="MW"
          onEdit={handleEdit}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
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
      <div className="my-6">
        <h1 className="text-2xl font-bold mb-6">{examTitles.fmw}</h1>
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Accordion
                type="single"
                value={expandedAccordion}
                onValueChange={setExpandedAccordion}
                collapsible
              >
                <AccordionItem value="clinic-doctor">
                  <AccordionTrigger
                    className="text-lg font-bold"
                    isCompleted={isClinicDoctorCompleted}
                  >
                    Clinic and doctor details
                  </AccordionTrigger>
                  <ClinicDoctorDetails
                    isSummaryActive={isSummaryActive}
                    handleContinue={handleContinue}
                    clinics={clinics}
                    doctors={doctors}
                  />
                </AccordionItem>
                <AccordionItem
                  value="helper-details"
                  className={!isHelperDetailsEnabled ? "opacity-50" : ""}
                >
                  <AccordionTrigger
                    className="text-lg font-bold"
                    disabled={!isHelperDetailsEnabled}
                    isCompleted={isHelperDetailsCompleted}
                  >
                    Migrant worker details
                  </AccordionTrigger>
                  <HelperDetails
                    isSummaryActive={isSummaryActive}
                    handleContinue={handleContinue}
                    handleFinChange={handleFinChange}
                    setFinTouched={setFinTouched}
                    setVisitDateTouched={setVisitDateTouched}
                    finTouched={finTouched}
                    visitDateTouched={visitDateTouched}
                    isPendingMe={isPendingMe}
                    nextStep="examination-details"
                    requireVisitDate={true}
                    defaultToday={false}
                    sampleFin={samplePerson[0].fin}
                    isLoading={isLoading}
                  />
                </AccordionItem>
                <AccordionItem
                  value="examination-details"
                  className={
                    !isExaminationEnabled
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }
                >
                  <AccordionTrigger
                    className="text-lg font-bold"
                    disabled={!isExaminationEnabled}
                    isCompleted={isExaminationCompleted}
                  >
                    Examination details
                  </AccordionTrigger>
                  <ExaminationDetails
                    isSummaryActive={isSummaryActive}
                    handleContinue={handleContinue}
                    testTypes={testTypes}
                  />
                </AccordionItem>
              </Accordion>
            </form>
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
