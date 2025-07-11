"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getRecordById, type RecordWithSubmission } from "@/app/actions/record";
import { Summary } from "@/components/Summary";
import { MedicalSummary } from "@/components/medical-summary";
import { clinics } from "@/constants/clinics";
import { doctors } from "@/constants/doctors";

export default function RecordView() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<RecordWithSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecord = async () => {
      try {
        const data = await getRecordById(params.id as string);
        console.log(data);
        setRecord(data);
      } catch (error) {
        console.error("Error loading record:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecord();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg mb-4">Record not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const formData = record?.submission?.formData as any;
  console.log("Form data from submission:", formData);
  // as unknown as
  //   | FormDataMW
  //   | FormDataWP
  //   | FormDataMDW;

  const type = record?.submission?.examType;
  console.log("exam type", type);
  console.log("record", record);

  const clinic = clinics.find(
    (c: { id: string }) => c.id === formData?.clinicDoctor?.clinic
  );

  const doctor = doctors.find(
    (d: { id: string }) => d.id === formData?.clinicDoctor?.doctor
  );

  const clinicDetails =
    clinic && doctor
      ? {
          clinic: clinic.name,
          doctor: doctor.name,
          hciCode: clinic.hciCode,
          contactNumber: clinic.contactNumber,
          mcrNumber: doctor.mcrNumber,
        }
      : undefined;

  const testTypes = formData?.examinationDetails?.testTypes;

  const testResults = testTypes?.map((test: any) => ({
    name: test,
    result: formData.examinationDetails.positiveTests.includes(test)
      ? "Positive/Reactive"
      : "Negative/Non-reactive",
  }));

  const examinationDetails = {
    ...formData?.examinationDetails,
    testResults,
  };

  const tests = formData?.tests;
  const clinicalExamination = formData?.clinicalExamination;
  const medicalHistory = formData?.medicalHistory;
  const fitnessAssessment = formData?.fitnessAssessment;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Records
        </Button>
        {/* <Button
          variant="outline"
          onClick={() => window.open(`/api/records/${params.id}/pdf`, '_blank')}
        >
          Download PDF
        </Button> */}
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Record Details</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* <div>
              <p className="text-sm text-gray-500">ID</p>
              <p>{record.foreignerId}</p>
            </div> */}
            <div>
              <p className="text-sm text-gray-500">Exam Name</p>
              <p>{record.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type Code</p>
              <p>{record.submission?.examType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date Created</p>
              <p>{new Date(record.dateCreated).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p>{new Date(record.lastUpdate).toLocaleDateString()}</p>
            </div>
          </div>

          {record.submission &&
            (record.submission.examType === "FMW" ||
              record.submission.examType === "MDW" ||
              record.submission.examType === "PR") && (
              <Summary
                type={record.submission.examType as "FMW" | "MDW" | "PR"}
                showStepIndicator={false}
                allowEdit={false}
                showTitle={false}
                showDeclaration={false}
                allowSubmit={false}
                clinicDetails={clinicDetails}
                helperDetails={formData.helperDetails}
                examinationDetails={examinationDetails}
                isSubmitting={false}
                onEdit={() => {}}
                onSubmit={() => {}}
              />
            )}
          {record.submission && record.submission.examType === "FME" && (
            <MedicalSummary
              showStepIndicator={false}
              allowEdit={false}
              showTitle={false}
              showDeclaration={false}
              allowSubmit={false}
              clinicDetails={clinicDetails}
              helperDetails={formData.helperDetails}
              clinicalExamination={clinicalExamination}
              medicalHistory={medicalHistory}
              tests={tests}
              fitnessAssessment={fitnessAssessment}
              isSubmitting={false}
              onEdit={() => {}}
              onSubmit={() => {}}
            />
          )}
          {!record.submission && (
            <div className="text-center py-8 text-gray-500">
              No submission details found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
