import { Textarea, Checkbox, Label } from "@/components/ui";
import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/schemas";

export function Remarks() {
  const { register, watch, setValue } = useFormContext<FormData>();
  const watchedValues = watch();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Remarks</h3>
      <div className="space-y-4">
        {/* ... checkbox for additional remarks ... */}
        {(watchedValues.examinationDetails.suspiciousInjuries ||
          watchedValues.examinationDetails.unintentionalWeightLoss ||
          watchedValues.examinationDetails.remarks !== '') && (
          <>
            <Textarea
              placeholder="Enter any additional remarks here"
              className="w-full"
              {...register('examinationDetails.remarks')}
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground">
              {500 - (watchedValues.examinationDetails.remarks?.length || 0)} characters left
            </p>
          </>
        )}
      </div>
    </div>
  );
}