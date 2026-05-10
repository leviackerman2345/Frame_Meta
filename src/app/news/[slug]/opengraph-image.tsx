// ---------------------------------------------------------------------------
// FIX 2 — Dynamic OG (Open Graph) image for news articles.
//
// WHAT OG IMAGES DO:
// When a user shares a link on Twitter/X, iMessage, Slack, Discord, LinkedIn,
// or any other platform, the platform fetches a preview image from the URL in
// the <meta property="og:image"> tag. Without a custom image, platforms either
// show a blank card or a tiny favicon — both dramatically reduce click-through
// rates. A well-designed OG image with the article headline and a brand mark
// can increase social CTR by 3–5× compared to a blank card.
//
// WHY opengraph-image.tsx (not a static PNG):
// Next.js App Router's file-based OG image convention generates a *different*
// image per article slug at build time (static) or on-demand (dynamic). This
// file at src/app/news/[slug]/opengraph-image.tsx automatically serves its
// output at /news/[slug]/opengraph-image — Next.js wires the <meta> tags for
// you when generateMetadata() references this path.
//
// WHY edge runtime:
// The Edge Runtime starts in ~0 ms (no cold boot). OG images are fetched by
// crawlers and social scrapers, not browsers — they have no warm cache. Edge
// eliminates the cold start latency that would cause Twitter/X to time out and
// fall back to a blank card.
// ---------------------------------------------------------------------------

import { ImageResponse } from "next/og";
import { getNewsBySlug } from "@/lib/news";

// Edge runtime for near-zero cold starts — critical for social scrapers.
export const runtime = "edge";

// Standard OG image dimensions required by all major platforms.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OGImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OGImage({ params }: OGImageProps) {
  const { slug } = await params;

  // Attempt to fetch the article — fall back to a branded fallback if it fails.
  let title = "FrameMeta";
  let description = "The world's best film and TV discovery platform.";
  let author = "";
  let date = "";
  let imageUrl: string | undefined;

  try {
    const article = await getNewsBySlug(slug);
    if (article) {
      title = article.title;
      description = article.description ?? article.content ?? "";
      author = article.author ?? "";
      date = article.date ?? "";
      imageUrl = article.imageUrl;
    }
  } catch {
    // Silently fall through to the branded fallback design below.
  }

  // Truncate long headlines to avoid overflow at the OG canvas size.
  const displayTitle = title.length > 80 ? title.slice(0, 77) + "…" : title;
  const displayDesc =
    description.length > 120 ? description.slice(0, 117) + "…" : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "#09090b", // zinc-950 — matches site dark theme
          position: "relative",
          overflow: "hidden",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Full-bleed article background image with dark overlay */}
        {imageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.25, // Muted so text stays legible
              }}
            />
            {/* Gradient overlay: darkens the bottom two-thirds for text contrast */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(9,9,11,0.4) 0%, rgba(9,9,11,0.85) 50%, rgba(9,9,11,0.98) 100%)",
              }}
            />
          </>
        )}

        {/* FrameMeta brand mark — top-left corner */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 56,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Simple "F" monogram as brand mark */}
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>F</span>
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            FrameMeta
          </span>
        </div>

        {/* Main content — positioned in the lower half of the canvas */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 56px 56px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Article headline */}
          <div
            style={{
              color: "#ffffff",
              fontSize: title.length > 60 ? 42 : 52,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {displayTitle}
          </div>

          {/* Description / abstract */}
          {displayDesc && (
            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 20,
                fontWeight: 500,
                lineHeight: 1.5,
                marginTop: 4,
              }}
            >
              {displayDesc}
            </div>
          )}

          {/* Author + date row */}
          {(author || date) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginTop: 8,
              }}
            >
              {author && (
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  {author}
                </div>
              )}
              {author && date && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                  }}
                />
              )}
              {date && (
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {date}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Indigo accent line along the left edge — matches site's accent color */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            background: "linear-gradient(to bottom, #6366f1, #8b5cf6)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
