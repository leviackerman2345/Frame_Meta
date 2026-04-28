import { NextResponse } from "next/server";
import { getTrendingAll } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");

  try {
    const data = await getTrendingAll("day", page);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch trending titles:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending titles" },
      { status: 500 }
    );
  }
}
