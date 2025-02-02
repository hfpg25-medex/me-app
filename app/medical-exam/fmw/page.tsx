'use client'

import { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Summary } from "@/components/Summary"
import { FinChangeModal } from "@/components/FinChangeModal"
import { formSchemaMW, FormDataMW } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { ClinicDoctorDetails } from "@/components/medical-exam/ClinicDoctorDetails"
import { HelperDetails } from "@/components/medical-exam/HelperDetails"
import { ExaminationDetails } from "@/components/medical-exam/ExaminationDetailsMW"
import { AcknowledgementPage } from '@/components/AcknowledgementPage'
import { StepIndicator } from "@/components/ui/step-indicator"
import { examTitles } from '@/constants/exam-titles'
import { STEPS, StepType } from '@/constants/steps'
import { toast } from 'sonner'

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
  if (fin === 'F1234567N') {
    return { 
      name: 'H** LI**', 
      testTypes: ['Pregnancy', 'Syphilis test', 'HIV', 'Chest X-ray to screen for TB']
    }
  }
  return null
}

export default function FMWExamPage() {
  const [step, setStep] = useState<StepType>(STEPS.SUBMISSION)
  const [expandedAccordion, setExpandedAccordion] = useState<string | undefined>("clinic-doctor")
  const [isHelperDetailsEnabled, setIsHelperDetailsEnabled] = useState(false)
  const [isExaminationEnabled, setIsExaminationEnabled] = useState(false)
  const [isSummaryActive, setIsSummaryActive] = useState(false)
  const [isFinChangeModalOpen, setIsFinChangeModalOpen] = useState(false)
  const [tempFin, setTempFin] = useState('')
  const [testTypes, setTestTypes] = useState<string[]>([])
  const [finTouched, setFinTouched] = useState(false);
  const [visitDateTouched, setVisitDateTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPendingMe, setIsPendingMe] = useState (false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  // Add completion state for each section
  const [isClinicDoctorCompleted, setIsClinicDoctorCompleted] = useState(false)
  const [isHelperDetailsCompleted, setIsHelperDetailsCompleted] = useState(false)
  const [isExaminationCompleted, setIsExaminationCompleted] = useState(false)

  const methods = useForm<FormDataMW>({
    resolver: zodResolver(formSchemaMW),
    defaultValues: {
      clinicDoctor: { clinic: '', doctor: '' },
      helperDetails: { fin: '', helperName: '', visitDate: undefined },
      examinationDetails: {
        positiveTests: [],
        remarks: '',
      },
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
      setTestTypes(result.testTypes)
      setIsPendingMe(true)
    } else {
      setValue('helperDetails.helperName', '')
      setTestTypes([])
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
        if (isValid) {
          setIsHelperDetailsEnabled(true)
          setIsClinicDoctorCompleted(true)
          setExpandedAccordion('helper-details')
        }
        break
      case 'examination-details':
        isValid = await trigger('helperDetails')
        if (isValid) {
          setIsExaminationEnabled(true)
          setIsHelperDetailsCompleted(true)
          setExpandedAccordion('examination-details')
        }
        break
      case 'summary':
        isValid = await trigger('examinationDetails')
        if (isValid) {
          setIsExaminationCompleted(true)
          setIsSummaryActive(true)
          setStep(STEPS.SUMMARY)
        }
        break
    }
  }

  const handleEdit = (section: 'clinic-doctor' | 'helper-details' | 'examination-details') => {
    setStep(STEPS.SUBMISSION)
    setExpandedAccordion(section)
  }

  const onSubmit = async (data: FormDataMW) => {
    try {
      // Show loading state
      setIsSubmitting(true)

      // Prepare the submission data
      const submission = {
        type: 'FMW',
        data,
        createdAt: new Date().toISOString(),
        status: 'completed'
      }

      // Call the API endpoint
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to save submission')
      }

      // Show success message
      toast.success('Form submitted successfully')

      // Update submission ID and move to acknowledgment page
      setSubmissionId(result.submissionId)
      setIsSubmitted(true);
    } catch (error) {
      // Show error message
      toast.error('Failed to submit form. Please try again.')
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const selectedClinicDetails = clinics.find(clinic => clinic.id === watchedValues.clinicDoctor.clinic)
  const selectedDoctorDetails = doctors.find(doctor => doctor.id === watchedValues.clinicDoctor.doctor)

  if (step === STEPS.SUMMARY) {
    return (
      <div className="container mx-auto">
        <Summary
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
          examinationDetails={{
            positiveTests: watchedValues.examinationDetails.positiveTests,
            testResults: testTypes.map(test => ({
              name: test,
              result: watchedValues.examinationDetails.positiveTests.includes(test) ? 'Positive/Reactive' : 'Negative/Non-reactive'
            })),
            remarks: watchedValues.examinationDetails.remarks
          }}
          type="MW"
          onEdit={handleEdit}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-[760px] mx-auto my-6 ">
      <h1 className="text-2xl font-bold mb-6">{examTitles.fmw}</h1>
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
                // @ts-expect-error to fix STEPS.SUMMARY error
                isActive: step === STEPS.SUMMARY,
                isEnabled: isSummaryActive
              }
            ]}
        />
      <div className="border border-gray-300 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Accordion type="single" value={expandedAccordion} onValueChange={setExpandedAccordion} collapsible>
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
                <AccordionItem value="helper-details" className={!isHelperDetailsEnabled ? "opacity-50" : ""}>
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
                    nextStep='examination-details'
                    requireVisitDate={true}
                    defaultToday={false}
                  />
                </AccordionItem>
                <AccordionItem value="examination-details" className={!isExaminationEnabled ? "opacity-50 pointer-events-none" : ""}>
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
  )
}
