'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Summary } from "@/components/SummaryMW"
import { FinChangeModal } from "@/components/FinChangeModal"
import { formSchemaMW, FormDataMW } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { ClinicDoctorDetails } from "@/components/medical-exam/ClinicDoctorDetails"
import { HelperDetails } from "@/components/medical-exam/HelperDetails"
import { ExaminationDetails } from "@/components/medical-exam/ExaminationDetailsMW"
import { AcknowledgementPage } from '@/components/AcknowledgementPage'
import { StepIndicator } from "@/components/ui/step-indicator"

const clinics = [
  { id: '1', name: 'Healthline Medical Clinic (Bukit Batok)', hciCode: '2M12345', contactNumber: '+65 69991234' },
  // { id: '2', name: 'Healthline 24Hr Clinic (Jurong East)', hciCode: '2M54321', contactNumber: '+65 69995678' },
]

/*
66 Bukit Batok Central #01-24, Singapore 675689
438 Jurong East #04-55, Singapore 289988
*/
const doctors = [
  { id: '1', name: 'Mary Ang', mcrNumber: 'M11111A' },
  { id: '2', name: 'Danny Lim', mcrNumber: 'M22222B' },
]

// Mock API call
const mockApiCall = async (fin: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 0))
  
  // Mock response
  if (fin === 'F2770033X') {
    return { 
      name: 'H** LI**', 
      testTypes: ['Pregnancy', 'Syphilis test', 'HIV', 'Chest X-ray to screen for TB']
    }
  }
  return null
}

export default function MWExamPage() {
  const [step, setStep] = useState<'submission' | 'summary'>('submission')
  const [expandedAccordion, setExpandedAccordion] = useState<string | undefined>("clinic-doctor")
  const [isHelperDetailsEnabled, setIsHelperDetailsEnabled] = useState(false)
  const [isExaminationEnabled, setIsExaminationEnabled] = useState(false)
  const [isSummaryActive, setIsSummaryActive] = useState(false)
  const [isFinChangeModalOpen, setIsFinChangeModalOpen] = useState(false)
  const [tempFin, setTempFin] = useState('')
  const [testTypes, setTestTypes] = useState<string[]>([])
  const [finTouched, setFinTouched] = useState(false);
  const [visitDateTouched, setVisitDateTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission
  const [isPendingMe, setIsPendingMe] = useState (false)

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
        console.log('isValid1=', isValid)
        if (isValid) {
          setIsHelperDetailsEnabled(true)
          setExpandedAccordion('helper-details')
        } 
        break
      case 'examination-details':
        isValid = await trigger('helperDetails')
        console.log('isValid2=', isValid)
        if (isValid) {
          setIsExaminationEnabled(true)
          setExpandedAccordion('examination-details')
        }
        break
      case 'summary':
        isValid = await trigger('examinationDetails')
        isValid = true //temp
        if (isValid) {
          setIsSummaryActive(true)
          setStep('summary')
        }
        break
    }
  }

  const handleEdit = (section: 'clinic-doctor' | 'helper-details' | 'examination-details') => {
    setStep('submission')
    setExpandedAccordion(section)
  }

  const onSubmit = (data: FormDataMW) => {
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

  if (step === 'summary') {
    return (
      <div className="container mx-auto p-6">
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
          onEdit={handleEdit}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Six-monthly Medical Exam for Female Migrant Workers (MOM)</CardTitle>
        </CardHeader>
        <CardContent>
          <StepIndicator
            className="mb-6"
            steps={[
              {
                number: 1,
                label: "Submission",
                isActive: step === 'submission',
                isEnabled: true
              },
              {
                number: 2,
                label: "Summary",
                //@ts-expect-error
                isActive: step === 'summary',
                isEnabled: isSummaryActive
              }
            ]}
          />

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                  <AccordionTrigger className="text-lg font-bold" disabled={!isHelperDetailsEnabled}>Migrant worker details</AccordionTrigger>
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
                  />
                </AccordionItem>
                <AccordionItem value="examination-details" className={!isExaminationEnabled ? "opacity-50 pointer-events-none" : ""}>
                  <AccordionTrigger className="text-lg font-bold" disabled={!isExaminationEnabled}>Examination details</AccordionTrigger>
                  <ExaminationDetails 
                    isSummaryActive={isSummaryActive}
                    handleContinue={handleContinue}
                    testTypes={testTypes}
                  />
                </AccordionItem>
              </Accordion>
            </form>
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
