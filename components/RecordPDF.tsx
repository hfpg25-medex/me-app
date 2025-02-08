import { type RecordWithSubmission } from "@/app/actions/record";
import { clinics } from "@/constants/clinics";
import { doctors } from "@/constants/doctors";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 150,
    fontSize: 12,
    color: "#666666",
  },
  value: {
    flex: 1,
    fontSize: 12,
  },
  testResult: {
    marginBottom: 5,
    fontSize: 12,
  },
});

interface RecordPDFProps {
  record: RecordWithSubmission;
}

export function RecordPDF({ record }: RecordPDFProps) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const formData = record?.submission?.formData as any;

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
  const testResults = testTypes?.map((test: string) => ({
    name: test,
    result: formData.examinationDetails.positiveTests.includes(test)
      ? "Positive/Reactive"
      : "Negative/Non-reactive",
  }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Record Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{record.type}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date Created:</Text>
            <Text style={styles.value}>
              {new Date(record.dateCreated).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Last Updated:</Text>
            <Text style={styles.value}>
              {new Date(record.lastUpdate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {record.submission && (
          <>
            {clinicDetails && (
              <View style={styles.section}>
                <Text style={styles.heading}>Clinic Details</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Clinic:</Text>
                  <Text style={styles.value}>{clinicDetails.clinic}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Doctor:</Text>
                  <Text style={styles.value}>{clinicDetails.doctor}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>HCI Code:</Text>
                  <Text style={styles.value}>{clinicDetails.hciCode}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Contact Number:</Text>
                  <Text style={styles.value}>
                    {clinicDetails.contactNumber}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>MCR Number:</Text>
                  <Text style={styles.value}>{clinicDetails.mcrNumber}</Text>
                </View>
              </View>
            )}

            {formData?.helperDetails && (
              <View style={styles.section}>
                <Text style={styles.heading}>Helper Details</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>
                    {formData.helperDetails.name}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Passport Number:</Text>
                  <Text style={styles.value}>
                    {formData.helperDetails.passportNumber}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Date of Birth:</Text>
                  <Text style={styles.value}>
                    {formData.helperDetails.dateOfBirth}
                  </Text>
                </View>
              </View>
            )}

            {formData?.examinationDetails && (
              <View style={styles.section}>
                <Text style={styles.heading}>Examination Details</Text>
                {testResults?.map(
                  (test: { name: string; result: string }, index: number) => (
                    <Text key={index} style={styles.testResult}>
                      {test.name}: {test.result}
                    </Text>
                  )
                )}
              </View>
            )}
          </>
        )}
      </Page>
    </Document>
  );
}
