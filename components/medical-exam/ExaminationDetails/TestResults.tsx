import { Checkbox, Label } from "@/components/ui";
import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/schemas";

export function TestResults({ testTypes }) {
  const { register, setValue, watch } = useFormContext<FormData>();
  const watchedValues = watch();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Test results</h3>
      <p className="text-sm text-muted-foreground mb-2">Indicate <b>positive</b> test results:</p>
      {testTypes.map((test) => (
        <div key={test} className="flex items-center mb-2">
          <Label htmlFor={test} className="flex-grow text-sm font-medium leading-none">
            {test}
          </Label>
          <Checkbox
            id={test}
            checked={watchedValues.examinationDetails.positiveTests.includes(test)}
            onCheckedChange={(checked) => {
              const updatedTests = checked
                ? [...watchedValues.examinationDetails.positiveTests, test]
                : watchedValues.examinationDetails.positiveTests.filter((t) => t !== test);
              setValue('examinationDetails.positiveTests', updatedTests);
            }}
          />
          <Label htmlFor={test} className="text-sm font-medium">
            Positive/Reactive
          </Label>
        </div>
      ))}
      {testTypes.includes('HIV') && (
        <p className="text-sm text-muted-foreground mt-2">
          Note: HIV test must be done by an MOH-approved laboratory.
        </p>
      )}
    </div>
  );
}