import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AccordionContent } from "@/components/ui/accordion"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useFormContext } from "react-hook-form"
import { FormData } from "@/lib/schemas"

interface HelperDetailsProps {
  isSummaryActive: boolean
  handleContinue: (nextStep: string) => void
  handleFinChange: (value: string) => void
  setFinTouched: (value: boolean) => void
  setVisitDateTouched: (value: boolean) => void
  finTouched: boolean
  visitDateTouched: boolean
}

export function HelperDetails({ 
  isSummaryActive, 
  handleContinue, 
  handleFinChange, 
  setFinTouched, 
  setVisitDateTouched,
  finTouched,
  visitDateTouched
}: HelperDetailsProps) {
  const { register, setValue, formState: { errors }, watch, trigger } = useFormContext<FormData>()
  const watchedValues = watch()

  return (
    <AccordionContent>
      <div className="space-y-4 w-1/5">
        <div>
          <Label htmlFor="fin">FIN</Label>
          <Input
            id="fin"
            {...register('helperDetails.fin')}
            onChange={(e) => {
              handleFinChange(e.target.value);
              // setFinTouched(true);
            }}
            onBlur={() => setFinTouched(true)}
            placeholder="Enter FIN (e.g., F1234567N)"
          />
          {finTouched && errors.helperDetails?.fin && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid FIN</p>
          )}
        </div>
        {watchedValues.helperDetails.helperName && (
          <>
            <div className="border-l-2 border-gray-300 pl-4">
              <div>
              <Label>Helper Name</Label>
              <p className="mt-2 text-sm">{watchedValues.helperDetails.helperName}</p>
            </div>
            <div>
              <Label htmlFor="visit-date">Date helper visits the clinic</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watchedValues.helperDetails.visitDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchedValues.helperDetails.visitDate ? format(watchedValues.helperDetails.visitDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watchedValues.helperDetails.visitDate}
                    onSelect={(date) => {
                      setValue('helperDetails.visitDate', date as Date);
                      setVisitDateTouched(true);
                      trigger('helperDetails.visitDate');  // Trigger validation
                    }}
                    disabled={(date) => 
                      date > new Date() || date < new Date(new Date().setDate(new Date().getDate() - 90))
                    }
                  />
                </PopoverContent>
              </Popover>
              {visitDateTouched && watchedValues.helperDetails.visitDate && errors.helperDetails?.visitDate && (
                <p className="text-red-500 text-sm mt-1">{errors.helperDetails.visitDate.message}</p>
              )}
            </div>
            </div>
          </>
        )}
        
      <Button 
        className="mt-4" 
        onClick={() => {
          setFinTouched(true);
          setVisitDateTouched(true);
          const isFinValid = trigger('helperDetails.fin');
          const isDateValid = trigger('helperDetails.visitDate');
          
          if (isFinValid && isDateValid) {
            handleContinue(isSummaryActive ? 'summary' : 'examination-details');
          }
        }} 
      >
        {isSummaryActive ? 'Continue to Summary' : 'Continue'}
      </Button>
      </div>
    </AccordionContent>
  )
}

