import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop(); // Extract `id` from the URL

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    // Fetch both record and submission data in parallel
    const [record, submission] = await Promise.all([
      prisma.record.findUnique({
        where: { id },
      }),
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

    return NextResponse.json({ ...record, submission });
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
