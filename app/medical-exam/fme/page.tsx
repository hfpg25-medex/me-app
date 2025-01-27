'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Summary } from "@/components/SummaryMW"
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

const medicalHistoryItems = ['Mental Illness', 'Epilepsy', 'Chronic Asthma', 'Diabetes Mellitus', 'Hypertension', 'Tuberculosis', 'Heart Disease', 'Malaria', 'Operations']
// Mock API call
const mockApiCall = async (fin: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 0))
  
  // Mock response
  if (fin === 'F2770033X') {
    return { 
      name: 'R** ME**', 
      testTypes: ['Pregnancy', 'Syphilis test', 'HIV', 'Chest X-ray to screen for TB'],
      doe: '2025-08-10',
    }
  }
  return null
}

const requireVisitDate = true


export default function WPExamPage() {
  const [step, setStep] = useState<'submission' | 'summary'>('submission')
  const [expandedAccordion, setExpandedAccordion] = useState<string | undefined>("clinic-doctor")
  const [isHelperDetailsEnabled, setIsHelperDetailsEnabled] = useState(false)
  const [isMedicalHistoryEnabled, setIsMedicalHistoryEnabled] = useState(false)
  const [isClinicalExaminationEnabled, setIsClinicalExaminationEnabled] = useState(false)
  const [isTestsEnabled, setIsTestsEnabled] = useState(false)
  const [isSummaryActive, setIsSummaryActive] = useState(false)
  const [isFinChangeModalOpen, setIsFinChangeModalOpen] = useState(false)
  const [tempFin, setTempFin] = useState('')
  const [testTypes, setTestTypes] = useState<string[]>([])
  const [finTouched, setFinTouched] = useState(false);
  const [visitDateTouched, setVisitDateTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission
  const [isPendingMe, setIsPendingMe] = useState (false)
  const [medicalHistoryItems, setMedicalHistoryItems] = useState<string[]>([]);

  const methods = useForm<FormDataWP>({
    resolver: zodResolver(formSchemaWP),
    defaultValues: {
      clinicDoctor: { clinic: '', doctor: '' },
      helperDetails: { fin: '', helperName: '', visitDate: undefined },
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
      case 'medical-history':
        isValid = await trigger('helperDetails')
        if (isValid) {
          setIsMedicalHistoryEnabled(true)
          setExpandedAccordion('medical-history')
        }
        break
      case 'clinical-examination':
        isValid = await trigger('medicalHistory')
        console.log('isValid6=', isValid)
        if (isValid) {
          setIsClinicalExaminationEnabled(true)
          setExpandedAccordion('clinical-examination')
        }
        break
      case 'tests':
          console.log(watchedValues.clinicalExamination)

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
        isValid = true //temp
        if (isValid) {
          setIsSummaryActive(true)
          setStep('summary')
        }
        break
    }
  }

  const handleEdit = (section: 'clinic-doctor' | 'helper-details' | 'medical-history' | 'clinical-examination' | 'tests') => {
    setStep('submission')
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
          // medicalHistory={watchedValues.medicalHistory}
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
    <div className="w-full max-w-[760px] mx-auto mt-6 ">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Full Medical Exam for Foreign Workers (MOM)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className={cn("flex items-center", step === 'submission' ? "text-primary" : "text-muted-foreground")}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-2">
                1
              </div>
              Submission
            </div>
            <div className="mx-2 w-10 h-0.5 bg-gray-300"></div>
            <div className={cn("flex items-center", isSummaryActive ? "text-primary" : "text-muted-foreground opacity-50")}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-2">
                2
              </div>
              Summary
            </div>
          </div>

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