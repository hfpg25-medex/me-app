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


interface TestsProps {
  isSummaryActive: boolean
  handleContinue: (nextStep: string) => void
}

export function Tests({ isSummaryActive, handleContinue }: TestsProps) {
  const { register, setValue, formState: { errors }, watch } = useFormContext<FormDataWP>()
  const watchedValues = watch()

  return (
    <AccordionContent>
      <div className="space-y-6">
        <div>
          <div>
            <div className="grid grid-cols-[1fr,auto] gap-x-8 gap-y-4">
              <Label htmlFor="radiological">Radiological (eg. Chest X-ray – to be taken in Singapore)</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="radiological"
                    {...register('tests.radiological.result')}
                    onCheckedChange={(checked) => {
                      setValue('tests.radiological.result', checked? 'abnormal': 'normal')
                    }}
                  />
                  <span className="text-sm text-gray-500 mr-[49px]">Abnormal</span>
                </div>
              </div>
            </div>
            {watchedValues.tests?.radiological?.result === 'abnormal' && (
              <div className="mt-2 w-full">
                <textarea
                  id="radiologicalDetails"
                  className="w-full min-h-[80px] p-2 border rounded-md"
                  placeholder="Please provide details"
                  {...register('tests.radiological.details')}
                />
              </div>
            )}

            <div className="grid grid-cols-[1fr,auto] gap-x-8 gap-y-4 mt-3">
              <Label htmlFor="syphilis">Syphilis Screen (or other treponemal tests)</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="syphilis"
                  {...register('tests.syphilis')}
                />
                <span className="text-sm text-gray-500">Positive/Reactive</span>
              </div>

              <Label htmlFor="malaria">Blood film for Malaria</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="malaria"
                  {...register('tests.malaria')}
                />
                <span className="text-sm text-gray-500">Positive/Reactive</span>
              </div>

              <Label htmlFor="hiv">HIV screen</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hiv"
                  {...register('tests.hiv')}
                />
                <span className="text-sm text-gray-500">Positive/Reactive</span>
              </div>

              <Label htmlFor="hba1c">HbA1c or Glucose (for age 40 and above, or
                with risk factors)</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hba1c"
                  {...register('tests.hba1c')}
                />
                <span className="text-sm text-gray-500">Abnormal</span>
              </div>

              <Label htmlFor="lipids">Blood lipids (for age 40 and above, or with risk factors)</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="lipids"
                  {...register('tests.lipids')}
                />
                <span className="text-sm text-gray-500">Abnormal</span>
              </div>
            </div>
          </div>        
        </div>
      </div>
      <Button 
        className="mt-4" 
        onClick={() => handleContinue('summary')}
      >
        {isSummaryActive ? 'Continue to Summary' : 'Continue'}
      </Button>
    </AccordionContent>
  )
}
