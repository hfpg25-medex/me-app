import { getDraft } from "@/app/actions/getDraft";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const draftId = request.nextUrl.pathname.split("/").pop();
  if (!draftId) {
    return NextResponse.json(
      { error: "Missing Draft ID parameter" },
      { status: 400 }
    );
  }
  try {
    const result = await getDraft(draftId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error in draft API route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
