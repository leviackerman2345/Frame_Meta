import { NextResponse } from "next/server";
import { getTrendingAll } from "@/lib/tmdb";
import { enforceRateLimit, sanitizePage } from "@/lib/api-guard";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  const rateLimited = enforceRateLimit(request, "api:trending", 60, 60_000);
  if (rateLimited) return rateLimited;

  const { searchParams } = new URL(request.url);
  const page = sanitizePage(searchParams.get("page"));

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
