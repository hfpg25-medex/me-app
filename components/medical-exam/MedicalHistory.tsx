"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { AccordionContent } from "../ui/accordion"
import { useFormContext } from "react-hook-form"
import { FormDataWP } from "@/lib/schemas"

const historyItems = [
  "Mental Illness",
  "Epilepsy",
  "Heart Disease",
  "Diabetes",
  "Asthma",
  "Cancer",
  "High Blood Pressure",
  "Stroke",
  "Allergies",
]

interface MedicalHistoryProps {
  isSummaryActive: boolean
  handleContinue: (nextStep: string) => void
}

type HistoryItem = {
  condition: string
  hasCondition: boolean
  details: string
}
export function MedicalHistory({ 
  isSummaryActive, 
  handleContinue, 
}: MedicalHistoryProps) {
  const [medicalHistory, setMedicalHistory] = useState<HistoryItem[]>(
    historyItems.map((item) => ({ condition: item, hasCondition: false, details: "" })),
  )
  const { register, setValue, formState: { errors }, watch } = useFormContext<FormDataWP>()

  const watchedValues = watch()

  const handleToggle = (index: number) => {
    setMedicalHistory((prev) =>
      prev.map((item, i) => (i === index ? { ...item, hasCondition: !item.hasCondition } : item)),
    )
    setValue('medicalHistory',medicalHistory)
  }

  const handleDetailsChange = (index: number, details: string) => {
    setMedicalHistory((prev) => prev.map((item, i) => (i === index ? { ...item, details } : item)))
  }

  function HistoryItemComponent({
    item,
    onToggle,
    onDetailsChange,
  }: {
    item: HistoryItem
    onToggle: () => void
    onDetailsChange: (details: string) => void
  }) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor={`toggle-${item.condition}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {item.condition}
          </Label>
          <Switch id={`toggle-${item.condition}`} checked={item.hasCondition} onCheckedChange={onToggle} />
        </div>
        {item.hasCondition && (
          <Textarea
            placeholder={`Please provide details about ${item.condition.toLowerCase()}`}
            value={item.details}
            onChange={(e) => onDetailsChange(e.target.value)}
            className="mt-2"
          />
        )}
      </div>
    )
  }

  return (
    <AccordionContent>
      <div className="w-full">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Please provide information about worker's medical history.</p>
        </div>
        <div className="space-y-6">
          {medicalHistory.map((item, index) => (
            <HistoryItemComponent
              key={item.condition}
              item={item}
              onToggle={() => handleToggle(index)}
              onDetailsChange={(details) => handleDetailsChange(index, details)}
            />
          ))}
        </div>
          <Button className="mt-4" onClick={() => handleContinue('summary')}>
            {isSummaryActive ? 'Continue to Summary' : 'Continue'}
          </Button>
      </div>
    </AccordionContent>
  )
}
