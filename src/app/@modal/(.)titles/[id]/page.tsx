import { notFound } from "next/navigation";
import { MovieDetailsModal } from "@/components/titles/MovieDetailsModal";
import { getTitleDetailsBundle } from "@/lib/title-details";

interface InterceptedTitlePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: "movie" | "tv" }>;
}

export default async function InterceptedTitlePage({ params, searchParams }: InterceptedTitlePageProps) {
  const { id } = await params;
  const { type: queryType } = await searchParams;
  const type = queryType === "tv" ? "tv" : "movie";

  const titleId = parseInt(id, 10);
  if (isNaN(titleId)) {
    notFound();
  }

  const data = await getTitleDetailsBundle(titleId, type);
  if (!data) {
    notFound();
  }

  return (
    <MovieDetailsModal
      isModal={true}
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
