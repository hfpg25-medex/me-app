import { RecordPDF } from "@/components/RecordPDF";
import { prisma } from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop(); // Extract `id` from the URL
    console.log("id", id);

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    // console.log("GET /api/records/[id]/pdf:", id);

    // const record = await getRecordById(id);
    // if (!record) {
    //   return new NextResponse("Record not found", { status: 404 });
    // }

    // const pdfStream = await renderToStream(<RecordPDF record={record} />);
    // const pdfStream = await renderToStream(
    //   createElement(RecordPDF, { record })
    // );
    // Fetch both record and submission data in parallel
    const [record] = await Promise.all([
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
    const pdfStream = await renderToStream(RecordPDF({ record }));

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(
        Buffer.isBuffer(chunk)
          ? new Uint8Array(chunk)
          : new TextEncoder().encode(chunk)
      );
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF buffer with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="record-${record.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
