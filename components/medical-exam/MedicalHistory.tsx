"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { AccordionContent } from "../ui/accordion"
import { useFormContext } from "react-hook-form"
import { FormDataWP } from "@/lib/schemas"



const historyItems = [
  "Cardiovascular disease (e.g. ischemic heart disease)",
  "Metabolic disease (diabetes, hypertension)",
  "Respiratory disease (e.g. tuberculosis, asthma)",
  "Gastrointestinal disease (e.g. peptic ulcer disease)",
  "Neurological disease (e.g. epilepsy, stroke)",
  "Mental health condition (e.g. depression)",
  "Other medical condition",
  "Previous surgeries",
  "Long-term medications",
  "Smoking History (tobacco)",
  "Other lifestyle risk factors or significant family history",
  "Previous infections of concern (e.g. COVID-19)"
]

type HistoryItem = {
  condition: string
  hasCondition: boolean
  details: string
}

interface MedicalHistoryProps {
  isSummaryActive: boolean
  handleContinue: (nextStep: string) => void
}

export function MedicalHistory({ 
  isSummaryActive, 
  handleContinue, 
}: MedicalHistoryProps) {
    const { register, setValue, formState: { errors } } = useFormContext<FormDataWP>()
  
  const [medicalHistory, setMedicalHistory] = useState<HistoryItem[]>(
    historyItems.map((item) => ({ condition: item, hasCondition: false, details: "" })),
  )

  const handleToggle = (index: number) => {
    setMedicalHistory((prev) =>
      prev.map((item, i) => (i === index ? { ...item, hasCondition: !item.hasCondition } : item)),
    )
  }

  const handleDetailsChange = (index: number, details: string) => {
    setMedicalHistory((prev) => prev.map((item, i) => (i === index ? { ...item, details } : item)))
  }

  return (
    <AccordionContent>
      <div className="w-full">
        <p className="text-sm text-gray-500">Please provide information about worker's medical history.</p>
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
        {errors.medicalHistory && (
          <p className="text-sm text-red-500">{errors.medicalHistory.message}</p>
        )}
        <Button className="mt-4" onClick={() => handleContinue(isSummaryActive ? 'summary' : 'clinical-examination')}>
          {isSummaryActive ? 'Continue to Summary' : 'Continue'}
        </Button>
      </div>
    </AccordionContent>
  )
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
    <div className="space-y-1">
      <div className="flex items-start space-x-2">
        <Checkbox id={`checkbox-${item.condition}`} checked={item.hasCondition} onCheckedChange={onToggle} />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor={`checkbox-${item.condition}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {item.condition}
          </Label>
          <span className="text-sm text-muted-foreground">{item.hasCondition ? "Yes" : "No"}</span>
        </div>
      </div>
      {item.hasCondition && (
        <Textarea
          placeholder={`Please provide details about your ${item.condition.toLowerCase()}`}
          value={item.details}
          onChange={(e) => onDetailsChange(e.target.value)}
          className="mt-1"
        />
      )}
    </div>
  )
}

