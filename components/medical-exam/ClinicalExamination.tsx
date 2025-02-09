"use client";

import { AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDataWP } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ClinicalExaminationProps {
  isSummaryActive: boolean;
  handleContinue: (nextStep: string) => void;
}

export function ClinicalExamination({
  isSummaryActive,
  handleContinue,
}: ClinicalExaminationProps) {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
    trigger,
  } = useFormContext<FormDataWP>();
  const watchedValues = watch();

  const VISION_OPTIONS = [
    "6/5",
    "6/6",
    "6/9",
    "6/12",
    "6/18",
    "6/24",
    "6/36",
    "blind",
  ];

  // Calculate BMI function
  const calculateBMI = useCallback(
    (weight: number, height: number) => {
      if (weight > 0 && height > 0) {
        const bmiValue = weight / (height / 100) ** 2;
        setValue(
          "clinicalExamination.bmi",
          Number.parseFloat(bmiValue.toFixed(2))
        );
      } else {
        setValue("clinicalExamination.bmi", 0);
      }
    },
    [setValue]
  );

  // Calculate BMI on mount if weight and height exist
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        name === "clinicalExamination.weight" ||
        name === "clinicalExamination.height"
      ) {
        const weight = value.clinicalExamination?.weight as number;
        const height = value.clinicalExamination?.height as number;
        calculateBMI(weight, height);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, calculateBMI]);

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
                  {...register("clinicalExamination.weight", {
                    setValueAs: (value: string) => {
                      if (value === "") return undefined;
                      const num = Number(value);
                      return isNaN(num) ? undefined : num;
                    },
                    validate: (value) => {
                      if (value === undefined) return true;
                      return (
                        (value >= 15 && value <= 200) ||
                        "Weight must be between 15kg and 200kg"
                      );
                    },
                  })}
                  className="mr-2 mt-1 w-[216px]"
                  onBlur={() => trigger("clinicalExamination.weight")}
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                  kg
                </span>
              </div>
              {errors.clinicalExamination?.weight && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.clinicalExamination?.weight?.message ===
                  "Expected number, received nan"
                    ? "Please provide valid input"
                    : errors.clinicalExamination?.weight?.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <div className="relative max-w-[216px]">
                <Input
                  id="height"
                  type="number"
                  {...register("clinicalExamination.height", {
                    setValueAs: (value: string) => {
                      if (value === "") return undefined;
                      const num = Number(value);
                      return isNaN(num) ? undefined : num;
                    },
                    validate: (value) => {
                      if (value === undefined) return true;
                      return (
                        (value >= 90 && value <= 250) ||
                        "Height must be between 90cm and 250cm"
                      );
                    },
                  })}
                  className="mr-2 mt-1 w-[216px]"
                  onBlur={() => trigger("clinicalExamination.height")}
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                  cm
                </span>
              </div>
              {errors.clinicalExamination?.height && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.clinicalExamination?.height?.message ===
                  "Expected number, received nan"
                    ? "Please provide valid input"
                    : errors.clinicalExamination?.height?.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Label>BMI</Label>
            <div className="text-sm font-medium text-gray-500">
              {watch("clinicalExamination.bmi") || "-"}
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="waistCircumference">Waist Circumference</Label>
            <div className="flex items-start gap-2">
              <div className="relative max-w-[216px]">
                <Input
                  id="waistCircumference"
                  type="number"
                  {...register("clinicalExamination.waistCircumference", {
                    setValueAs: (value: string) => {
                      if (value === "") return undefined;
                      const num = Number(value);
                      return isNaN(num) ? undefined : num;
                    },
                    validate: (value, formValues) => {
                      if (value === undefined) return true;
                      const unit =
                        formValues.clinicalExamination?.waistUnit || "cm";
                      const cmValue = unit === "inch" ? value * 2.54 : value;
                      return (
                        (cmValue >= 50 && cmValue <= 200) ||
                        `Waist must be between ${
                          unit === "cm" ? "50-200 cm" : "20-79 inches"
                        }`
                      );
                    },
                  })}
                  className="mr-2 mt-1 w-[216px]"
                  onBlur={() =>
                    trigger("clinicalExamination.waistCircumference")
                  }
                />
              </div>
              <Select
                value={watch("clinicalExamination.waistUnit") || "cm"}
                onValueChange={(value) => {
                  const currentValue = watch(
                    "clinicalExamination.waistCircumference"
                  );
                  if (currentValue) {
                    const newValue =
                      value === "inch"
                        ? Number((currentValue / 2.54).toFixed(1))
                        : Number((currentValue * 2.54).toFixed(1));
                    setValue(
                      "clinicalExamination.waistCircumference",
                      newValue
                    );
                  }
                  setValue(
                    "clinicalExamination.waistUnit",
                    value as "cm" | "inch"
                  );
                }}
              >
                <SelectTrigger className="w-[80px] mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="inch">inch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.clinicalExamination?.waistCircumference && (
              <p className="text-red-500 text-sm mt-1">
                {errors.clinicalExamination?.waistCircumference?.message ===
                "Expected number, received nan"
                  ? "Please provide valid input"
                  : errors.clinicalExamination?.waistCircumference?.message}
              </p>
            )}
          </div>

          <div className="flex flex-start items-start gap-4 mt-4">
            <div>
              <Label htmlFor="systolicBP">Systolic BP</Label>
              <div className="relative max-w-[216px]">
                <Input
                  id="systolicBP"
                  type="number"
                  {...register("clinicalExamination.systolicBP", {
                    setValueAs: (value: string) => {
                      if (value === "") return undefined;
                      const num = Number(value);
                      return isNaN(num) ? undefined : num;
                    },
                    validate: (value) => {
                      if (value === undefined) return true;
                      return (
                        (value >= 30 && value <= 300) ||
                        "Systolic BP must be between 30 and 300"
                      );
                    },
                    valueAsNumber: true,
                  })}
                  className="mr-2 mt-1 w-[216px]"
                  onBlur={() => trigger("clinicalExamination.systolicBP")}
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                  mmHg
                </span>
              </div>
              {errors.clinicalExamination?.systolicBP && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.clinicalExamination?.systolicBP?.message ===
                  "Expected number, received nan"
                    ? "Please provide valid input"
                    : errors.clinicalExamination?.systolicBP?.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="diastolicBP">Diastolic BP</Label>
              <div className="relative max-w-[216px]">
                <Input
                  id="diastolicBP"
                  type="number"
                  {...register("clinicalExamination.diastolicBP", {
                    setValueAs: (value: string) => {
                      if (value === "") return undefined;
                      const num = Number(value);
                      return isNaN(num) ? undefined : num;
                    },
                    validate: (value) => {
                      if (value === undefined) return true;
                      return (
                        (value >= 30 && value <= 300) ||
                        "Diastolic BP must be between 30 and 300"
                      );
                    },
                    valueAsNumber: true,
                  })}
                  className="mr-2 mt-1 w-[216px]"
                  onBlur={() => trigger("clinicalExamination.diastolicBP")}
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500">
                  mmHg
                </span>
              </div>
              {errors.clinicalExamination?.diastolicBP && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.clinicalExamination?.diastolicBP?.message ===
                  "Expected number, received nan"
                    ? "Please provide valid input"
                    : errors.clinicalExamination?.diastolicBP?.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-start items-start gap-4 mt-4">
            <div>
              <Label htmlFor="rightEyeVision">Right Eye Vision</Label>
              <div className="w-[216px] mt-1">
                <Select
                  value={watch("clinicalExamination.rightEyeVision") || "6/5"}
                  onValueChange={(value) =>
                    setValue("clinicalExamination.rightEyeVision", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vision" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISION_OPTIONS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="leftEyeVision">Left Eye Vision</Label>
              <div className="w-[216px] mt-1">
                <Select
                  value={watch("clinicalExamination.leftEyeVision") || "6/5"}
                  onValueChange={(value) =>
                    setValue("clinicalExamination.leftEyeVision", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vision" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISION_OPTIONS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {/* <div className="grid grid-cols-[1fr,auto] gap-x-8 gap-y-4"> */}
            <p className="text-sm text-muted-foreground mb-2">
              Indicate <b>abnormal</b> or <b>positive/reactive</b> test results:
            </p>
            <div className="grid grid-cols-[210px,1fr] gap-x-8 gap-y-4 mt-4">
              <Label htmlFor="hearing">Cardiovascular System</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hearing"
                  checked={
                    watchedValues.clinicalExamination?.cardiovascularSystem ===
                    "abnormal"
                  }
                  {...register("clinicalExamination.cardiovascularSystem")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.cardiovascularSystem",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.cardiovascularSystem ===
                      "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.cardiovascularSystem ===
                      "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>
              <Label htmlFor="ecg">ECG</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ecg"
                  checked={
                    watchedValues.clinicalExamination?.ecg === "abnormal"
                  }
                  {...register("clinicalExamination.ecg")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.ecg",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.ecg === "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.ecg === "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="hearing">Anaemia</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="anaemia"
                  checked={
                    watchedValues.clinicalExamination?.anaemia === "abnormal"
                  }
                  {...register("clinicalExamination.anaemia")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.anaemia",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.anaemia === "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.anaemia === "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="hearing">Respiratory System</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="respiratory"
                  checked={
                    watchedValues.clinicalExamination?.respiratorySystem ===
                    "abnormal"
                  }
                  {...register("clinicalExamination.respiratorySystem")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.respiratorySystem",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.respiratorySystem ===
                      "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.respiratorySystem ===
                      "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="hearing">Gastrointestinal System</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="gastrointestinal"
                  checked={
                    watchedValues.clinicalExamination
                      ?.gastroIntestinalSystem === "abnormal"
                  }
                  {...register("clinicalExamination.gastroIntestinalSystem")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.gastroIntestinalSystem",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination
                      ?.gastroIntestinalSystem === "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination
                      ?.gastroIntestinalSystem === "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="neurologicalSystem">Neurological System</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="neurologicalSystem"
                  checked={
                    watchedValues.clinicalExamination?.neurologicalSystem ===
                    "abnormal"
                  }
                  {...register("clinicalExamination.neurologicalSystem")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.neurologicalSystem",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.neurologicalSystem ===
                      "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.neurologicalSystem ===
                      "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="skin">Skin (e.g. eczema, psoriasis)</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="skin"
                  checked={
                    watchedValues.clinicalExamination?.skin === "abnormal"
                  }
                  {...register("clinicalExamination.skin")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.skin",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.skin === "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.skin === "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="musculoskeletalSystem">
                Musculoskeletal System
              </Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="musculoskeletalSystem"
                  checked={
                    watchedValues.clinicalExamination?.musculoskeletalSystem ===
                    "abnormal"
                  }
                  {...register("clinicalExamination.musculoskeletalSystem")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.musculoskeletalSystem",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.musculoskeletalSystem ===
                      "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.musculoskeletalSystem ===
                      "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="neck">Neck (e.g. enlarged thyroid gland)</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="neck"
                  checked={
                    watchedValues.clinicalExamination?.neck === "abnormal"
                  }
                  {...register("clinicalExamination.neck")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.neck",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.neck === "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.neck === "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="genitourinarySystem">Genitourinary System</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="genitourinarySystem"
                  checked={
                    watchedValues.clinicalExamination?.genitourinarySystem ===
                    "abnormal"
                  }
                  {...register("clinicalExamination.genitourinarySystem")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.genitourinarySystem",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.genitourinarySystem ===
                      "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.genitourinarySystem ===
                      "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="mentalHealth">Mental Health</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="mentalHealth"
                  checked={
                    watchedValues.clinicalExamination?.mentalHealth ===
                    "abnormal"
                  }
                  {...register("clinicalExamination.mentalHealth")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.mentalHealth",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.mentalHealth ===
                      "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.mentalHealth ===
                      "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              {/* <Label htmlFor="urineAlbumin">Urine Albumin</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="urineAlbumin"
                  checked={
                    watchedValues.clinicalExamination?.urineAlbumin ===
                    "abnormal"
                  }
                  {...register("clinicalExamination.urineAlbumin")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.urineAlbumin",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.urineAlbumin ===
                      "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.urineAlbumin ===
                      "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="urineGlucose">Urine Glucose</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="urineGlucose"
                  checked={
                    watchedValues.clinicalExamination?.urineGlucose ===
                    "abnormal"
                  }
                  {...register("clinicalExamination.urineGlucose")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.urineGlucose",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.urineGlucose ===
                      "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.urineGlucose ===
                      "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="pregnancyTest">Pregnancy Test</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="pregnancyTest"
                  checked={
                    watchedValues.clinicalExamination?.pregnancyTest ===
                    "positive"
                  }
                  {...register("clinicalExamination.pregnancyTest")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.pregnancyTest",
                      checked ? "positive" : "negative"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.pregnancyTest ===
                      "positive"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.pregnancyTest ===
                      "positive"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Positive/Reactive
                </span>
              </div> */}

              <Label htmlFor="colorVision">
                Color Vision (For electricians & drivers only)
              </Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="colorVision"
                  checked={
                    watchedValues.clinicalExamination?.colorVision ===
                    "abnormal"
                  }
                  {...register("clinicalExamination.colorVision")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.colorVision",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.colorVision ===
                      "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.colorVision ===
                      "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="hearing">
                Hearing - ability to hear ordinary conversation at 2 metres
              </Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hearing"
                  checked={
                    watchedValues.clinicalExamination?.hearing === "abnormal"
                  }
                  {...register("clinicalExamination.hearing")}
                  onCheckedChange={(checked) => {
                    setValue(
                      "clinicalExamination.hearing",
                      checked ? "abnormal" : "normal"
                    );
                  }}
                  className={cn(
                    "border-2",
                    watchedValues.clinicalExamination?.hearing === "abnormal"
                      ? " border-red-600 data-[state=checked]:bg-red-600 text-primary-foreground hover:bg-red-400 hover:text-primary-foreground"
                      : "border-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    watchedValues.clinicalExamination?.hearing === "abnormal"
                      ? "text-red-500"
                      : "text-gray-500"
                  )}
                >
                  Abnormal
                </span>
              </div>

              <Label htmlFor="others">Other significant abnormalities</Label>
              <div className="w-full">
                <textarea
                  id="others"
                  className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none"
                  placeholder="Please provide any other relevant details"
                  {...register("clinicalExamination.others")}
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground">
                  {500 -
                    (watchedValues.clinicalExamination.others?.length ||
                      0)}{" "}
                  characters left
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      <Button
        className="mt-4"
        onClick={() => handleContinue(isSummaryActive ? "summary" : "tests")}
      >
        {isSummaryActive ? "Continue to Summary" : "Continue"}
      </Button>
    </AccordionContent>
  );
}
