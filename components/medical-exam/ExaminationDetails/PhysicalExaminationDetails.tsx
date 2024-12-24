import { Checkbox } from "@/components/ui/checkbox";
import { Label} from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Checkbox, Label, RadioGroup, RadioGroupItem } from "@/components/ui";

import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/schemas";
import { FileWarningIcon as WarningIcon } from 'lucide-react';

export function PhysicalExaminationDetails() {
  const { register, setValue, watch } = useFormContext<FormData>();
  const watchedValues = watch();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Physical examination details</h3>
      <div className="space-y-4">
        {/* ... suspicious injuries checkbox ... */}
        {/* ... unintentional weight loss checkbox ... */}
        {(watchedValues.examinationDetails.suspiciousInjuries || watchedValues.examinationDetails.unintentionalWeightLoss) && (
          <div>
            <Label htmlFor="police-report" className="text-sm font-medium mb-2 block">
              Have you made a police report?
            </Label>
            <RadioGroup 
              value={watchedValues.examinationDetails.policeReport || ''} 
              onValueChange={(value) => setValue('examinationDetails.policeReport', value as 'yes' | 'no')}
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
          </div>
        )}
      </div>
    </div>
  );
}