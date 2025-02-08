import { Record, Submission } from "@prisma/client";

export interface RecordWithSubmission extends Record {
  submission?: Submission | null;
}

export async function getRecordById(id: string): Promise<RecordWithSubmission> {
  console.log("getRecordById:", id);
  const response = await fetch(`/api/records/${id}`);
  // const baseUrl =
  //   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  // const response = await fetch(`${baseUrl}/api/records/${id}`);
  console.log("response:", response);

  if (!response.ok) {
    throw new Error("Failed to fetch record");
  }

  return response.json();
}
