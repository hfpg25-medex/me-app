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
          {/* <div className="grid grid-cols-3 gap-4"> */}
          <div className="flex flex-start items-start gap-4">
            <div>
              <Label htmlFor="weight">Weight</Label>
              <div className="relative max-w-[216px]">
              <Input
                id="weight"
                type="number"
                {...register('clinicalExamination.weight', { 
                  valueAsNumber: true,
                  validate: (value) => !value || (value >= 15 && value <= 200) || "Weight must be between 15kg and 200kg"
                })}
                className="mr-2 mt-1 pr-12 w-[216px]"
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
              <div className="relative max-w-[240px]">
              <Input
                id="height"
                type="number"
                {...register('clinicalExamination.height', { valueAsNumber: true })}
                className="mr-2 mt-1 pr-12 w-[216px]"
              />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                cm
            </span>
            </div>
            </div>
          </div>

          <div className="mt-4">
            <Label>BMI</Label>
            <div className="text-sm font-medium text-gray-500">
              {watch('clinicalExamination.bmi') || '-'}
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="waistCircumference">Waist Circumference</Label>
            <div className="relative max-w-[216px]">
              <Input
                id="waistCircumference"
                type="number"
                {...register('clinicalExamination.waistCircumference', { valueAsNumber: true })}
                className="mr-2 mt-1 pr-12 w-[216px]"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                cm
              </span>
            </div>
          </div>

          <div className="flex flex-start items-start gap-4 mt-4">
            <div>
              <Label htmlFor="systolicBP">Systolic BP</Label>
              <div className="relative max-w-[216px]">
              <Input
                id="systolicBP"
                type="number"
                {...register('clinicalExamination.systolicBP', { valueAsNumber: true })}
                className="mr-2 mt-1 pr-12 w-[216px]"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                mmHg
              </span>
              </div>
            </div>
            <div>
              <Label htmlFor="diastolicBP">Diastolic BP</Label>
              <div className="relative max-w-[216px]">
              <Input
                id="diastolicBP"
                type="number"
                {...register('clinicalExamination.diastolicBP', { valueAsNumber: true })}
                className="mr-2 mt-1 pr-12 w-[216px]"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                mmHg
              </span>
              </div>
            </div>          
            </div>

          <div className="flex flex-start items-start gap-4 mt-4">
                <div>
                  <Label htmlFor="rightEyeVision">Right Eye Vision</Label>
                  <div className="w-[216px] mt-1">
                  <Select 
                    defaultValue="6/5"
                    onValueChange={(value) => setValue('clinicalExamination.rightEyeVision', value)}
                    >
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
          <div>
            <Label htmlFor="leftEyeVision">Left Eye Vision</Label>
            <div className="w-[216px] mt-1">
            <Select 
                defaultValue="6/5"
                onValueChange={(value) => setValue('clinicalExamination.leftEyeVision', value)}
            >
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
          </div>

          <div className="mt-6">
            {/* <div className="grid grid-cols-[1fr,auto] gap-x-8 gap-y-4"> */}
            <div className="grid grid-cols-[210px,1fr] gap-x-8 gap-y-4 mt-4">
              <Label htmlFor="urineAlbumin">Urine Albumin</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="urineAlbumin"
                  {...register('clinicalExamination.urineAlbumin')}
                  onCheckedChange={(checked) => {
                    setValue('clinicalExamination.urineAlbumin', checked? 'abnormal': 'normal')
                  }}
                />
                <span className="text-sm text-gray-500">Abnormal</span>
              </div>

              <Label htmlFor="urineGlucose">Urine Glucose</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="urineGlucose"
                  {...register('clinicalExamination.urineGlucose')}
                  onCheckedChange={(checked) => {
                    setValue('clinicalExamination.urineGlucose', checked? 'abnormal': 'normal')
                  }}
                />
                <span className="text-sm text-gray-500">Abnormal</span>
              </div>

              <Label htmlFor="pregnancyTest">Pregnancy Test</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="pregnancyTest"
                  {...register('clinicalExamination.pregnancyTest')}
                  onCheckedChange={(checked) => {
                    setValue('clinicalExamination.pregnancyTest', checked? 'positive': 'negative')
                  }}
                />
                <span className="text-sm text-gray-500">Positive</span>
              </div>

              <Label htmlFor="colorVision">Color Vision</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="colorVision"
                  {...register('clinicalExamination.colorVision')}
                  onCheckedChange={(checked) => {
                    setValue('clinicalExamination.colorVision', checked? 'abnormal': 'normal')
                  }}
                />
                <span className="text-sm text-gray-500">Abnormal</span>
              </div>

              <Label htmlFor="hearing">Hearing</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hearing"
                  {...register('clinicalExamination.hearing')}
                  onCheckedChange={(checked) => {
                    setValue('clinicalExamination.hearing', checked? 'abnormal': 'normal')
                  }}
                />
                <span className="text-sm text-gray-500">Abnormal</span>
              </div>
            </div>
          </div>        
          </div>
      </div>
      <Button 
        className="mt-4" 
        onClick={() => handleContinue('tests')}
      >
        {isSummaryActive ? 'Continue to Summary' : 'Continue'}
      </Button>
    </AccordionContent>
  )
}
