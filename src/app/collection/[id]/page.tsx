import { notFound } from "next/navigation";
import { getCollectionOrUniverseDetails } from "@/lib/tmdb";
import { CollectionDetailsExtended } from "@/components/collections/CollectionDetailsExtended";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const data = await getCollectionOrUniverseDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-black text-white selection:bg-intent-cyan/30 font-sans">
      <Navbar />
      <div className="flex-1 w-full font-sans text-white">
        <CollectionDetailsExtended data={data} />
      </div>
      <Footer />
    </main>
  );
}
