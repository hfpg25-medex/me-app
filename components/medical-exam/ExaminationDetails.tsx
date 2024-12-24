import { BodyMeasurements } from '@/components/medical-exam/ExaminationDetails/BodyMeasurements';
import { TestResults } from '@/components/medical-exam/ExaminationDetails/TestResults';
import { PhysicalExaminationDetails } from '@/components/medical-exam/ExaminationDetails/PhysicalExaminationDetails';
import { Remarks } from '@/components/medical-exam/ExaminationDetails/Remarks';
import { AccordionContent } from '../ui/accordion';
import { Button } from '../ui/button';

export function ExaminationDetails({ 
  isSummaryActive, 
  handleContinue, 
  setWeightTouched,
  weightTouched,
  showWeightWarning,
  lastRecordedWeight,
  lastRecordedHeight,
  testTypes
}: ExaminationDetailsProps) {
  return (
    <AccordionContent>
      <div className="space-y-6">
        <TestResults testTypes={testTypes} />
        <Remarks />
      </div>
      <Button className="mt-4" onClick={() => handleContinue('summary')}>{isSummaryActive ? 'Continue to Summary' : 'Continue'}</Button>
    </AccordionContent>
  );
}