"use client";

import { AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Datepicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDataPR } from "@/lib/schemas";
import { useFormContext } from "react-hook-form";

interface PersonDetailsProps {
  isSummaryActive: boolean;
  handleContinue: (nextStep: string) => void;
  nextStep: string;
}

export function PersonDetails({
  isSummaryActive,
  handleContinue,
  nextStep,
}: PersonDetailsProps) {
  const {
    register,
    setValue,
    formState: { errors, touchedFields },
    watch,
    trigger,
    clearErrors,
  } = useFormContext<FormDataPR>();

  const watchedValues = watch();

  const handleFinBlur = async () => {
    await trigger("helperDetails.fin");
  };

  const handleNameBlur = async () => {
    await trigger("helperDetails.helperName");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow letters and ,-`'
    const sanitizedValue = value.replace(/[^a-zA-Z,\-`'\s]/g, "");
    if (value !== sanitizedValue) {
      e.target.value = sanitizedValue;
    }
  };

  const validateAllFields = async () => {
    // Clear previous errors
    clearErrors("helperDetails");

    // Set all fields as touched when validating all
    setValue("helperDetails", watchedValues.helperDetails, {
      shouldTouch: true,
      shouldValidate: true,
    });

    // Trigger validation for all fields
    const result = await trigger("helperDetails", { shouldFocus: true });

    return result;
  };

  return (
    <AccordionContent className="space-y-4">
      <div>
        <Label htmlFor="fin">FIN</Label>
        <div className="relative mb-1">
          <Input
            className="w-[200px] mt-1"
            id="fin"
            maxLength={9}
            {...register("helperDetails.fin", {
              onBlur: handleFinBlur,
            })}
          />
        </div>
        {touchedFields.helperDetails?.fin && errors.helperDetails?.fin && (
          <p className="text-red-500 font-medium text-sm">
            {errors.helperDetails.fin.message}
          </p>
        )}
      </div>

      <div className="mt-3">
        <Label htmlFor="personName">Person name</Label>
        <div className="w-[600px] mt-1 mb-3">
          <Input
            className="w-full"
            id="personName"
            maxLength={100}
            {...register("helperDetails.helperName", {
              required: "Person name is required",
              pattern: {
                value: /^[a-zA-Z,\-`'\s]*$/,
                message: "Name can only contain letters and ,-`'",
              },
              onBlur: handleNameBlur,
              onChange: handleNameChange,
            })}
          />
        </div>
        {touchedFields.helperDetails?.helperName &&
          errors.helperDetails?.helperName && (
            <p className="text-red-500 font-medium text-sm">
              {errors.helperDetails.helperName.message}
            </p>
          )}
      </div>

      <div className="mt-3">
        <div className="space-y-1">
          <Datepicker
            label="Date person visits the clinic"
            date={watchedValues.helperDetails.visitDate}
            onSelect={(date) => {
              setValue("helperDetails.visitDate", date as Date);
              if (errors.helperDetails?.visitDate) {
                trigger("helperDetails.visitDate");
              }
            }}
            disabled={(date) =>
              date > new Date() ||
              date < new Date(new Date().setDate(new Date().getDate() - 90))
            }
          />
          {touchedFields.helperDetails?.visitDate &&
            errors.helperDetails?.visitDate && (
              <p className="text-sm font-medium text-red-500">
                {errors.helperDetails.visitDate.message}
              </p>
            )}
        </div>
      </div>
      <div className="pt-4">
        <Button
          onClick={async (e) => {
            e.preventDefault(); // Prevent default form submission
            if (await validateAllFields()) {
              handleContinue(isSummaryActive ? "summary" : nextStep);
            }
          }}
        >
          {isSummaryActive ? "Continue to Summary" : "Continue"}
        </Button>
      </div>
    </AccordionContent>
  );
}
