import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const dateRange = searchParams.get("dateRange") || undefined;

    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: any = {};

    if (search) {
      where.OR = [
        { foreignerId: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (dateRange) {
      const [start, end] = dateRange.split(",").map((date) => new Date(date));
      where.dateCreated = {
        gte: start,
        lte: end,
      };
    }

    // Get records with pagination
    const [records, total] = await Promise.all([
      prisma.record.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          dateCreated: "desc",
        },
      }),
      prisma.record.count({ where }),
    ]);

    return NextResponse.json({
      records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}
