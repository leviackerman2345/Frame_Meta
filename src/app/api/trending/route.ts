import { NextResponse } from "next/server";
import { getTrendingAll } from "@/lib/tmdb";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  try {
    const data = await getTrendingAll("day", page);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Failed to fetch trending titles:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending titles" },
      { status: 500 }
    );
  }
}
