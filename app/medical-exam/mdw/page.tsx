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

// Mock data for clinics and doctors
const clinics = [
  { id: '1', name: 'Clinic A' },
  { id: '2', name: 'Clinic B' },
  { id: '3', name: 'Clinic C' },
]

const doctors = [
  { id: '1', name: 'Dr. Smith' },
  { id: '2', name: 'Dr. Johnson' },
  { id: '3', name: 'Dr. Lee' },
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
  const [step, setStep] = useState('submission')
  const [selectedClinic, setSelectedClinic] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [fin, setFin] = useState('')
  const [helperName, setHelperName] = useState('')
  const [visitDate, setVisitDate] = useState<Date | undefined>()
  const [isHelperDetailsEnabled, setIsHelperDetailsEnabled] = useState(false)
  const [isExaminationEnabled, setIsExaminationEnabled] = useState(false)
  const [expandedAccordion, setExpandedAccordion] = useState<string | undefined>("clinic-doctor")
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [testTypes, setTestTypes] = useState<string[]>([])
  const [positiveTests, setPositiveTests] = useState<string[]>([])
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [lastRecordedWeight, setLastRecordedWeight] = useState<number | null>(null)
  const [lastRecordedHeight, setLastRecordedHeight] = useState<number | null>(null)
  const [suspiciousInjuries, setSuspiciousInjuries] = useState(false)
  const [unintentionalWeightLoss, setUnintentionalWeightLoss] = useState(false)
  const [policeReport, setPoliceReport] = useState<string | null>(null)
  const [remarks, setRemarks] = useState('')
  const [somethingToReport, setSomethingToReport] = useState(false)
  const [showWeightWarning, setShowWeightWarning] = useState(false)

  const validateFin = (value: string) => {
    const regex = /^[FMG]\d{7}[A-Z]$/
    return regex.test(value)
  }

  const handleFinChange = async (value: string) => {
    setFin(value)
    if (validateFin(value)) {
      const result = await mockApiCall(value)
      if (result) {
        setHelperName(result.name)
        setTestTypes(result.testTypes)
        setLastRecordedWeight(result.lastRecordedWeight)
        setLastRecordedHeight(result.lastRecordedHeight)
        setHeight(result.lastRecordedHeight.toString())
      } else {
        setHelperName('')
        setTestTypes([])
        setLastRecordedWeight(null)
        setLastRecordedHeight(null)
        setHeight('')
      }
    } else {
      setHelperName('')
      setTestTypes([])
      setLastRecordedWeight(null)
      setLastRecordedHeight(null)
      setHeight('')
    }
  }

  const handleContinue = (nextStep: string) => {
    const newErrors: {[key: string]: string} = {}

    if (nextStep === 'helper-details') {
      if (!selectedClinic) newErrors.clinic = "Please select a clinic"
      if (!selectedDoctor) newErrors.doctor = "Please select a doctor"

      if (Object.keys(newErrors).length === 0) {
        setIsHelperDetailsEnabled(true)
        setExpandedAccordion("helper-details")
      }
    } else if (nextStep === 'examination-details') {
      if (!validateFin(fin)) newErrors.fin = "Please enter a valid FIN"
      if (!visitDate) newErrors.visitDate = "Please select a visit date"

      if (Object.keys(newErrors).length === 0) {
        setIsExaminationEnabled(true)
        setExpandedAccordion("examination-details")
      }
    } else if (nextStep === 'summary') {
      if (!weight) newErrors.weight = "Please enter a weight"
      else if (parseFloat(weight) < 15 || parseFloat(weight) > 200) newErrors.weight = "Weight must be between 15kg and 200kg"
      
      if (!height) newErrors.height = "Please enter a height"
      else if (parseFloat(height) < 90 || parseFloat(height) > 250) newErrors.height = "Height must be between 90cm and 250cm"

      if ((suspiciousInjuries || unintentionalWeightLoss) && policeReport === null) {
        newErrors.policeReport = "Please select whether a police report has been made"
      }

      if ((suspiciousInjuries || unintentionalWeightLoss || somethingToReport) && !remarks.trim()) {
        newErrors.remarks = "Please provide remarks"
      }

      if (Object.keys(newErrors).length === 0) {
        setStep('summary')
      }
    }

    setErrors(newErrors)
  }

  useEffect(() => {
    if (weight && height) {
      const weightInKg = parseFloat(weight)
      const heightInM = parseFloat(height) / 100
      const calculatedBmi = weightInKg / (heightInM * heightInM)
      setBmi(parseFloat(calculatedBmi.toFixed(1)))
    } else {
      setBmi(null)
    }
  }, [weight, height])

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'clinic':
        if (!value) newErrors.clinic = "Please select a clinic";
        else delete newErrors.clinic;
        break;
      case 'doctor':
        if (!value) newErrors.doctor = "Please select a doctor";
        else delete newErrors.doctor;
        break;
      case 'fin':
        if (!validateFin(value)) newErrors.fin = "Please enter a valid FIN";
        else delete newErrors.fin;
        break;
      case 'visitDate':
        if (!value) newErrors.visitDate = "Please select a visit date";
        else delete newErrors.visitDate;
        break;
      case 'weight':
        if (!value) newErrors.weight = "Please enter a weight";
        else if (parseFloat(value) < 15 || parseFloat(value) > 200) newErrors.weight = "Weight must be between 15kg and 200kg";
        else delete newErrors.weight;
        break;
      case 'height':
        if (!value) newErrors.height = "Please enter a height";
        else if (parseFloat(value) < 90 || parseFloat(value) > 250) newErrors.height = "Height must be between 90cm and 250cm";
        else delete newErrors.height;
        break;
      case 'policeReport':
        if ((suspiciousInjuries || unintentionalWeightLoss) && value === null) {
          newErrors.policeReport = "Please select whether a police report has been made";
        } else {
          delete newErrors.policeReport;
        }
        break;
      case 'remarks':
        if ((suspiciousInjuries || unintentionalWeightLoss || somethingToReport) && !value.trim()) {
          newErrors.remarks = "Please provide remarks";
        } else {
          delete newErrors.remarks;
        }
        break;
    }
    setErrors(newErrors);
  };

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
            <div className={cn("flex items-center", step === 'summary' ? "text-primary" : "text-muted-foreground opacity-50")}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-2">
                2
              </div>
              Summary
            </div>
          </div>

          <Accordion type="single" value={expandedAccordion} onValueChange={setExpandedAccordion} collapsible>
            <AccordionItem value="clinic-doctor">
              <AccordionTrigger>Clinic and doctor details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clinic">Select Clinic</Label>
                    <Select onValueChange={(value) => { setSelectedClinic(value); validateField('clinic', value); }} value={selectedClinic}>
                      <SelectTrigger id="clinic">
                        <SelectValue placeholder="Select a clinic" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinics.map(clinic => (
                          <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.clinic && <p className="text-red-500 text-sm mt-1">{errors.clinic}</p>}
                  </div>
                  <div>
                    <Label htmlFor="doctor">Select Doctor</Label>
                    <Select onValueChange={(value) => { setSelectedDoctor(value); validateField('doctor', value); }} value={selectedDoctor}>
                      <SelectTrigger id="doctor">
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map(doctor => (
                          <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.doctor && <p className="text-red-500 text-sm mt-1">{errors.doctor}</p>}
                  </div>
                </div>
                <Button className="mt-4" onClick={() => handleContinue('helper-details')}>Continue</Button>
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
                      value={fin}
                      onChange={(e) => { handleFinChange(e.target.value); validateField('fin', e.target.value); }}
                      placeholder="Enter FIN (e.g., G1234567A)"
                    />
                    {errors.fin && <p className="text-red-500 text-sm mt-1">{errors.fin}</p>}
                    {helperName && (
                      <p className="mt-2 text-sm text-muted-foreground">Helper Name: {helperName}</p>
                    )}
                  </div>
                  {helperName && (
                    <div>
                      <Label htmlFor="visit-date">Date helper visits the clinic</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !visitDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {visitDate ? format(visitDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={visitDate}
                            onSelect={(date) => { setVisitDate(date); validateField('visitDate', date); }}
                            disabled={(date) => 
                              date > new Date() || date < new Date(new Date().setDate(new Date().getDate() - 90))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.visitDate && <p className="text-red-500 text-sm mt-1">{errors.visitDate}</p>}
                    </div>
                  )}
                </div>
                <Button className="mt-4" onClick={() => handleContinue('examination-details')} disabled={!isHelperDetailsEnabled}>Continue</Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="examination-details" className={!isExaminationEnabled ? "opacity-50" : ""}>
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
                            value={weight}
                            onChange={(e) => {
                              const newWeight = e.target.value;
                              setWeight(newWeight);
                              validateField('weight', newWeight);
                              if (lastRecordedWeight) {
                                setShowWeightWarning(parseFloat(newWeight) <= 0.9 * lastRecordedWeight);
                              }
                            }}
                            placeholder="Enter weight"
                            className="mr-2 w-40"
                          />
                          <span>kg</span>
                        </div>
                        {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
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
                            value={height}
                            onChange={(e) => { setHeight(e.target.value); validateField('height', e.target.value); }}
                            placeholder="Enter height"
                            className="mr-2 w-40"
                          />
                          <span>cm</span>
                        </div>
                        {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                        {lastRecordedHeight && (
                          <p className="text-sm text-muted-foreground mt-1">Last recorded height: {lastRecordedHeight} cm (Date: {format(new Date(), 'dd/MM/yyyy')})</p>
                        )}
                      </div>
                      {bmi !== null && (
                        <div>
                          <Label>BMI</Label>
                          <p>{bmi}</p>
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
                            checked={positiveTests.includes(test)}
                            onCheckedChange={(checked) => {
                              setPositiveTests(
                                checked
                                  ? [...positiveTests, test]
                                  : positiveTests.filter((t) => t !== test)
                              )
                            }}
                            className={cn(
                              "border-2",
                              positiveTests.includes(test) 
                                ? "border-orange-500 bg-orange-500 text-primary-foreground hover:bg-orange-500 hover:text-primary-foreground" 
                                : "border-primary"
                            )}
                          />
                          <Label
                            htmlFor={test}
                            className={cn(
                              "text-sm font-medium",
                              positiveTests.includes(test) ? "text-orange-500" : ""
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
                              checked={suspiciousInjuries}
                              onCheckedChange={(checked) => {
                                setSuspiciousInjuries(checked as boolean);
                                if (!checked && !unintentionalWeightLoss) {
                                  setPoliceReport(null);
                                  const newErrors = { ...errors };
                                  delete newErrors.policeReport;
                                  delete newErrors.remarks;
                                  setErrors(newErrors);
                                }
                                validateField('remarks', remarks);
                              }}
                              className={cn(
                                "border-2",
                                suspiciousInjuries 
                                  ? "border-orange-500 bg-orange-500 text-primary-foreground hover:bg-orange-500 hover:text-primary-foreground" 
                                  : "border-primary"
                              )}
                            />
                            <Label
                              htmlFor="suspicious-injuries"
                              className={cn(
                                "text-sm font-medium",
                                suspiciousInjuries ? "text-orange-500" : ""
                              )}
                            >
                              Yes
                            </Label>
                          </div>
                        </div>
                        {suspiciousInjuries && (
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
                              checked={unintentionalWeightLoss}
                              onCheckedChange={(checked) => {
                                setUnintentionalWeightLoss(checked as boolean);
                                if (!checked && !suspiciousInjuries) {
                                  setPoliceReport(null);
                                  const newErrors = { ...errors };
                                  delete newErrors.policeReport;
                                  delete newErrors.remarks;
                                  setErrors(newErrors);
                                }
                                validateField('remarks', remarks);
                              }}
                              className={cn(
                                "border-2",
                                unintentionalWeightLoss 
                                  ? "border-orange-500 bg-orange-500 text-primary-foreground hover:bg-orange-500 hover:text-primary-foreground" 
                                  : "border-primary"
                              )}
                            />
                            <Label
                              htmlFor="unintentional-weight-loss"
                              className={cn(
                                "text-sm font-medium",
                                unintentionalWeightLoss ? "text-orange-500" : ""
                              )}
                            >
                              Yes
                            </Label>
                          </div>
                        </div>
                        {unintentionalWeightLoss && (
                          <p className="text-orange-500 text-sm mt-1 flex items-center">
                            <WarningIcon className="w-4 h-4 mr-1" />
                            Provide your assessment in the remarks section.
                          </p>
                        )}
                      </div>
                      {(suspiciousInjuries || unintentionalWeightLoss) && (
                        <div>
                          <Label
                            htmlFor="police-report"
                            className="text-sm font-medium mb-2 block"
                          >
                            Have you made a police report?
                          </Label>
                          <RadioGroup 
                            value={policeReport || ''} 
                            onValueChange={(value) => { setPoliceReport(value); validateField('policeReport', value); }}
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
                          {errors.policeReport && <p className="text-red-500 text-sm mt-1">{errors.policeReport}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Remarks</h3>
                    {(suspiciousInjuries || unintentionalWeightLoss) ? (
                      <>
                        <Textarea
                          placeholder="Enter any additional remarks here"
                          className="w-full"
                          value={remarks}
                          onChange={(e) => { setRemarks(e.target.value); validateField('remarks', e.target.value); }}
                          maxLength={500}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {500 - remarks.length} characters left
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="something-to-report"
                          checked={somethingToReport}
                          onCheckedChange={(checked) => {
                            setSomethingToReport(checked as boolean);
                            if (!checked) {
                              setRemarks('');
                              const newErrors = { ...errors };
                              delete newErrors.remarks;
                              setErrors(newErrors);
                            }
                          }}
                          className={cn(
                            "border-2",
                            somethingToReport
                              ? "border-orange-500 bg-orange-500 text-primary-foreground hover:bg-orange-500 hover:text-primary-foreground"
                              : "border-primary"
                          )}
                        />
                        <Label htmlFor="something-to-report">
                          I have something else to report to MOM about the helper
                        </Label>
                      </div>
                    )}
                    {somethingToReport && !suspiciousInjuries && !unintentionalWeightLoss && (
                      <>
                        <Textarea
                          placeholder="Enter your report here"
                          className="w-full mt-2"
                          value={remarks}
                          onChange={(e) => { setRemarks(e.target.value); validateField('remarks', e.target.value); }}
                          maxLength={500}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {500 - remarks.length} characters left
                        </p>
                      </>
                    )}
                    {errors.remarks && <p className="text-red-500 text-sm mt-1">{errors.remarks}</p>}
                  </div>
                </div>
                <Button className="mt-4" onClick={() => handleContinue('summary')} disabled={!isExaminationEnabled}>Continue</Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

