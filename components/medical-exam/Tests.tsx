"use client"

import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AccordionContent } from "@/components/ui/accordion"
import { FormDataWP } from "@/lib/schemas"


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
                    checked={watchedValues.tests?.radiological?.result === 'abnormal'}
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
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Please provide details"
                  {...register('tests.radiological.details')}
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground">
                  {500 - (watchedValues.tests.radiological.details?.length || 0)} characters left
                </p>
              </div>
            )}

            <div className="grid grid-cols-[1fr,auto] gap-x-8 gap-y-4 mt-3">
              <Label htmlFor="syphilis">Syphilis Screen (or other treponemal tests)</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="syphilis"
                  checked={watchedValues.tests?.syphilis === 'positive'}
                  {...register('tests.syphilis')}
                  onCheckedChange={(checked) => {
                    setValue('tests.syphilis', checked? 'positive': 'negative')
                  }}
                />
                <span className="text-sm text-gray-500">Positive/Reactive</span>
              </div>

              <Label htmlFor="malaria">Blood film for Malaria</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="malaria"
                  checked={watchedValues.tests?.malaria === 'positive'}
                  {...register('tests.malaria')}
                  onCheckedChange={(checked) => {
                    setValue('tests.malaria', checked? 'positive': 'negative')
                  }}
                />
                <span className="text-sm text-gray-500">Positive/Reactive</span>
              </div>

              <Label htmlFor="hiv">HIV screen</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hiv"
                  checked={watchedValues.tests?.hiv === 'positive'}
                  {...register('tests.hiv')}
                  onCheckedChange={(checked) => {
                    setValue('tests.hiv', checked? 'positive': 'negative')
                  }}
                />
                <span className="text-sm text-gray-500">Positive/Reactive</span>
              </div>

              <Label htmlFor="hba1c">HbA1c or Glucose (for age 40 and above, or
                with risk factors)</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hba1c"
                  checked={watchedValues.tests?.hba1c === 'abnormal'}
                  {...register('tests.hba1c')}
                  onCheckedChange={(checked) => {
                    setValue('tests.hba1c', checked? 'abnormal': 'normal')
                  }}
                />
                <span className="text-sm text-gray-500">Abnormal</span>
              </div>

              <Label htmlFor="lipids">Blood lipids (for age 40 and above, or with risk factors)</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="lipids"
                  checked={watchedValues.tests?.lipids === 'abnormal'}
                  {...register('tests.lipids')}
                  onCheckedChange={(checked) => {
                    setValue('tests.lipids', checked? 'abnormal': 'normal')
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
        onClick={() => handleContinue('summary')}
      >
        {isSummaryActive ? 'Continue to Summary' : 'Continue'}
      </Button>
    </AccordionContent>
  )
}
