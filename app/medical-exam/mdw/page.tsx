'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Summary } from "@/components/Summary"
import { FinChangeModal } from "@/components/FinChangeModal"
import { formSchema, FormData } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { ClinicDoctorDetails } from "@/components/medical-exam/ClinicDoctorDetails"
import { HelperDetails } from "@/components/medical-exam/HelperDetails"
import { ExaminationDetails } from "@/components/medical-exam/ExaminationDetails"

const clinics = [
  { id: '1', name: 'Clinic A', hciCode: '21M0180', contactNumber: '+65 6999 1234' },
  { id: '2', name: 'Clinic B', hciCode: '21M0181', contactNumber: '+65 6999 5678' },
  { id: '3', name: 'Clinic C', hciCode: '21M0182', contactNumber: '+65 6999 9012' },
]

const doctors = [
  { id: '1', name: 'Dr. Smith', mcrNumber: 'M11111A' },
  { id: '2', name: 'Dr. Johnson', mcrNumber: 'M22222B' },
  { id: '3', name: 'Dr. Lee', mcrNumber: 'M33333C' },
]

// Mock API call
const mockApiCall = async (fin: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock response
  if (fin === 'G1234567A') {
    return { 
      name: 'Jane Doe', 
      testTypes: ['Pregnancy', 'Syphilis test', 'HIV', 'Chest X-ray to screen for TB'],
      lastRecordedWeight: 55,
      lastRecordedHeight: 160
    }
  }
  return null
}

