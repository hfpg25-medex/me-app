"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AccordionContent } from "../ui/accordion"
import { useFormContext } from "react-hook-form"
import { FormDataWP } from "@/lib/schemas"

const historyItems = [
  { id: 1, text: "Cardiovascular disease (e.g. ischemic heart disease)", placeholder: "Include details of any heart conditions, treatments, and current status" },
  { id: 2, text: "Metabolic disease (diabetes, hypertension)", placeholder: "Specify type of diabetes/hypertension, medications, and control status" },
  { id: 3, text: "Respiratory disease (e.g. tuberculosis, asthma)", placeholder: "Include respiratory condition details, frequency of symptoms, and treatments" },
  { id: 4, text: "Gastrointestinal disease (e.g. peptic ulcer disease)", placeholder: "Describe digestive conditions, symptoms, and current management" },
  { id: 5, text: "Neurological disease (e.g. epilepsy, stroke)", placeholder: "Include details of neurological conditions, frequency of episodes if any" },
  { id: 6, text: "Mental health condition (e.g. depression)", placeholder: "Describe mental health conditions, treatments, and current status" },
  { id: 7, text: "Other medical condition", placeholder: "Specify any other medical conditions and their details" },
  { id: 8, text: "Previous surgeries", placeholder: "List surgeries with dates and any ongoing effects" },
  { id: 9, text: "Long-term medications", placeholder: "List medications that are taken daily for at least a months" },
  { id: 10, text: "Smoking History (tobacco)", placeholder: "Quantify in pack-years" },
  { id: 11, text: "Other lifestyle risk factors or significant family history", placeholder: "Describe relevant lifestyle factors or family medical history" },
  { id: 12, text: "Previous infections of concern (e.g. COVID-19)", placeholder: "Include date of infection" }
]

interface MedicalHistoryProps {
  isSummaryActive: boolean
  handleContinue: (nextStep: string) => void
}

type HistoryItem = {
  id: number; // Add ID field
  condition: string;
  hasCondition: boolean;
  details: string;
};
export function MedicalHistory({ 
  isSummaryActive, 
  handleContinue, 
}: MedicalHistoryProps) {
  const { register, setValue, formState: { errors }, watch } = useFormContext<FormDataWP>()
  // const [medicalHistory, setMedicalHistory] = useState<HistoryItem[]>(
  //   historyItems.map((item) => ({ condition: item.text, hasCondition: false, details: "" })),
  // )
  // const [medicalHistory, setMedicalHistory] = useState<HistoryItem[]>(
  //   historyItems.map((item) => ({ id: item.id, condition: item.text, hasCondition: false, details: "" })),
  // );
  const [medicalHistory, setMedicalHistory] = useState<HistoryItem[]>([])

  // useEffect(() => {
  //   setValue('medicalHistory', medicalHistory);
  // }, [medicalHistory, setValue]);
  useEffect(() => {
    // Set initial state after hydration
    setMedicalHistory(
      historyItems.map((item) => ({ id: item.id, condition: item.text, hasCondition: false, details: "" }))
    )
  }, [])

  useEffect(() => {
    if (medicalHistory.length > 0) {
      setValue('medicalHistory', medicalHistory)
    }
  }, [medicalHistory, setValue])


  const watchedValues = watch()

  const handleToggle = (index: number) => {
    setMedicalHistory((prev) =>
      prev.map((item, i) => (i === index ? { ...item, hasCondition: !item.hasCondition } : item)),
    )
    // setValue('medicalHistory',medicalHistory)
  }

  const handleDetailsChange = (index: number, details: string) => {
    setMedicalHistory((prev) => prev.map((item, i) => (i === index ? { ...item, details } : item)))
  }

  function HistoryItemComponent({
    item,
    index,
    onToggle,
    onDetailsChange,
  }: {
    item: HistoryItem
    index: number
    onToggle: () => void
    onDetailsChange: (details: string) => void
  }) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-start gap-8">
          <Label
            htmlFor={`toggle-${item.condition}`}
            className="text-sm w-[400px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {item.condition}
          </Label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`toggle-${item.condition}`}
              name={`toggle-${item.condition}`}
              checked={item.hasCondition}
              onChange={onToggle}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor={`toggle-${item.condition}`} className="text-sm">Yes</Label>
          </div>
        </div>
        
        {item.hasCondition && (
          <div>
          <Textarea
            placeholder={historyItems[index].placeholder}
            value={item.details}
            onChange={(e) => onDetailsChange(e.target.value)}
            className="mt-2 w-[502px] min-h-[100px]"
            maxLength={500}
            {...register(`medicalHistory.${index}.details`)}
          />
          <p className="text-sm text-muted-foreground">
            {500 - item.details.length} characters left
          </p>
          </div>
        )}
        
      </div>
    )
  }
  return (
    <AccordionContent>
      <div className="w-full">
          <p className="text-sm text-gray-500">Please provide information about worker's medical history.</p>
        <div className="space-y-6">
          {medicalHistory.map((item, index) => (
            <HistoryItemComponent
              key={historyItems[index].id}
              item={item}
              index={index}
              onToggle={() => handleToggle(index)}
              onDetailsChange={(details) => handleDetailsChange(index, details)}
            />
          ))}
        </div>
        {errors.medicalHistory && (
          <p className="text-sm text-red-500">{errors.medicalHistory.message}</p>
        )}
          <Button className="mt-4" onClick={() => handleContinue(isSummaryActive? 'summary': 'clinical-examination')}>
            {isSummaryActive ? 'Continue to Summary' : 'Continue'}
          </Button>
      </div>
    </AccordionContent>
  )
}