"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormDataWP } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AccordionContent } from "../ui/accordion";

const medicalHistoryItems = [
  {
    text: "Cardiovascular disease (e.g. ischemic heart disease)",
    placeholder:
      "Include details of any heart conditions, treatments, and current status",
  },
  {
    text: "Metabolic disease (diabetes, hypertension)",
    placeholder:
      "Specify type of diabetes/hypertension, medications, and control status",
  },
  {
    text: "Respiratory disease (e.g. tuberculosis, asthma)",
    placeholder:
      "Include respiratory condition details, frequency of symptoms, and treatments",
  },
  {
    text: "Gastrointestinal disease (e.g. peptic ulcer disease)",
    placeholder:
      "Describe digestive conditions, symptoms, and current management",
  },
  {
    text: "Neurological disease (e.g. epilepsy, stroke)",
    placeholder:
      "Include details of neurological conditions, frequency of episodes if any",
  },
  {
    text: "Mental health condition (e.g. depression)",
    placeholder:
      "Describe mental health conditions, treatments, and current status",
  },
  {
    text: "Other medical condition",
    placeholder: "Specify any other medical conditions and their details",
  },
  {
    text: "Previous surgeries",
    placeholder: "List surgeries with dates and any ongoing effects",
  },
  {
    text: "Long-term medications",
    placeholder: "List medications that are taken daily for at least a months",
  },
  {
    text: "Smoking History (tobacco)",
    placeholder: "Quantify in pack-years",
  },
  {
    text: "Other lifestyle risk factors or significant family history",
    placeholder:
      "Describe relevant lifestyle factors or family medical history",
  },
  {
    text: "Previous infections of concern (e.g. COVID-19)",
    placeholder: "Include date of infection",
  },
];

type HistoryItem = {
  condition: string;
  hasCondition: boolean;
  details: string;
};

interface MedicalHistoryProps {
  isSummaryActive: boolean;
  handleContinue: (nextStep: string) => void;
}

export function MedicalHistory({
  isSummaryActive,
  handleContinue,
}: MedicalHistoryProps) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<FormDataWP>();

  const [medicalHistory, setMedicalHistory] = useState<HistoryItem[]>(
    medicalHistoryItems.map((item) => ({
      condition: item.text,
      hasCondition: false,
      details: "",
    }))
  );

  const handleToggle = (index: number) => {
    const updatedHistory = medicalHistory.map((item, i) =>
      i === index ? { ...item, hasCondition: !item.hasCondition } : item
    );
    setMedicalHistory(updatedHistory);
    setValue("medicalHistory", updatedHistory);
  };

  const handleDetailsChange = (index: number, details: string) => {
    const updatedHistory = medicalHistory.map((item, i) =>
      i === index ? { ...item, details } : item
    );
    setMedicalHistory(updatedHistory);
    setValue("medicalHistory", updatedHistory);
  };

  return (
    <AccordionContent>
      <div className="w-full">
        <p className="text-sm text-gray-500">
          Please provide information about worker&apos;s medical history.
        </p>
        <div className="space-y-6">
          {medicalHistory.map((item, index) => (
            <HistoryItemComponent
              key={item.condition}
              item={item}
              index={index}
              onToggle={() => handleToggle(index)}
              onDetailsChange={(details) => handleDetailsChange(index, details)}
            />
          ))}
        </div>
        {errors.medicalHistory && (
          <p className="text-sm text-red-500">
            {errors.medicalHistory.message}
          </p>
        )}
        <Button
          className="mt-4"
          onClick={() => {
            setValue("medicalHistory", medicalHistory);
            handleContinue(
              isSummaryActive ? "summary" : "clinical-examination"
            );
          }}
        >
          {isSummaryActive ? "Continue to Summary" : "Continue"}
        </Button>
      </div>
    </AccordionContent>
  );
}

function HistoryItemComponent({
  item,
  index,
  onToggle,
  onDetailsChange,
}: {
  item: HistoryItem;
  index: number;
  onToggle: () => void;
  onDetailsChange: (details: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr,auto] gap-x-8 gap-y-4">
        <Label htmlFor={`checkbox-${item.condition}`}>
          {item.condition}
        </Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`checkbox-${item.condition}`}
            checked={item.hasCondition}
            onCheckedChange={onToggle}
            className={cn(
              "border-2",
              item.hasCondition
                ? "border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                : "border-primary"
            )}
          />
          <span
            className={cn(
              "text-sm",
              item.hasCondition ? "text-red-500" : "text-gray-500"
            )}
          >
            Yes
          </span>
        </div>
      </div>
      {item.hasCondition && (
        <div className="mt-2 w-full">
          <Textarea
            value={item.details}
            onChange={(e) => onDetailsChange(e.target.value)}
            placeholder={medicalHistoryItems[index].placeholder}
            className="w-full min-h-[100px]"
          />
        </div>
      )}
    </div>
  );
}
