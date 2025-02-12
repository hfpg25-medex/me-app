"use client";

import { createSubmissionAndRecord } from "@/app/actions/records";
import { AcknowledgementPage } from "@/components/AcknowledgementPage";
import { ClinicDoctorDetails } from "@/components/medical-exam/ClinicDoctorDetails";
import { ExaminationDetails } from "@/components/medical-exam/ExaminationDetailsPR";
import { PersonDetails } from "@/components/medical-exam/PersonDetails";
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
import { FormDataPR, formSchemaPR } from "@/lib/schemas";
import { generateSubmissionId } from "@/lib/utils/submission";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const submissionId = generateSubmissionId("PR");

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

const testTypes: string[] = ["HIV", "Chest X-ray to screen for TB"];

export default function PRExamPage() {
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState<StepType>(STEPS.SUBMISSION);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<
    string | undefined
  >("clinic-doctor");

  // This effect runs once after hydration
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  const [isPersonDetailsEnabled, setIsPersonDetailsEnabled] = useState(false);
  const [isExaminationEnabled, setIsExaminationEnabled] = useState(false);
  const [isSummaryActive, setIsSummaryActive] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission

  // Add completion state for each section
  const [isClinicDoctorCompleted, setIsClinicDoctorCompleted] = useState(false);
  const [isPersonDetailsCompleted, setIsPersonDetailsCompleted] =
    useState(false);
  const [isExaminationCompleted, setIsExaminationCompleted] = useState(false);

  const methods = useForm<FormDataPR>({
    resolver: zodResolver(formSchemaPR),
    defaultValues: {
      clinicDoctor: { clinic: "", doctor: "" },
      helperDetails: { fin: "", helperName: "", visitDate: undefined },
      examinationDetails: {
        testTypes: ["HIV", "Chest X-ray to screen for TB"],
        positiveTests: [],
        remarks: "",
      },
    },
  });

  const { watch, trigger, handleSubmit } = methods;
  const watchedValues = watch();

  const handleContinue = async (nextStep: string) => {
    let isValid = false;

    switch (nextStep) {
      case "helper-details":
        isValid = await trigger("clinicDoctor");
        if (isValid) {
          setIsPersonDetailsEnabled(true);
          setIsClinicDoctorCompleted(true);
          setExpandedAccordion("helper-details");
        }
        break;
      case "examination-details":
        isValid = await trigger("helperDetails");
        console.log(watchedValues);
        console.log("isValidX=", isValid);
        if (isValid) {
          setIsExaminationEnabled(true);
          setIsPersonDetailsCompleted(true);
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

  const onSubmit = async (data: FormDataPR) => {
    setIsSubmitting(true);
    try {
      const userId = getCurrentUserId();
      const result = await createSubmissionAndRecord({
        userId,
        examType: "PR",
        formData: data,
        submissionId,
        clinicId: data.clinicDoctor.clinic,
        doctorId: data.clinicDoctor.doctor,
        foreignerId: data.helperDetails.fin,
        agency: "ICA",
        type: "Medical Examination for PR Application",
        name: data.helperDetails.helperName,
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        // Handle error
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
        referenceNumber={submissionId} // Replace with actual reference number if available
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
      <div className="min-h-screen bg-gray-100">
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
              helperName: watchedValues.helperDetails.helperName,
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
            type="PR"
            isSubmitting={isSubmitting}
            onEdit={handleEdit}
            onSubmit={handleSubmit(onSubmit)}
          />
        </div>
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto grid gap-6 md:grid-cols-[2fr,1fr] px-3 w-full pt-8 pb-16">
        <div className="my-6 ">
          <h1 className="text-2xl font-bold mb-6">{examTitles.pr}</h1>
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
          <div className="bg-white border border-gray-300 px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
                    className={!isPersonDetailsEnabled ? "opacity-50" : ""}
                  >
                    <AccordionTrigger
                      className="text-lg font-bold"
                      disabled={!isPersonDetailsEnabled}
                      isCompleted={isPersonDetailsCompleted}
                    >
                      Person details
                    </AccordionTrigger>
                    <PersonDetails
                      isSummaryActive={isSummaryActive}
                      handleContinue={handleContinue}
                      nextStep="examination-details"
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
                    />
                  </AccordionItem>
                </Accordion>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
