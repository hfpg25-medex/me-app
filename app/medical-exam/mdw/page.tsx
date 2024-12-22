'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, FileWarningIcon as WarningIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Summary } from "@/components/Summary"
import { FinChangeModal } from "@/components/FinChangeModal"
import { formSchema, FormData } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, trigger } from "react-hook-form"

// Mock data for clinics and doctors
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

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinicDoctor: { clinic: '', doctor: '' },
      helperDetails: { fin: '', helperName: '', visitDate: undefined },
      examinationDetails: {
        weight: 0,
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
    let isValid = false

    switch (expandedAccordion) {
      case 'clinic-doctor':
        isValid = await trigger('clinicDoctor')
        if (isValid) {
          setIsHelperDetailsEnabled(true)
          setExpandedAccordion('helper-details')
        }
        break
      case 'helper-details':
        isValid = await trigger('helperDetails')
        if (isValid) {
          if (isSummaryActive) {
            setStep('summary')
          } else {
            setIsExaminationEnabled(true)
            setExpandedAccordion('examination-details')
          }
        }
        break
      case 'examination-details':
        setWeightTouched(true);
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
            weight: watchedValues.examinationDetails.weight.toString(),
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <Accordion type="single" value={expandedAccordion} onValueChange={setExpandedAccordion} collapsible>
              <AccordionItem value="clinic-doctor">
                <AccordionTrigger>Clinic and doctor details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clinic">Select Clinic</Label>
                      <Select onValueChange={(value) => setValue('clinicDoctor.clinic', value)} value={watchedValues.clinicDoctor.clinic}>
                        <SelectTrigger id="clinic">
                          <SelectValue placeholder="Select a clinic" />
                        </SelectTrigger>
                        <SelectContent>
                          {clinics.map(clinic => (
                            <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.clinicDoctor?.clinic && <p className="text-red-500 text-sm mt-1">{errors.clinicDoctor.clinic.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="doctor">Select Doctor</Label>
                      <Select onValueChange={(value) => setValue('clinicDoctor.doctor', value)} value={watchedValues.clinicDoctor.doctor}>
                        <SelectTrigger id="doctor">
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map(doctor => (
                            <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.clinicDoctor?.doctor && <p className="text-red-500 text-sm mt-1">{errors.clinicDoctor.doctor.message}</p>}
                    </div>
                  </div>
                  <Button 
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white" 
                    onClick={() => {
                      if (isSummaryActive) {
                        setStep('summary');
                      } else {
                        handleContinue('helper-details');
                      }
                    }}
                  >
                    {isSummaryActive ? 'Continue to Summary' : 'Continue'}
                  </Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="helper-details" className={!isHelperDetailsEnabled ? "opacity-50" : ""}>
                <AccordionTrigger disabled={!isHelperDetailsEnabled}>Helper details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fin">FIN</Label>
                      <Input
                        id="fin"
                        {...register('helperDetails.fin')}
                        onChange={(e) => {
                          handleFinChange(e.target.value);
                          setFinTouched(true);
                        }}
                        onBlur={() => setFinTouched(true)}
                        placeholder="Enter FIN (e.g., G1234567A)"
                      />
                      {finTouched && errors.helperDetails?.fin && (
                        <p className="text-red-500 text-sm mt-1">Please enter a valid FIN</p>
                      )}
                    </div>
                    {watchedValues.helperDetails.helperName && (
                      <>
                        <div>
                          <Label>Helper Name</Label>
                          <p className="mt-2 text-sm">{watchedValues.helperDetails.helperName}</p>
                        </div>
                        <div>
                          <Label htmlFor="visit-date">Date helper visits the clinic</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !watchedValues.helperDetails.visitDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {watchedValues.helperDetails.visitDate ? format(watchedValues.helperDetails.visitDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={watchedValues.helperDetails.visitDate}
                                onSelect={(date) => {
                                  setValue('helperDetails.visitDate', date);
                                  setVisitDateTouched(true);
                                  trigger('helperDetails.visitDate');  // Trigger validation
                                }}
                                disabled={(date) => 
                                  date > new Date() || date < new Date(new Date().setDate(new Date().getDate() - 90))
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          {visitDateTouched && errors.helperDetails?.visitDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.helperDetails.visitDate.message}</p>
                          )}
                        </div>
                      </>
                    )}
                    
                  <Button 
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white" 
                    onClick={() => {
                      setFinTouched(true);
                      setVisitDateTouched(true);
                      const isFinValid = trigger('helperDetails.fin');
                      const isDateValid = trigger('helperDetails.visitDate');
                      
                      if (isFinValid && isDateValid) {
                        handleContinue(isSummaryActive ? 'summary' : 'examination-details');
                      }
                    }} 
                    disabled={!isHelperDetailsEnabled}
                  >
                    {isSummaryActive ? 'Continue to Summary' : 'Continue'}
                  </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="examination-details" className={!isExaminationEnabled ? "opacity-50 pointer-events-none" : ""}>
                <AccordionTrigger disabled={!isExaminationEnabled}>Examination details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Body measurements</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <div className="flex items-center">
                            <Input
                              id="weight"
                              type="number"
                              {...register('examinationDetails.weight', { 
                                valueAsNumber: true,
                                validate: (value) => value >= 15 && value <= 200 || "Weight must be between 15kg and 200kg"
                              })}
                              onChange={(e) => {
                                const newWeight = parseFloat(e.target.value);
                                setValue('examinationDetails.weight', newWeight);
                                if (lastRecordedWeight) {
                                  setShowWeightWarning(newWeight <= 0.9 * lastRecordedWeight);
                                }
                                setWeightTouched(true);
                                trigger('examinationDetails.weight');  // Trigger validation immediately
                              }}
                              onBlur={() => {
                                setWeightTouched(true);
                                trigger('examinationDetails.weight');  // Trigger validation on blur
                              }}
                              placeholder="Enter weight"
                              className="mr-2 w-40"
                            />
                            <span>kg</span>
                          </div>
                          {weightTouched && errors.examinationDetails?.weight && (
                            <p className="text-red-500 text-sm mt-1">{errors.examinationDetails.weight.message}</p>
                          )}
                          {showWeightWarning && (
                            <div className="flex items-start space-x-2 p-3 bg-orange-100 border border-orange-300 rounded-md mt-2">
                              <WarningIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-orange-700">
                                This helper has lost &gt;=10% weight since the last examination. If her weight loss was unintentional or if its reason cannot be determined, please select 'Yes' for weight loss under the Physical examination details.
                              </p>
                            </div>
                          )}
                          {lastRecordedWeight && (
                            <p className="text-sm text-muted-foreground mt-1">Last recorded weight: {lastRecordedWeight} kg (Date: {format(new Date(), 'dd/MM/yyyy')})</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="height">Height (cm)</Label>
                          <div className="flex items-center">
                            <Input
                              id="height"
                              type="number"
                              {...register('examinationDetails.height', { valueAsNumber: true })}
                              placeholder="Enter height"
                              className="mr-2 w-40"
                            />
                            <span>cm</span>
                          </div>
                          {errors.examinationDetails?.height && <p className="text-red-500 text-sm mt-1">{errors.examinationDetails.height.message}</p>}
                          {lastRecordedHeight && (
                            <p className="text-sm text-muted-foreground mt-1">Last recorded height: {lastRecordedHeight} cm (Date: {format(new Date(), 'dd/MM/yyyy')})</p>
                          )}
                        </div>
                        {watchedValues.examinationDetails.bmi !== null && (
                          <div>
                            <Label>BMI</Label>
                            <p>{watchedValues.examinationDetails.bmi}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Test results</h3>
                      <p className="text-sm text-muted-foreground mb-2">Indicate positive test results:</p>
                      {testTypes.map((test) => (
                        <div key={test} className="flex items-center mb-2">
                          <Label
                            htmlFor={test}
                            className="flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-3/4"
                          >
                            {test}
                          </Label>
                          <div className="flex items-center space-x-2 ml-auto pl-24">
                            <Checkbox
                              id={test}
                              checked={watchedValues.examinationDetails.positiveTests.includes(test)}
                              onCheckedChange={(checked) => {
                                const updatedTests = checked
                                  ? [...watchedValues.examinationDetails.positiveTests, test]
                                  : watchedValues.examinationDetails.positiveTests.filter((t) => t !== test);
                                setValue('examinationDetails.positiveTests', updatedTests);
                              }}
                              className={cn(
                                "border-2",
                                watchedValues.examinationDetails.positiveTests.includes(test) 
                                  ? "border-orange-500 bg-orange-500 text-primary-foreground hover:bg-orange-500 hover:text-primary-foreground" 
                                  : "border-primary"
                              )}
                            />
                            <Label
                              htmlFor={test}
                              className={cn(
                                "text-sm font-medium",
                                watchedValues.examinationDetails.positiveTests.includes(test) ? "text-orange-500" : ""
                              )}
                            >
                              Positive/Reactive
                            </Label>
                          </div>
                        </div>
                      ))}
                      {testTypes.includes('HIV') && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Note: HIV test must be done by an MOH-approved laboratory.
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Physical examination details</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <Label
                              htmlFor="suspicious-injuries"
                              className="flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-3/4"
                            >
                              Signs of suspicious or unexplained injuries
                            </Label>
                            <div className="flex items-center space-x-2 ml-auto pl-24">
                              <Checkbox
                                id="suspicious-injuries"
                                checked={watchedValues.examinationDetails.suspiciousInjuries}
                                onCheckedChange={(checked) => {
                                  setValue('examinationDetails.suspiciousInjuries', checked as boolean);
                                  if (!checked && !watchedValues.examinationDetails.unintentionalWeightLoss) {
                                    setValue('examinationDetails.policeReport', null);
                                  }
                                }}
                                className={cn(
                                  "border-2",
                                  watchedValues.examinationDetails.suspiciousInjuries 
                                    ? "border-orange-500 bg-orange-500 text-primary-foreground hover:bg-orange-500 hover:text-primary-foreground" 
                                    : "border-primary"
                                )}
                              />
                              <Label
                                htmlFor="suspicious-injuries"
                                className={cn(
                                  "text-sm font-medium",
                                  watchedValues.examinationDetails.suspiciousInjuries ? "text-orange-500" : ""
                                )}
                              >
                                Yes
                              </Label>
                            </div>
                          </div>
                          {watchedValues.examinationDetails.suspiciousInjuries && (
                            <p className="text-orange-500 text-sm mt-1 flex items-center">
                              <WarningIcon className="w-4 h-4 mr-1" />
                              Provide your assessment in the remarks section.
                            </p>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <Label
                              htmlFor="unintentional-weight-loss"
                              className="flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-3/4"
                            >
                              Unintentional weight loss (if unsure, select yes)
                            </Label>
                            <div className="flex items-center space-x-2 ml-auto pl-24">
                              <Checkbox
                                id="unintentional-weight-loss"
                                checked={watchedValues.examinationDetails.unintentionalWeightLoss}
                                onCheckedChange={(checked) => {
                                  setValue('examinationDetails.unintentionalWeightLoss', checked as boolean);
                                  if (!checked && !watchedValues.examinationDetails.suspiciousInjuries) {
                                    setValue('examinationDetails.policeReport', null);
                                  }
                                }}
                                className={cn(
                                  "border-2",
                                  watchedValues.examinationDetails.unintentionalWeightLoss 
                                    ? "border-orange-500 bg-orange-500 text-primary-foreground hover:bg-orange-500 hover:text-primary-foreground" 
                                    : "border-primary"
                                )}
                              />
                              <Label
                                htmlFor="unintentional-weight-loss"
                                className={cn(
                                  "text-sm font-medium",
                                  watchedValues.examinationDetails.unintentionalWeightLoss ? "text-orange-500" : ""
                                )}
                              >
                                Yes
                              </Label>
                            </div>
                          </div>
                          {watchedValues.examinationDetails.unintentionalWeightLoss && (
                            <p className="text-orange-500 text-sm mt-1 flex items-center">
                              <WarningIcon className="w-4 h-4 mr-1" />
                              Provide your assessment in the remarks section.
                            </p>
                          )}
                        </div>
                        {(watchedValues.examinationDetails.suspiciousInjuries || watchedValues.examinationDetails.unintentionalWeightLoss) && (
                          <div>
                            <Label
                              htmlFor="police-report"
                              className="text-sm font-medium mb-2 block"
                            >
                              Have you made a police report?
                            </Label>
                            <RadioGroup 
                              value={watchedValues.examinationDetails.policeReport || ''} 
                              onValueChange={(value) => setValue('examinationDetails.policeReport', value as 'yes' | 'no')}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="police-report-yes" />
                                <Label htmlFor="police-report-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="police-report-no" />
                                <Label htmlFor="police-report-no">No</Label>
                              </div>
                            </RadioGroup>
                            {errors.examinationDetails?.policeReport && <p className="text-red-500 text-sm mt-1">{errors.examinationDetails.policeReport.message}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Remarks</h3>
                      <div className="space-y-4">
                        {(watchedValues.examinationDetails.suspiciousInjuries ||
                          watchedValues.examinationDetails.unintentionalWeightLoss ||
                          watchedValues.examinationDetails.remarks !== '') && (
                          <>
                            <Textarea
                              placeholder="Enter any additional remarks here"
                              className="w-full"
                              {...register('examinationDetails.remarks')}
                              maxLength={500}
                            />
                            <p className="text-sm text-muted-foreground">
                              {500 - (watchedValues.examinationDetails.remarks?.length || 0)} characters left
                            </p>
                          </>
                        )}
                        {!watchedValues.examinationDetails.suspiciousInjuries && !watchedValues.examinationDetails.unintentionalWeightLoss && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="something-to-report"
                              checked={watchedValues.examinationDetails.remarks !== ''}
                              onCheckedChange={(checked) => {
                                setValue('examinationDetails.remarks', checked ? ' ' : '');
                              }}
                              className={cn(
                                "border-2",
                                watchedValues.examinationDetails.remarks !== '' 
                                  ? "border-orange-500 bg-orange-500 text-primary-foreground hover:bg-orange-500 hover:text-primary-foreground"
                                  : "border-primary"
                              )}
                            />
                            <Label htmlFor="something-to-report">
                              I have something else to report to MOM about the helper
                            </Label>
                          </div>
                        )}
                      </div>
                      {errors.examinationDetails?.remarks && <p className="text-red-500 text-sm mt-1">{errors.examinationDetails.remarks.message}</p>}
                    </div>
                  </div>
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleContinue('summary')} disabled={!isExaminationEnabled}>{isSummaryActive ? 'Continue to Summary' : 'Continue'}</Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </form>
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

