import { ContentPage } from "@/components/ui/ContentPage";

export default function NetflixPage() {
  return (
    <ContentPage
      title="Netflix"
      category="Platform"
      description="The full Netflix catalog — originals, licensed titles, and hidden gems — curated through FrameMeta's quality-first lens. Browse by what's actually good, not just what's being promoted."
      sections={[
        {
          heading: "Netflix on FrameMeta",
          body: "Netflix has one of the largest content libraries in streaming, with thousands of titles across every genre. FrameMeta cuts through the noise by ranking Netflix's catalog by critical quality, technical presentation, and audience satisfaction — so you can find the best of what's available without algorithmic guesswork.",
          list: [
            "Quality-ranked catalog — every Netflix title scored by our multi-source methodology.",
            "Technical specs — see which titles are available in 4K, HDR, Dolby Vision, and Dolby Atmos.",
            "Original vs. licensed — filter between Netflix Originals and licensed content.",
            "Hidden gems — high-quality titles with low visibility that Netflix's algorithm may not surface.",
          ],
        },
        {
          heading: "Netflix Originals",
          body: "Netflix produces more original content than any other streaming platform. From prestige dramas like The Crown and Stranger Things to international hits like Squid Game and Money Heist — their original slate is vast and varied. FrameMeta helps you navigate it by quality, not just buzz.",
        },
        {
          heading: "International Content",
          body: "Netflix's investment in international content has produced some of the most acclaimed films and series of the decade. FrameMeta tracks and ranks Netflix's global catalog across 30+ regional markets, surfacing international titles that have earned critical recognition but may not appear in your default feed.",
        },
      ]}
      footer="Netflix catalog data is updated daily. Availability varies by region — FrameMeta shows what's available in your market."
    />
  );
}
