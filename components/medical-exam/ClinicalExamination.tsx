"use client"

import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AccordionContent } from "@/components/ui/accordion"
import { FormDataWP } from "@/lib/schemas"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


interface ClinicalExaminationProps {
  isSummaryActive: boolean
  handleContinue: (nextStep: string) => void
}

export function ClinicalExamination({ isSummaryActive, handleContinue }: ClinicalExaminationProps) {
  const { register, setValue, formState: { errors }, watch } = useFormContext<FormDataWP>()
  const watchedValues = watch()

  const VISION_OPTIONS = ['6/5', '6/6', '6/9', '6/12', '6/18', '6/24', '6/36', 'blind']

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "clinicalExamination.weight" || name === "clinicalExamination.height") {
        const weight = value.clinicalExamination?.weight as number
        const height = value.clinicalExamination?.height as number
        if (weight > 0 && height > 0) {
          const bmiValue = weight / (height / 100) ** 2
          setValue("clinicalExamination.bmi", Number.parseFloat(bmiValue.toFixed(2)))
        } else {
          setValue("clinicalExamination.bmi", 0)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue])

  return (
    <AccordionContent>
      <div className="space-y-6">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight</Label>
              <div className="relative">
              <Input
                id="weight"
                type="number"
                {...register('clinicalExamination.weight', { 
                  valueAsNumber: true,
                  validate: (value) => !value || (value >= 15 && value <= 200) || "Weight must be between 15kg and 200kg"
                })}
                className="mr-2 pr-12"
              />
             <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                kg
            </span>
            </div>
              {errors.clinicalExamination?.weight && (
                <p className="text-red-500 text-sm mt-1">{errors.clinicalExamination?.weight?.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <div className="relative">
              <Input
                id="height"
                type="number"
                {...register('clinicalExamination.height', { valueAsNumber: true })}
                className="mr-2 pr-12"
              />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                cm
            </span>
            </div>
            </div>
          </div>

          <div className="mt-4">
            <Label>BMI</Label>
            <div className="text-lg font-medium text-gray-500">
              {watch('clinicalExamination.bmi') || '-'}
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="waistCircumference">Waist Circumference</Label>
            <div className="relative">
              <Input
                id="waistCircumference"
                type="number"
                {...register('clinicalExamination.waistCircumference', { valueAsNumber: true })}
                className="mr-2 pr-12"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                cm
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="systolicBP">Systolic BP</Label>
              <div className="relative">
              <Input
                id="systolicBP"
                type="number"
                {...register('clinicalExamination.systolicBP', { valueAsNumber: true })}
                className="mr-2 pr-12"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                mmHg
              </span>
              </div>
            </div>
            <div>
              <Label htmlFor="diastolicBP">Diastolic BP</Label>
              <div className="relative">
              <Input
                id="diastolicBP"
                type="number"
                {...register('clinicalExamination.diastolicBP', { valueAsNumber: true })}
                className="mr-2 pr-12"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                mmHg
              </span>
              </div>
            </div>          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="rightEyeVision">Right Eye Vision</Label>
                  <Select defaultValue="6/5">
                    <SelectTrigger>
                        <SelectValue placeholder="Select vision" />
                    </SelectTrigger>
                    <SelectContent>
                        {VISION_OPTIONS.map((value) => (
                            <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>            
                </div>            
          <div>
            <Label htmlFor="leftEyeVision">Left Eye Vision</Label>
            <Select defaultValue="6/5">
              <SelectTrigger>
                  <SelectValue placeholder="Select vision" />
              </SelectTrigger>
              <SelectContent>
                  {VISION_OPTIONS.map((value) => (
                      <SelectItem key={value} value={value}>{value}</SelectItem>
                  ))}
              </SelectContent>
            </Select>            
          </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-[1fr,auto] items-center gap-x-8">
              <Label htmlFor="urineAlbumin">Urine Albumin</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="urineAlbumin"
                  {...register('clinicalExamination.urineAlbumin')}
                />
                <span>Positive/reactive</span>
              </div>
            </div>
            <div className="grid grid-cols-[1fr,auto] items-center gap-x-8">
              <Label htmlFor="urineGlucose">Urine Glucose</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="urineGlucose"
                  {...register('clinicalExamination.urineGlucose')}
                />
                <span>Positive/reactive</span>
              </div>
            </div>

            <div className="grid grid-cols-[1fr,auto] items-center gap-x-8">
              <Label htmlFor="pregnancyTest">Pregnancy Test</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="pregnancyTest"
                  {...register('clinicalExamination.pregnancyTest')}
                />
                <span>Positive/reactive</span>
              </div>
            </div>

            <div className="grid grid-cols-[1fr,auto] items-center gap-x-8">
              <Label htmlFor="colorVision">Color Vision</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="colorVision"
                  {...register('clinicalExamination.colorVision')}
                />
                <span>Abnormal</span>
              </div>
            </div>

            <div className="grid grid-cols-[1fr,auto] items-center gap-x-8">
              <Label htmlFor="hearing">Hearing</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hearing"
                  {...register('clinicalExamination.hearing')}
                />
                <span>Abnormal</span>
              </div>
            </div>
          </div>        
          </div>
      </div>
      <Button 
        className="mt-4" 
        onClick={() => handleContinue('examination-details')}
      >
        {isSummaryActive ? 'Continue to Summary' : 'Continue'}
      </Button>
    </AccordionContent>
  )
}