export default function MDWExamPage() {
  const [step, setStep] = useState<'submission' | 'summary'>('submission')
  const [expandedAccordion, setExpandedAccordion] = useState<string | undefined>("clinic-doctor")
  const [isHelperDetailsEnabled, setIsHelperDetailsEnabled] = useState(false)
  const [isExaminationEnabled, setIsExaminationEnabled] = useState(false)
  const [isSummaryActive, setIsSummaryActive] = useState(false)
  const [isFinChangeModalOpen, setIsFinChangeModalOpen] = useState(false)
  const [tempFin, setTempFin] = useState('')
  const [testTypes, setTestTypes] = useState<string[]>([])
  const [lastRecordedWeight, setLastRecordedWeight] = useState<number | null>(null)
  const [lastRecordedHeight, setLastRecordedHeight] = useState<number | null>(null)
  const [showWeightWarning, setShowWeightWarning] = useState(false)
  const [finTouched, setFinTouched] = useState(false);
  const [visitDateTouched, setVisitDateTouched] = useState(false);
  const [weightTouched, setWeightTouched] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinicDoctor: { clinic: '', doctor: '' },
      helperDetails: { fin: '', helperName: '', visitDate: undefined },
      examinationDetails: {
        weight: '', // Changed from 0 to an empty string
        height: 0,
        bmi: null,
        positiveTests: [],
        suspiciousInjuries: false,
        unintentionalWeightLoss: false,
        policeReport: null,
        remarks: '',
      },
    },
  })

  const { setValue, watch, trigger, handleSubmit } = methods
  const watchedValues = watch()

  useEffect(() => {
    if (watchedValues.examinationDetails.weight && watchedValues.examinationDetails.height) {
      const weightInKg = watchedValues.examinationDetails.weight
      const heightInM = watchedValues.examinationDetails.height / 100
      const calculatedBmi = weightInKg / (heightInM * heightInM)
      setValue('examinationDetails.bmi', parseFloat(calculatedBmi.toFixed(1)))
    } else {
      setValue('examinationDetails.bmi', null)
    }
  }, [watchedValues.examinationDetails.weight, watchedValues.examinationDetails.height, setValue])

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
    const result = await mockApiCall(fin)
    if (result) {
      setValue('helperDetails.helperName', result.name)
      setTestTypes(result.testTypes)
      setLastRecordedWeight(result.lastRecordedWeight)
      setLastRecordedHeight(result.lastRecordedHeight)
      setValue('examinationDetails.height', result.lastRecordedHeight)
    } else {
      setValue('helperDetails.helperName', '')
      setTestTypes([])
      setLastRecordedWeight(null)
      setLastRecordedHeight(null)
      setValue('examinationDetails.height', 0)
    }
    trigger('helperDetails')
  }

  const confirmFinChange = async () => {
    setValue('helperDetails.fin', tempFin)
    setIsFinChangeModalOpen(false)
    await validateAndFetchHelperDetails(tempFin)
  }

  const handleContinue = async (nextStep: string) => {
    console.log('nextStep=', nextStep)
    let isValid = false

    switch (nextStep) {
      case 'helper-details':
        isValid = await trigger('clinicDoctor')
        console.log('isValid=', isValid)
        if (isValid) {
          setIsHelperDetailsEnabled(true)
          setExpandedAccordion('helper-details')
        } 
        break
      case 'examination-details':
        console.log('examination-details2')
        isValid = await trigger('helperDetails')
        if (isValid) {
          // if (isSummaryActive) {
          //   setStep('summary')
          // } else {
          //   setIsExaminationEnabled(true)
          //   setExpandedAccordion('examination-details')
          // }
          setIsExaminationEnabled(true)
          setExpandedAccordion('examination-details')
        }
        break
      // case 'examination-details':
      //   setWeightTouched(true);
      //   // isValid = await trigger(['examinationDetails.weight', 'examinationDetails'])
      //   isValid = await trigger('examinationDetails')

      //   if (isValid) {
      //     setIsSummaryActive(true)
      //     setStep('summary')
      //   }
      //   break
      case 'summary':
        console.log('summary2')
        // console.log('summary')
        // setIsSummaryActive(true)
        // setStep('summary')
        // isValid = await trigger(['clinicDoctor', 'helperDetails', 'examinationDetails'])
        // isValid = await trigger('examinationDetails')
        isValid = await trigger(['examinationDetails.weight', 'examinationDetails'])


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

  const onSubmit = (data: FormData) => {
    console.log("Form submitted!", data)
    // Implement the submission logic here
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
            weight: watchedValues.examinationDetails.weight !== null ? watchedValues.examinationDetails.weight.toString() : '',
            height: watchedValues.examinationDetails.height.toString(),
            bmi: watchedValues.examinationDetails.bmi,
            positiveTests: watchedValues.examinationDetails.positiveTests,
            testResults: testTypes.map(test => ({
              name: test,
              result: watchedValues.examinationDetails.positiveTests.includes(test) ? 'Positive/Reactive' : 'Negative/Non-reactive'
            })),
            suspiciousInjuries: watchedValues.examinationDetails.suspiciousInjuries,
            unintentionalWeightLoss: watchedValues.examinationDetails.unintentionalWeightLoss,
            policeReport: watchedValues.examinationDetails.policeReport,
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
          <CardTitle>Six-monthly Medical Exam for Migrant Domestic Workers (MOM)</CardTitle>
          <CardDescription>
            Required medical examination for migrant domestic workers
          </CardDescription>
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Accordion type="single" value={expandedAccordion} onValueChange={setExpandedAccordion} collapsible>
                <AccordionItem value="clinic-doctor">
                  <AccordionTrigger>Clinic and doctor details</AccordionTrigger>
                  <ClinicDoctorDetails 
                    isSummaryActive={isSummaryActive} 
                    handleContinue={handleContinue}
                    clinics={clinics}
                    doctors={doctors}
                  />
                </AccordionItem>
                <AccordionItem value="helper-details" className={!isHelperDetailsEnabled ? "opacity-50" : ""}>
                  <AccordionTrigger disabled={!isHelperDetailsEnabled}>Helper details</AccordionTrigger>
                  <HelperDetails 
                    isSummaryActive={isSummaryActive}
                    handleContinue={handleContinue}
                    handleFinChange={handleFinChange}
                    setFinTouched={setFinTouched}
                    setVisitDateTouched={setVisitDateTouched}
                    finTouched={finTouched}
                    visitDateTouched={visitDateTouched}
                  />
                </AccordionItem>
                <AccordionItem value="examination-details" className={!isExaminationEnabled ? "opacity-50 pointer-events-none" : ""}>
                  <AccordionTrigger disabled={!isExaminationEnabled}>Examination details</AccordionTrigger>
                  <ExaminationDetails 
                    isSummaryActive={isSummaryActive}
                    handleContinue={handleContinue}
                    setWeightTouched={setWeightTouched}
                    weightTouched={weightTouched}
                    showWeightWarning={showWeightWarning}
                    lastRecordedWeight={lastRecordedWeight}
                    lastRecordedHeight={lastRecordedHeight}
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

