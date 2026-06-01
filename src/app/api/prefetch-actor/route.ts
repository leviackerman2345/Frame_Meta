import { NextRequest, NextResponse } from "next/server";
import { getPersonBasicInfo } from "@/lib/tmdb";
import { enforceRateLimit } from "@/lib/api-guard";

/**
 * GET /api/prefetch-actor?id=<personId>
 *
 * Warms the server-side in-memory person cache by calling getPersonBasicInfo()
 * before the user actually navigates to /actor/[id].
 *
 * Called by CastCard on mouseEnter with { priority: "low" } so it never
 * blocks the main thread or competes with critical resources.
 *
 * Returns a minimal JSON response — the actual payload is irrelevant because
 * only the in-memory cache side-effect matters.
 */
export async function GET(request: NextRequest) {
  const rateLimitResponse = enforceRateLimit(request, "prefetch-actor", 20);
  if (rateLimitResponse) return rateLimitResponse;

  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Missing or invalid `id` query parameter." },
      { status: 400 }
    );
  }

  try {
    const person = await getPersonBasicInfo(id);
    // Return just the essential info to keep the response tiny
    return NextResponse.json(
      {
        ok: true,
        cached: Boolean(person?.id),
        name: person?.name ?? null,
      },
      {
        status: 200,
        headers: {
          // Allow browsers to cache this lightweight response for 60 seconds
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    // Never let a prefetch failure surface as an unhandled error
    console.error(`[prefetch-actor] Failed to prefetch person ${id}:`, error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
