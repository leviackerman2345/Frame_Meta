import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MovieDetailsModal } from "@/components/titles/MovieDetailsModal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getTitleDetailsBundle } from "@/lib/title-details";

interface TitlePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: "movie" | "tv" }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: TitlePageProps): Promise<Metadata> {
  const { id } = await params;
  const { type = "movie" } = await searchParams;
  const titleId = parseInt(id, 10);
  if (isNaN(titleId)) return { title: "Not Found" };

  const data = await getTitleDetailsBundle(titleId, type);
  if (!data) return { title: "Not Found" };

  const title = data.details.title || data.details.name || "Untitled";
  const description =
    data.details.overview?.slice(0, 160) ||
    `Explore ${title} on FrameMeta — ratings, cast, trailers, and streaming providers.`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://framemeta.app";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | FrameMeta`,
      description,
      images: data.backdropUrl ? [data.backdropUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: data.backdropUrl ? [data.backdropUrl] : [],
    },
    alternates: { canonical: `${baseUrl}/titles/${id}` },
  };
}

export default async function TitlePage({ params, searchParams }: TitlePageProps) {
  const { id } = await params;
  const { type = "movie" } = await searchParams;

  const titleId = parseInt(id, 10);
  if (isNaN(titleId)) {
    notFound();
  }

  // Fetch full details, logo, recommendations, and reviews in parallel
  const data = await getTitleDetailsBundle(titleId, type);
  if (!data) {
    notFound();
  }

  const title = data.details.title || data.details.name || "Untitled";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const genres = data.details.genres?.map((g: any) => g.name).filter(Boolean) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const directors = data.crew?.filter((c: any) => c.job === "Director").map((c: any) => c.name).filter(Boolean) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actors = data.cast?.slice(0, 5).map((c: any) => c.name).filter(Boolean) || [];
  const releaseDate = data.details.release_date || data.details.first_air_date;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://framemeta.app";

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": type === "tv" ? "TVSeries" : "Movie",
    name: title,
    description: data.details.overview || "",
    image: data.backdropUrl || undefined,
    datePublished: releaseDate || undefined,
    genre: genres.length > 0 ? genres.join(", ") : undefined,
    aggregateRating: data.rating && data.rating !== "N/A"
      ? { "@type": "AggregateRating", ratingValue: data.rating, bestRating: 10 }
      : undefined,
    director: directors.length > 0
      ? directors.map((name: string) => ({ "@type": "Person", name }))
      : undefined,
    actor: actors.length > 0
      ? actors.map((name: string) => ({ "@type": "Person", name }))
      : undefined,
    url: `${baseUrl}/titles/${id}`,
  };

  return (
    <>
      <JsonLd schema={jsonLdSchema} />
      <MovieDetailsModal
      isModal={false}
      type={type}
      details={data.details}
      logoUrl={data.logoUrl}
      backdropUrl={data.backdropUrl}
      rating={data.rating}
      year={data.year}
      runtimeStr={data.runtimeStr}
      certification={data.certification}
      providers={data.providers}
      watchLink={data.watchLink}
      inCinema={data.inCinema}
      recommendations={data.recommendations}
      cast={data.cast}
      crew={data.crew}
      omdbRatings={data.omdbRatings}
      reviews={data.reviews}
    />
    </>
  );
}
