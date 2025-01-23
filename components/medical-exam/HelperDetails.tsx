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
import { FormDataMW,FormDataMDW  } from "@/lib/schemas"


interface HelperDetailsProps {
  isSummaryActive: boolean
  handleContinue: (nextStep: string) => void
  handleFinChange: (value: string) => void
  setFinTouched: (value: boolean) => void
  setVisitDateTouched: (value: boolean) => void
  finTouched: boolean
  visitDateTouched: boolean
  isPendingMe: boolean
}


export function HelperDetails({ 
  isSummaryActive, 
  handleContinue, 
  handleFinChange, 
  setFinTouched, 
  setVisitDateTouched,
  finTouched,
  visitDateTouched,
  isPendingMe
}: HelperDetailsProps) {
  const { register, setValue, formState: { errors }, watch, trigger }  = useFormContext<FormDataMW | FormDataMDW >()
  const watchedValues = watch()

  return (
    <AccordionContent>
      <div className="space-y-4">
        <div>
          <Label htmlFor="fin">FIN</Label>
          <Input className="w-1/5"
            id="fin"
            {...register('helperDetails.fin')}
            onBlur={(e) => {
              handleFinChange(e.target.value);
              setFinTouched(true);
              trigger('helperDetails.fin')
         }
            }
            onChange={() => {}}
            placeholder="Enter FIN (e.g., F1234567N)"
          />
          {finTouched && errors.helperDetails?.fin && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid FIN</p>
          )}
          {finTouched && !errors.helperDetails?.fin && !isPendingMe &&(
            <p className="text-red-500 text-sm mt-1">The person does not have a pending medical examination.</p>
          )}
        </div>
        {watchedValues.helperDetails.helperName && (
          <>
            <div className="border-l-2 border-gray-300 pl-4">
              <div>
              <Label>Person Name</Label>
              <p className="mt-2 text-sm">{watchedValues.helperDetails.helperName}</p>
            </div>
            <div>
              <Label htmlFor="visit-date">Date person visits the clinic</Label>
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
        onClick={async (e) => {
          e.preventDefault(); // Prevent default form submission
          setFinTouched(true);
          setVisitDateTouched(true);
          const isFinValid = await trigger('helperDetails.fin');
          const isDateValid = await trigger('helperDetails.visitDate');
          
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

