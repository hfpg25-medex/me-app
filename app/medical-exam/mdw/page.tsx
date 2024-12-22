'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
    return { name: 'Jane Doe', testTypes: ['HIV', 'Pregnancy'] }
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
      } else {
        setHelperName('')
      }
    } else {
      setHelperName('')
    }
  }

  const handleContinue = (nextStep: string) => {
    if (nextStep === 'helper-details' && selectedClinic && selectedDoctor) {
      setIsHelperDetailsEnabled(true)
    } else if (nextStep === 'examination-details' && validateFin(fin) && visitDate) {
      setIsExaminationEnabled(true)
    } else if (nextStep === 'summary') {
      setStep('summary')
    }
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
            <div className={cn("flex items-center", step === 'summary' ? "text-primary" : "text-muted-foreground opacity-50")}>
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-2">
                2
              </div>
              Summary
            </div>
          </div>

          <Accordion type="single" collapsible defaultValue="clinic-doctor">
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
                    </div>
                  )}
                </div>
                <Button className="mt-4" onClick={() => handleContinue('examination-details')} disabled={!isHelperDetailsEnabled}>Continue</Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="examination-details" className={!isExaminationEnabled ? "opacity-50" : ""}>
              <AccordionTrigger disabled={!isExaminationEnabled}>Examination details</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  Examination details will be available once all required information is provided.
                </p>
                <Button className="mt-4" onClick={() => handleContinue('summary')} disabled={!isExaminationEnabled}>Continue</Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button className="mt-4" onClick={handleContinue}>Continue</Button>
        </CardContent>
      </Card>
    </div>
  )
}

