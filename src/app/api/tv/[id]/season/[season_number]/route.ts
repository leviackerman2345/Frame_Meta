import { NextResponse } from "next/server";
import { getTVSeasonDetails } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; season_number: string }> }
) {
  const { id, season_number } = await params;
  const tvId = parseInt(id, 10);
  const seasonNum = parseInt(season_number, 10);

  if (isNaN(tvId) || isNaN(seasonNum)) {
    return NextResponse.json({ error: "Invalid ID or Season Number" }, { status: 400 });
  }

  try {
    const data = await getTVSeasonDetails(tvId, seasonNum);
    return NextResponse.json(data);
  } catch (error) {
    console.error("TV Season API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch season details" },
      { status: 500 }
    );
  }
}
