import { NextResponse } from "next/server";
import { getPersonBasicInfo, getPersonCredits } from "@/lib/tmdb";
import { getCuratedPersonById } from "@/constants/people";
import { enforceRateLimit } from "@/lib/api-guard";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache individual artists for 1 hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Enforce internal API rate limiting
  const rateLimited = enforceRateLimit(request, `api:people:detail:${id}`, 60, 60_000);
  if (rateLimited) return rateLimited;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Missing or invalid artist ID parameter." },
      { status: 400 }
    );
  }

  try {
    const [person, credits] = await Promise.all([
      getPersonBasicInfo(id),
      getPersonCredits(id),
    ]);

    if (!person || !person.id) {
      return NextResponse.json(
        { error: "Artist not found." },
        { status: 404 }
      );
    }

    const curated = getCuratedPersonById(id);

    return NextResponse.json(
      {
        person: person,
        credits: credits,
        curated: curated || null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error(`[api:people:${id}] Failed to serve artist detail API:`, error);
    return NextResponse.json(
      { error: "Failed to fetch artist details." },
      { status: 500 }
    );
  }
}
