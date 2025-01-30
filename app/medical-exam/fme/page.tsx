'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FinChangeModal } from "@/components/FinChangeModal"
import { formSchemaWP, FormDataWP } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { ClinicDoctorDetails } from "@/components/medical-exam/ClinicDoctorDetails"
import { HelperDetails } from "@/components/medical-exam/HelperDetails"
import { MedicalHistory } from "@/components/medical-exam/MedicalHistory"
import { ClinicalExamination } from "@/components/medical-exam/ClinicalExamination"
import { Tests } from "@/components/medical-exam/Tests"
import { AcknowledgementPage } from '@/components/AcknowledgementPage'
import { MedicalSummary } from '@/components/medical-summary'
import { StepIndicator } from "@/components/ui/step-indicator"
import { examTitles } from '@/constants/exam-titles'
import { STEPS, StepType } from '@/constants/steps'

const clinics = [
  { id: '1', name: 'ABC Medical Clinic (Bukit Batok)', hciCode: '2M12345', contactNumber: '+65 69991234' },
  // { id: '2', name: 'Healthline 24Hr Clinic (Jurong East)', hciCode: '2M54321', contactNumber: '+65 69995678' },
]

/*
66 Bukit Batok Central #01-24, Singapore 675689
438 Jurong East #04-55, Singapore 289988
*/
const doctors = [
  { id: '1', name: 'Dr. John Doe', mcrNumber: 'M12345A' },
  { id: '2', name: 'Dr. Sarah Chen', mcrNumber: 'M67890B' },
]

// Mock API call
const mockApiCall = async (fin: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 0))
  
  // Mock response
  if (fin === 'F2770033X') {
    return { 
      name: 'R** ME**', 
      doe: '2025-08-10',
      dob: '1990-01-01',
      occupation: 'Driver'
    }
  }
  return null
}

const requireVisitDate = true


