import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AccordionContent } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useFormContext } from "react-hook-form"
import { FormDataMW } from "@/lib/schemas"

interface ExaminationDetailsProps {
  isSummaryActive: boolean
  handleContinue: (nextStep: string) => void
  testTypes: string[]
}

export function ExaminationDetails({ 
  isSummaryActive, 
  handleContinue, 
  testTypes
}: ExaminationDetailsProps) {
  const { register, setValue, formState: { errors }, watch } = useFormContext<FormDataMW>()
  const watchedValues = watch()

  return (
    <AccordionContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Test results</h3>
          <p className="text-sm text-muted-foreground mb-2">Indicate <b>positive</b> test results:</p>
          {testTypes.map((test) => (
            <div key={test} className="flex items-center mb-2">
              <Label
                htmlFor={test}
                className="flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-3/4"
              >
                {test}
              </Label>
              <div className="flex items-center space-x-2 ml-4 pl-24">
                <Checkbox
                  id={test}
                  checked={watchedValues.examinationDetails.positiveTests.includes(test)}
                  onCheckedChange={(checked) => {
                    const updatedTests = checked
                      ? [...watchedValues.examinationDetails.positiveTests, test]
                      : watchedValues.examinationDetails.positiveTests.filter((t) => t !== test);
                    setValue('examinationDetails.positiveTests', updatedTests);
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.examinationDetails.positiveTests.includes(test) 
                    ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground" 
                    : "border-primary"
                  )}
                />
                <Label
                  htmlFor={test}
                  className={cn(
                    "text-sm font-medium",
                    watchedValues.examinationDetails.positiveTests.includes(test) ? "text-red-500" : ""
                  )}
                >
                  Positive/Reactive
                </Label>
              </div>
            </div>
          ))}
          {testTypes.includes('HIV') && (
            <p className="text-sm text-muted-foreground mt-2">
              Note: HIV test must be done by an MOH-approved laboratory.
            </p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Remarks</h3>
          <div className="space-y-4">
            
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="something-to-report"
                  checked={watchedValues.examinationDetails.remarks !== ''}
                  onCheckedChange={(checked) => {
                    setValue('examinationDetails.remarks', checked ? ' ' : '');
                  }}
                  className={cn(
                    "border-2","border-primary"
                  )}
                />
                <Label htmlFor="something-to-report">
                  I have something else to report to ICA about the person
                </Label>
              </div>
            
              {(
              watchedValues.examinationDetails.remarks !== '') && (
              <>
                <Textarea
                  placeholder="Enter any additional remarks here"
                  className="w-full"
                  {...register('examinationDetails.remarks')}
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground">
                  {501 - (watchedValues.examinationDetails.remarks?.length || 0)} characters left
                </p>
              </>
            )}
          </div>
          {errors.examinationDetails?.remarks && <p className="text-red-500 text-sm mt-1">{errors.examinationDetails.remarks.message}</p>}
        </div>
      </div>
      <Button className="mt-4" onClick={() => handleContinue('summary')}>{isSummaryActive ? 'Continue to Summary' : 'Continue'}</Button>
    </AccordionContent>
  )
}

