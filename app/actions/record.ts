import { Record, Submission } from "@prisma/client";

export interface RecordWithSubmission extends Record {
  submission?: Submission | null;
}

export async function getRecordById(id: string): Promise<RecordWithSubmission> {
  const response = await fetch(`/api/records/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch record");
  }

  return response.json();
}
