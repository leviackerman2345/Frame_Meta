import { NextResponse } from "next/server";
import { getTrendingPeople } from "@/lib/tmdb";
import { curatedPeople } from "@/constants/people";
import { enforceRateLimit, sanitizePage } from "@/lib/api-guard";

export const dynamic = "force-dynamic";
export const revalidate = 600; // 10 minutes cache

export async function GET(request: Request) {
  // Enforce internal API rate limiting
  const rateLimited = enforceRateLimit(request, "api:people", 60, 60_000);
  if (rateLimited) return rateLimited;

  const { searchParams } = new URL(request.url);
  const page = sanitizePage(searchParams.get("page"));
  const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);

  try {
    const trending = await getTrendingPeople(limit);
    
    return NextResponse.json(
      {
        curated: curatedPeople,
        trending: trending,
        page: page,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
        },
      }
    );
  } catch (error) {
    console.error("[api:people] Failed to serve people API:", error);
    return NextResponse.json(
      { error: "Failed to fetch visionaries and trending talent." },
      { status: 500 }
    );
  }
}
