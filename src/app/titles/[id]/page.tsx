import { notFound } from "next/navigation";
import { MovieDetailsModal } from "@/components/titles/MovieDetailsModal";
import { getTitleDetailsBundle } from "@/lib/title-details";

interface TitlePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: "movie" | "tv" }>;
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

  return (
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
  );
}