export default function WPExamPage() {
  const [step, setStep] = useState<StepType>(STEPS.SUBMISSION);
  const [expandedAccordion, setExpandedAccordion] = useState<string | undefined>("clinic-doctor")
  const [isHelperDetailsEnabled, setIsHelperDetailsEnabled] = useState(false)
  const [isMedicalHistoryEnabled, setIsMedicalHistoryEnabled] = useState(false)
  const [isClinicalExaminationEnabled, setIsClinicalExaminationEnabled] = useState(false)
  const [isTestsEnabled, setIsTestsEnabled] = useState(false)
  const [isSummaryActive, setIsSummaryActive] = useState(false)
  const [isFinChangeModalOpen, setIsFinChangeModalOpen] = useState(false)
  const [tempFin, setTempFin] = useState('')
  const [finTouched, setFinTouched] = useState(false);
  const [visitDateTouched, setVisitDateTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission
  const [isPendingMe, setIsPendingMe] = useState (false)

  const methods = useForm<FormDataWP>({
    resolver: zodResolver(formSchemaWP),
    defaultValues: {
      clinicDoctor: { clinic: '', doctor: '' },
      helperDetails: { fin: '', helperName: '', visitDate: new Date() },
      medicalHistory:  [],
      clinicalExamination: {
        weight: 0,
        height: 0,
        waistCircumference: 0,
        systolicBP: 0,
        diastolicBP: 0,
        rightEyeVision: '5/6',
        leftEyeVision: '5/6',
        urineAlbumin: 'normal',
        urineGlucose: 'normal',
        pregnancyTest: 'negative',
        colorVision: 'normal',
        hearing: 'normal'
      },
      tests: {
        radiological: { result: 'negative', details: null },
          syphilis: 'negative',
          malaria: 'negative',
          hiv: 'negative',
          hba1c: 'normal',
          lipids: 'normal'
      }
    },
  })

  const { setValue, watch, trigger, handleSubmit } = methods
  const watchedValues = watch()
  

  const handleFinChange = async (value: string) => {
    if (isSummaryActive && value !== watchedValues.helperDetails.fin) {
      setTempFin(value);
      setIsFinChangeModalOpen(true);
    } else {
      setValue('helperDetails.fin', value);
      setFinTouched(false);  // Reset the touched state
      await validateAndFetchHelperDetails(value);
    }
  };

  const validateAndFetchHelperDetails = async (fin: string) => {
    // trigger('helperDetails')
    const result = await mockApiCall(fin)
    if (result) {
      setValue('helperDetails.helperName', result.name)
      setIsPendingMe(true)
    } else {
      setValue('helperDetails.helperName', '')
      setIsPendingMe(false)
    }
  }

  const confirmFinChange = async () => {
    setValue('helperDetails.fin', tempFin)
    setIsFinChangeModalOpen(false)
    await validateAndFetchHelperDetails(tempFin)
  }

  const handleContinue = async (nextStep: string) => {
    let isValid = false

    switch (nextStep) {
      case 'helper-details':
        isValid = await trigger('clinicDoctor')
        console.log(watchedValues)
        console.log('isValid1=', isValid)
        if (isValid) {
          setIsHelperDetailsEnabled(true)
          setExpandedAccordion('helper-details')
        } 
        break
      case 'medical-history':
        isValid = await trigger('helperDetails')
        console.log(watchedValues)
        if (isValid) {
          setIsMedicalHistoryEnabled(true)
          setExpandedAccordion('medical-history')
        }
        break
      case 'clinical-examination':
        isValid = await trigger('medicalHistory')
        console.log(watchedValues)
        console.log('isValid6=', isValid)
        if (isValid) {
          setIsClinicalExaminationEnabled(true)
          setExpandedAccordion('clinical-examination')
        }
        break
      case 'tests':
          console.log(watchedValues)
          isValid = await trigger('clinicalExamination')
          console.log('Clinical Examination Errors:', methods.formState.errors.clinicalExamination)
          console.log('isValid7=', isValid)
          if (isValid) {
            setIsTestsEnabled(true)
            setExpandedAccordion('tests')
            console.log("isTestsEnabled",isTestsEnabled)
          }
        break
      case 'summary':
        isValid = await trigger('tests')
        console.log(watchedValues)

        if (isValid) {
          setIsSummaryActive(true)
          setStep(STEPS.SUMMARY)
        }
        break
    }
  }

  const handleEdit = (section: 'clinic-doctor' | 'helper-details' | 'medical-history' | 'clinical-examination' | 'tests') => {
    setStep(STEPS.SUBMISSION)
    setExpandedAccordion(section)
  }

  const onSubmit = (data: FormDataWP) => {
    console.log("Form submitted!", data)
    setIsSubmitted(true);
  }

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

  const selectedClinicDetails = clinics.find(clinic => clinic.id === watchedValues.clinicDoctor.clinic)
  const selectedDoctorDetails = doctors.find(doctor => doctor.id === watchedValues.clinicDoctor.doctor)

  if (step === STEPS.SUMMARY) {
    return (
      <div className="container mx-auto p-6">
        <MedicalSummary
          clinicDetails={{
            clinic: selectedClinicDetails?.name || '',
            doctor: selectedDoctorDetails?.name || '',
            hciCode: selectedClinicDetails?.hciCode || '',
            contactNumber: selectedClinicDetails?.contactNumber || '',
            mcrNumber: selectedDoctorDetails?.mcrNumber || '',
          }}
          helperDetails={{
            fin: watchedValues.helperDetails.fin,
            name: watchedValues.helperDetails.helperName,
            visitDate: watchedValues.helperDetails.visitDate || null
          }}
          medicalHistory={watchedValues.medicalHistory}
          clinicalExamination={{
            weight: watchedValues.clinicalExamination.weight === "" ? 0 : Number(watchedValues.clinicalExamination.weight),
            height: watchedValues.clinicalExamination.height === "" ? 0 : Number(watchedValues.clinicalExamination.height),
            bmi: watchedValues.clinicalExamination.bmi === "" ? 0 : Number(watchedValues.clinicalExamination.bmi),
            waistCircumference: watchedValues.clinicalExamination.waistCircumference === "" ? 0 : Number(watchedValues.clinicalExamination.waistCircumference),
            systolicBP: watchedValues.clinicalExamination.systolicBP === "" ? 0 : Number(watchedValues.clinicalExamination.systolicBP),
            diastolicBP: watchedValues.clinicalExamination.diastolicBP === "" ? 0 : Number(watchedValues.clinicalExamination.diastolicBP),
            leftEyeVision: watchedValues.clinicalExamination.leftEyeVision,
            urineAlbumin: watchedValues.clinicalExamination.urineAlbumin,
            urineGlucose: watchedValues.clinicalExamination.urineGlucose,
            pregnancyTest: watchedValues.clinicalExamination.pregnancyTest,
            colorVision: watchedValues.clinicalExamination.colorVision,
            hearing: watchedValues.clinicalExamination.hearing,
          }}
          tests= {{
            radiological: watchedValues.tests.radiological,
            syphilis: watchedValues.tests.syphilis,
            malaria: watchedValues.tests.malaria,
            hiv: watchedValues.tests.hiv,
            hba1c: watchedValues.tests.hba1c,
            lipids: watchedValues.tests.lipids,
          }}
          onEdit={handleEdit}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-[760px] mx-auto mt-6 ">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">{examTitles.fme}</CardTitle>
        </CardHeader>
        <CardContent>
          <StepIndicator 
            className="mb-6"
            steps={[
              {
                number: 1,
                label: "Submission",
                isActive: step === STEPS.SUBMISSION,
                isEnabled: true
              },
              {
                number: 2,
                label: "Summary",
                // @ts-expect-error
                isActive: step === STEPS.SUMMARY,
                isEnabled: isSummaryActive
              }
            ]}
          />
          <FormProvider {...methods}>
            {/* <form onSubmit={
              handleSubmit(onSubmit)
              }> */}
              <Accordion type="single" value={expandedAccordion} onValueChange={setExpandedAccordion} collapsible>
                <AccordionItem value="clinic-doctor">
                  <AccordionTrigger className="text-lg font-bold">Clinic and doctor details</AccordionTrigger>
                  <ClinicDoctorDetails 
                    isSummaryActive={isSummaryActive} 
                    handleContinue={handleContinue}
                    clinics={clinics}
                    doctors={doctors}
                  />
                </AccordionItem>
                <AccordionItem value="helper-details" className={!isHelperDetailsEnabled ? "opacity-50" : ""}>
                  <AccordionTrigger className="text-lg font-bold" disabled={!isHelperDetailsEnabled}>Foreign worker details</AccordionTrigger>
                  <HelperDetails 
                    isSummaryActive={isSummaryActive}
                    handleContinue={handleContinue}
                    handleFinChange={handleFinChange}
                    setFinTouched={setFinTouched}
                    setVisitDateTouched={setVisitDateTouched}
                    finTouched={finTouched}
                    visitDateTouched={visitDateTouched}
                    isPendingMe={isPendingMe}
                    nextStep='medical-history'
                    requireVisitDate={requireVisitDate}
                  />
                </AccordionItem>
                <AccordionItem value="medical-history" className={!isMedicalHistoryEnabled ? "opacity-50" : ""}>
                  <AccordionTrigger className="text-lg font-bold" disabled={!isMedicalHistoryEnabled}>Medical history</AccordionTrigger>
                  <MedicalHistory
                  isSummaryActive={isSummaryActive}
                  handleContinue={handleContinue}
                  />
                </AccordionItem>
                <AccordionItem value="clinical-examination" className={!isClinicalExaminationEnabled ? "opacity-50" : ""}>
                  <AccordionTrigger className="text-lg font-bold" disabled={!isClinicalExaminationEnabled}>Clinical examination</AccordionTrigger>
                <ClinicalExamination
                  isSummaryActive={isSummaryActive}
                  handleContinue={handleContinue}
                 />
                </AccordionItem>
                <AccordionItem value="tests" className={!isClinicalExaminationEnabled ? "opacity-50" : ""}>
                  <AccordionTrigger className="text-lg font-bold" disabled={!isTestsEnabled}>Tests</AccordionTrigger>
                <Tests
                  isSummaryActive={isSummaryActive}
                  handleContinue={handleContinue}
                 />
                </AccordionItem>
              </Accordion>
            {/* </form> */}
          </FormProvider>
        </CardContent>
      </Card>
      <FinChangeModal
        isOpen={isFinChangeModalOpen}
        onClose={() => setIsFinChangeModalOpen(false)}
        onConfirm={confirmFinChange}
      />
    </div>
  )
}