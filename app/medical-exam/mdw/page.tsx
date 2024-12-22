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
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

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
      // Add validation for examination details here
      if (!weight) newErrors.weight = "Please enter a weight"
      else if (parseFloat(weight) < 15 || parseFloat(weight) > 200) newErrors.weight = "Weight must be between 15kg and 200kg"
      
      if (!height) newErrors.height = "Please enter a height"
      else if (parseFloat(height) < 90 || parseFloat(height) > 250) newErrors.height = "Height must be between 90cm and 250cm"

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
                    <Select onValueChange={setSelectedClinic} value={selectedClinic}>
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
                    <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
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
                      onChange={(e) => handleFinChange(e.target.value)}
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
                            onSelect={setVisitDate}
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
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Enter weight"
                            className="mr-2"
                          />
                          <span>kg</span>
                        </div>
                        {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                        {lastRecordedWeight && (
                          <p className="text-sm text-muted-foreground mt-1">Last recorded weight: {lastRecordedWeight} kg</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <div className="flex items-center">
                          <Input
                            id="height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Enter height"
                            className="mr-2"
                          />
                          <span>cm</span>
                        </div>
                        {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                        {lastRecordedHeight && (
                          <p className="text-sm text-muted-foreground mt-1">Last recorded height: {lastRecordedHeight} cm</p>
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
                      <div key={test} className="flex items-center space-x-2">
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
                        />
                        <Label
                          htmlFor={test}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {test}
                        </Label>
                      </div>
                    ))}
                    {/* {test === 'HIV' && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Note: HIV test must be done by an MOH-approved laboratory.
                      </p>
                    )} */}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Physical examination details</h3>
                    <p className="text-sm text-muted-foreground">
                      Physical examination details coming soon...
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Remarks</h3>
                    <Textarea
                      placeholder="Enter any additional remarks here"
                      className="w-full"
                    />
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

