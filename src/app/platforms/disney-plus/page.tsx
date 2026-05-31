import { ContentPage } from "@/components/ui/ContentPage";

export default function DisneyPlusPage() {
  return (
    <ContentPage
      title="Disney+"
      category="Platform"
      description="Disney, Marvel, Star Wars, Pixar, and National Geographic — the full Disney+ universe, organized by quality and cultural impact. Navigate one of the deepest content libraries in streaming."
      sections={[
        {
          heading: "Disney+ on FrameMeta",
          body: "Disney+ houses some of the most iconic franchises in entertainment history. FrameMeta helps you navigate this universe with curated franchise timelines, quality-ranked browsing, and cross-reference tools that connect titles across the Marvel Cinematic Universe, Star Wars canon, Pixar filmography, and Disney's animated legacy.",
          list: [
            "Franchise timelines — view Marvel, Star Wars, and Pixar titles in chronological or release order.",
            "Quality rankings — see which MCU phase or Star Wars era is critically strongest.",
            "Technical specs — every Disney+ title rated for 4K, HDR, Dolby Vision, and Dolby Atmos.",
            "Cross-franchise connections — discover how titles connect across Disney's universe.",
          ],
        },
        {
          heading: "Marvel Cinematic Universe",
          body: "The MCU spans over 30 films and a growing library of Disney+ series. FrameMeta tracks the entire canon with quality ratings, chronological ordering, and post-credit scene guides. Whether you're doing a full rewatch or catching up on a specific phase, we help you prioritize the strongest entries.",
        },
        {
          heading: "Star Wars",
          body: "From the original trilogy to the latest Disney+ series, FrameMeta covers the full Star Wars canon. We rank films and series by quality, provide chronological viewing orders, and track how each new entry affects the overall franchise standing.",
        },
        {
          heading: "Pixar & Animation",
          body: "Pixar's filmography is arguably the most consistently high-quality in cinema history. FrameMeta ranks every Pixar film alongside Disney's animated features, providing quality scores that account for both critical reception and audience sentiment across generations.",
        },
      ]}
      footer="Disney+ catalog data is updated daily. Franchise timelines are maintained by our editorial team."
    />
  );
}
