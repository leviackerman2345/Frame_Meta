import { NextResponse } from "next/server";
import { getTVSeasonDetails } from "@/lib/tmdb";
import { enforceRateLimit } from "@/lib/api-guard";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; season_number: string }> }
) {
  const rateLimitResponse = enforceRateLimit(request, "tv-season", 30);
  if (rateLimitResponse) return rateLimitResponse;

  const { id, season_number } = await params;
  const tvId = parseInt(id, 10);
  const seasonNum = parseInt(season_number, 10);

  if (isNaN(tvId) || isNaN(seasonNum)) {
    return NextResponse.json({ error: "Invalid ID or Season Number" }, { status: 400 });
  }

  try {
    const data = await getTVSeasonDetails(tvId, seasonNum);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("TV Season API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch season details" },
      { status: 500 }
    );
  }
}
