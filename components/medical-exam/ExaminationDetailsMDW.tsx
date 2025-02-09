import { AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { FormDataMDW } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TriangleAlert as WarningIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface ExaminationDetailsProps {
  isSummaryActive: boolean;
  handleContinue: (nextStep: string) => void;
  setWeightTouched: (value: boolean) => void;
  weightTouched: boolean;
  // showWeightWarning: boolean
  lastRecordedWeight: number | null;
  lastRecordedHeight: number | null;
  testTypes: string[];
}

export function ExaminationDetails({
  isSummaryActive,
  handleContinue,
  setWeightTouched,
  // weightTouched,
  // showWeightWarning,
  lastRecordedWeight,
  lastRecordedHeight,
  testTypes,
}: ExaminationDetailsProps) {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
    trigger,
  } = useFormContext<FormDataMDW>();
  const watchedValues = watch();
  const [showWeightWarning, setShowWeightWarning] = useState(false);

  return (
    <AccordionContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Body measurements</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="weight"
                  type="number"
                  onInput={(e) => {
                    if (e.currentTarget.value.length > 3) {
                      e.currentTarget.value = e.currentTarget.value.slice(0, 3);
                    }
                  }}
                  {...register("examinationDetails.weight")}
                  onBlur={async (e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setValue("examinationDetails.weight", value);
                      if (lastRecordedWeight && value >= 15) {
                        setShowWeightWarning(value <= 0.9 * lastRecordedWeight);
                      } else {
                        setShowWeightWarning(false);
                      }
                      // Clear error if value is valid
                      await trigger("examinationDetails.weight");
                    }
                    setWeightTouched(true);
                  }}
                  onChange={() => {}}
                  // onBlur={() => {
                  //   setWeightTouched(true);
                  //   trigger('examinationDetails.weight');
                  // }}
                  placeholder="Enter weight"
                  className="mr-2 w-40"
                />
                <span>kg</span>
              </div>
              {errors.examinationDetails?.weight && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.examinationDetails.weight.message}
                </span>
              )}
              {showWeightWarning && (
                <div className="flex items-start space-x-2 p-3 bg-orange-100 border border-orange-300 rounded-md mt-2">
                  <WarningIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-500">
                    This helper has lost {">"}=10% weight since the last
                    examination. If her weight loss was unintentional or if its
                    reason cannot be determined, please select {"Yes"} for
                    weight loss under the Physical examination details.
                  </div>
                </div>
              )}
              {lastRecordedWeight && (
                <p className="text-sm text-muted-foreground mt-1">
                  Last recorded weight: {lastRecordedWeight} kg (Date:{" "}
                  {format(
                    new Date(new Date().setMonth(new Date().getMonth() - 6)),
                    "dd/MM/yyyy"
                  )}
                  )
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="height"
                  onInput={(e) => {
                    if (e.currentTarget.value.length > 3) {
                      e.currentTarget.value = e.currentTarget.value.slice(0, 3);
                    }
                  }}
                  type="number"
                  {...register("examinationDetails.height")}
                  placeholder="Enter height"
                  className="mr-2 w-40"
                />
                <span>cm</span>
              </div>
              {/* {errors.examinationDetails?.height && <p className="text-red-500 text-sm mt-1">{errors.examinationDetails.height.message}</p>} */}
              {lastRecordedHeight && (
                <p className="text-sm text-muted-foreground mt-1">
                  Last recorded height: {lastRecordedHeight} cm (Date:{" "}
                  {format(
                    new Date().setMonth(new Date().getMonth() - 6),
                    "dd/MM/yyyy"
                  )}
                  )
                </p>
              )}
            </div>
            {watchedValues.examinationDetails.bmi !== null && (
              <div>
                <Label>BMI</Label>
                <p>{watchedValues.examinationDetails.bmi}</p>
              </div>
            )}
          </div>
        </div>
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
                    "text-sm",
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
          <h3 className="text-lg font-semibold mb-2">
            Physical examination details
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <Label
                  htmlFor="suspicious-injuries"
                  className="flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-3/4"
                >
                  Signs of suspicious or unexplained injuries
                </Label>
                <div className="flex items-center space-x-2 ml-auto pl-24">
                  <Checkbox
                    id="suspicious-injuries"
                    checked={
                      watchedValues.examinationDetails.suspiciousInjuries
                    }
                    onCheckedChange={(checked) => {
                      setValue(
                        "examinationDetails.suspiciousInjuries",
                        checked as boolean
                      );
                      if (
                        !checked &&
                        !watchedValues.examinationDetails
                          .unintentionalWeightLoss
                      ) {
                        setValue("examinationDetails.policeReport", null);
                      }
                    }}
                    className={cn(
                      "border-2",
                      watchedValues.examinationDetails.suspiciousInjuries
                        ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                        : "border-primary"
                    )}
                  />
                  <Label
                    htmlFor="suspicious-injuries"
                    className={cn(
                      "text-sm",
                      watchedValues.examinationDetails.suspiciousInjuries
                        ? "text-red-500"
                        : ""
                    )}
                  >
                    Yes
                  </Label>
                </div>
              </div>
              {watchedValues.examinationDetails.suspiciousInjuries && (
                <p className="text-orange-500 text-sm mt-1 flex items-center">
                  <WarningIcon className="w-4 h-4 mr-1" />
                  Provide your assessment in the remarks section.
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Label
                  htmlFor="unintentional-weight-loss"
                  className="flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-3/4"
                >
                  Unintentional weight loss (if unsure, select yes)
                </Label>
                <div className="flex items-center space-x-2 ml-auto pl-24">
                  <Checkbox
                    id="unintentional-weight-loss"
                    checked={
                      watchedValues.examinationDetails.unintentionalWeightLoss
                    }
                    onCheckedChange={(checked) => {
                      setValue(
                        "examinationDetails.unintentionalWeightLoss",
                        checked as boolean
                      );
                      if (
                        !checked &&
                        !watchedValues.examinationDetails.suspiciousInjuries
                      ) {
                        setValue("examinationDetails.policeReport", null);
                      }
                    }}
                    className={cn(
                      "border-2",
                      watchedValues.examinationDetails.unintentionalWeightLoss
                        ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                        : "border-primary"
                    )}
                  />
                  <Label
                    htmlFor="unintentional-weight-loss"
                    className={cn(
                      "text-sm ",
                      watchedValues.examinationDetails.unintentionalWeightLoss
                        ? "text-red-500"
                        : ""
                    )}
                  >
                    Yes
                  </Label>
                </div>
              </div>
              {watchedValues.examinationDetails.unintentionalWeightLoss && (
                <p className="text-orange-500 text-sm mt-1 flex items-center">
                  <WarningIcon className="w-4 h-4 mr-1" />
                  Provide your assessment in the remarks section.
                </p>
              )}
            </div>
            {(watchedValues.examinationDetails.suspiciousInjuries ||
              watchedValues.examinationDetails.unintentionalWeightLoss) && (
              <div>
                <Label
                  htmlFor="police-report"
                  className="text-sm font-medium mb-2 block"
                >
                  Have you made a police report?
                </Label>
                <RadioGroup
                  value={watchedValues.examinationDetails.policeReport || ""}
                  onValueChange={(value) =>
                    setValue(
                      "examinationDetails.policeReport",
                      value as "yes" | "no"
                    )
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="police-report-yes" />
                    <Label htmlFor="police-report-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="police-report-no" />
                    <Label htmlFor="police-report-no">No</Label>
                  </div>
                </RadioGroup>
                {errors.examinationDetails?.policeReport && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.examinationDetails.policeReport.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Remarks</h3>
          <div className="space-y-4">
            {!watchedValues.examinationDetails.suspiciousInjuries &&
              !watchedValues.examinationDetails.unintentionalWeightLoss && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="something-to-report"
                    checked={watchedValues.examinationDetails.remarks !== ""}
                    onCheckedChange={(checked) => {
                      setValue(
                        "examinationDetails.remarks",
                        checked ? " " : ""
                      );
                    }}
                    className={cn("border-2", "border-primary")}
                  />
                  <Label htmlFor="something-to-report">
                    I have something else to report to MOM about the helper
                  </Label>
                </div>
              )}
            {(watchedValues.examinationDetails.suspiciousInjuries ||
              watchedValues.examinationDetails.unintentionalWeightLoss ||
              watchedValues.examinationDetails.remarks !== "") && (
              <>
                <Textarea
                  placeholder="Enter any additional remarks here"
                  className="w-full"
                  {...register("examinationDetails.remarks")}
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground">
                  {500 -
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
        onClick={async () => {
          const isValid = await trigger("examinationDetails");
          if (isValid) {
            handleContinue("summary");
          }
        }}
      >
        {isSummaryActive ? "Continue to Summary" : "Continue"}
      </Button>
    </AccordionContent>
  );
}
