import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Fetch both record and submission data in parallel
    const [record, submission] = await Promise.all([
      // Get record details
      prisma.record.findUnique({
        where: { id },
      }),
      // Get submission details
      prisma.submission.findFirst({
        where: { record: { id } },
        select: {
          id: true,
          examType: true,
          formData: true,
          submissionId: true,
          updatedAt: true,
          status: true,
        },
      }),
    ]);

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...record,
      submission,
    });
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
