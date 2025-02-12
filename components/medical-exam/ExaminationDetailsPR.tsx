import { AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormDataMW } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface ExaminationDetailsProps {
  isSummaryActive: boolean;
  handleContinue: (nextStep: string) => void;
}

export function ExaminationDetails({
  isSummaryActive,
  handleContinue,
}: ExaminationDetailsProps) {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
    trigger,
    clearErrors,
  } = useFormContext<FormDataMW>();
  const watchedValues = watch();

  const testTypes: string[] = ["HIV", "Chest X-ray to screen for TB"];

  return (
    <AccordionContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Test results</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Indicate <b>positive</b> test results:
          </p>
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
                  checked={watchedValues.examinationDetails.positiveTests.includes(
                    test
                  )}
                  onCheckedChange={(checked) => {
                    const updatedTests = checked
                      ? [
                          ...watchedValues.examinationDetails.positiveTests,
                          test,
                        ]
                      : watchedValues.examinationDetails.positiveTests.filter(
                          (t) => t !== test
                        );
                    setValue("examinationDetails.positiveTests", updatedTests);
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.examinationDetails.positiveTests.includes(
                      test
                    )
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <Label
                  htmlFor={test}
                  className={cn(
                    "text-sm font-medium",
                    watchedValues.examinationDetails.positiveTests.includes(
                      test
                    )
                      ? "text-red-500"
                      : ""
                  )}
                >
                  Positive/Reactive
                </Label>
              </div>
            </div>
          ))}
          {testTypes.includes("HIV") && (
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
                checked={watchedValues.examinationDetails.remarks !== ""}
                onCheckedChange={(checked) => {
                  setValue("examinationDetails.remarks", checked ? " " : "");
                  if (!checked) {
                    clearErrors("examinationDetails.remarks");
                  }
                }}
                className={cn("border-2", "border-primary")}
              />
              <Label htmlFor="something-to-report">
                I have something else to report to ICA about the person
              </Label>
            </div>

            {watchedValues.examinationDetails.remarks !== "" && (
              <>
                <Textarea
                  placeholder="Enter any additional remarks here"
                  className="w-full"
                  {...register("examinationDetails.remarks", {
                    onChange: (e) => {
                      if (e.target.value === "") {
                        setValue("examinationDetails.remarks", " ");
                      }
                    },
                    onBlur: () => trigger("examinationDetails.remarks"),
                  })}
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground">
                  {501 -
                    (watchedValues.examinationDetails.remarks?.length ||
                      0)}{" "}
                  characters left
                </p>
              </>
            )}
          </div>
          {errors.examinationDetails?.remarks && (
            <p className="text-red-500 text-sm mt-1">
              {errors.examinationDetails.remarks.message}
            </p>
          )}
        </div>
      </div>
      <Button
        className="mt-4"
        onClick={async (e) => {
          e.preventDefault();
          const isValid = await trigger("examinationDetails.remarks");
          if (!isValid) return;
          handleContinue("summary");
        }}
      >
        {isSummaryActive ? "Continue to Summary" : "Continue"}
      </Button>
    </AccordionContent>
  );
}
