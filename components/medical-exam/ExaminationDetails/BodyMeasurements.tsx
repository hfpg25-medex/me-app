import { useState } from 'react';
import { Input} from "@/components/ui/input";
import { Label} from "@/components/ui/label";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/schemas";
import { FileWarningIcon as WarningIcon } from 'lucide-react';

export function BodyMeasurements({ lastRecordedWeight, lastRecordedHeight }) {
  const { register, setValue, formState: { errors }, watch, trigger } = useFormContext<FormData>();
  const watchedValues = watch();
  const [showWeightWarningState, setShowWeightWarning] = useState(false);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Body measurements</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <div className="flex items-center">
            <Input
              id="weight"
              type="number"
              {...register('examinationDetails.weight', { 
                valueAsNumber: true,
                validate: (value) => !value || (value >= 15 && value <= 200) || "Weight must be between 15kg and 200kg"
              })}
              onBlur={(e) => {
                const newWeight = e.target.value ? parseFloat(e.target.value) : null;
                setValue('examinationDetails.weight', newWeight);
                // ... existing logic ...
              }}
              placeholder="Enter weight"
              className="mr-2 w-40"
            />
            <span>kg</span>
          </div>
          {/* ... existing weight warning and last recorded weight logic ... */}
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <div className="flex items-center">
            <Input
              id="height"
              type="number"
              {...register('examinationDetails.height', { valueAsNumber: true })}
              placeholder="Enter height"
              className="mr-2 w-40"
            />
            <span>cm</span>
          </div>
          {/* ... existing height error and last recorded height logic ... */}
        </div>
        {watchedValues.examinationDetails.bmi !== null && (
          <div>
            <Label>BMI</Label>
            <p>{watchedValues.examinationDetails.bmi}</p>
          </div>
        )}
      </div>
    </div>
  );
}