import { FinChangeModal } from "@/components/FinChangeModal";
import { AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Datepicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDataMDW, FormDataMW } from "@/lib/schemas";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

interface HelperDetailsProps {
  isSummaryActive: boolean;
  handleContinue: (nextStep: string) => void;
  handleFinChange: (value: string) => void;
  setFinTouched: (value: boolean) => void;
  setVisitDateTouched: (value: boolean) => void;
  finTouched: boolean;
  visitDateTouched: boolean;
  isPendingMe: boolean;
  nextStep: "examination-details" | "medical-history";
  requireVisitDate?: boolean;
  defaultToday?: boolean;
  sampleFin?: string;
  isLoading: boolean;
}

export function HelperDetails({
  isSummaryActive,
  handleContinue,
  handleFinChange,
  setFinTouched,
  setVisitDateTouched,
  finTouched,
  // visitDateTouched,
  isPendingMe,
  nextStep,
  requireVisitDate = true,
  defaultToday = false,
  sampleFin,
  isLoading = false,
}: HelperDetailsProps) {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
    trigger,
  } = useFormContext<FormDataMW | FormDataMDW>();
  const [isFinChangeModalOpen, setIsFinChangeModalOpen] = useState(false);
  const [pendingFinValue, setPendingFinValue] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);

  const watchedValues = watch();

  const handleFinBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!newValue) {
      // Don't trigger validation for empty value
      return;
    }

    if (
      watchedValues.helperDetails.helperName &&
      newValue !== watchedValues.helperDetails.fin
    ) {
      setPendingFinValue(newValue);
      setIsFinChangeModalOpen(true);
    } else {
      setIsValidating(true);
      handleFinChange(newValue);
      setFinTouched(true);
      await trigger("helperDetails.fin");
      setIsValidating(false);
    }
  };

  const handleFinChangeConfirm = async () => {
    setIsValidating(true);
    handleFinChange(pendingFinValue);
    setFinTouched(true);
    await trigger("helperDetails.fin");
    setIsValidating(false);
    setIsFinChangeModalOpen(false);
  };

  return (
    <AccordionContent>
      <div className="space-y-4">
        <div>
          <Label htmlFor="fin">FIN</Label>
          <span className="text-blue-500"> (Test FIN: {sampleFin})</span>
          <div className="relative">
            <Input
              className="w-[200px] mt-1"
              id="fin"
              {...register("helperDetails.fin")}
              onBlur={handleFinBlur}
              onChange={() => {}}
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-3 top-[60%] transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
          {finTouched && !isValidating && errors.helperDetails?.fin && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid FIN
            </p>
          )}
          {finTouched &&
            !isValidating &&
            !errors.helperDetails?.fin &&
            !isPendingMe && (
              <p className="text-red-500 text-sm mt-1">
                The person does not have a pending medical examination.
              </p>
            )}
        </div>
        {watchedValues.helperDetails.helperName && (
          <>
            <div className="border-l-2 border-gray-300 pl-4">
              <div>
                <Label>Person Name</Label>
                <p className="mt-2 text-sm">
                  {watchedValues.helperDetails.helperName}
                </p>
              </div>
            </div>
            {requireVisitDate && (
              <Datepicker
                label="Date person visits the clinic"
                date={
                  watchedValues.helperDetails.visitDate ||
                  (defaultToday ? new Date() : undefined)
                }
                onSelect={(date) => {
                  setValue("helperDetails.visitDate", date as Date);
                  setVisitDateTouched(true);
                  trigger("helperDetails.visitDate");
                }}
                disabled={(date) =>
                  date > new Date() ||
                  date < new Date(new Date().setDate(new Date().getDate() - 90))
                }
              />
            )}
          </>
        )}

        <Button
          className="mt-4"
          onClick={async (e) => {
            e.preventDefault(); // Prevent default form submission
            setFinTouched(true);
            setVisitDateTouched(true);
            const isFinValid = await trigger("helperDetails.fin");
            // const isDateValid = await trigger("helperDetails.visitDate");

            console.log("isFinValid=", isFinValid);
            // console.log("isDateValid=", isDateValid);
            console.log(watchedValues.helperDetails);

            if (isFinValid) {
              handleContinue(isSummaryActive ? "summary" : nextStep);
            }
          }}
        >
          {isSummaryActive ? "Continue to Summary" : "Continue"}
        </Button>
        {isFinChangeModalOpen && (
          <FinChangeModal
            isOpen={isFinChangeModalOpen}
            onConfirm={handleFinChangeConfirm}
            onClose={() => setIsFinChangeModalOpen(false)}
          />
        )}
      </div>
    </AccordionContent>
  );
}
