import { ContentPage } from "@/components/ui/ContentPage";

export default function AppleTVPlusPage() {
  return (
    <ContentPage
      title="Apple TV+"
      category="Platform"
      description="Apple's curated slate of award-winning originals — where quality over quantity has become a defining philosophy. Every title is built for premium presentation."
      sections={[
        {
          heading: "Apple TV+ on FrameMeta",
          body: "Apple TV+ produces fewer titles than any major streamer, but every release is built for premium presentation. FrameMeta ranks Apple's catalog by critical quality and technical specs — and here's the key: every Apple Original is available in 4K HDR with Dolby Vision and Dolby Atmos by default. No upsells, no tiers.",
          list: [
            "100% 4K HDR — every Apple Original streams in the highest available quality.",
            "Dolby Vision & Atmos — included standard, not gated behind premium tiers.",
            "Award-winning catalog — Apple Originals have won more major awards per title than any competitor.",
            "Quality consistency — the highest average critic score of any streaming platform.",
          ],
        },
        {
          heading: "The Quality-Over-Quantity Model",
          body: "While other platforms flood their libraries with content, Apple takes the opposite approach. A smaller, more curated slate means higher average quality — and it shows. Apple TV+ originals consistently rank among the highest-rated shows and films on FrameMeta, with a quality density that larger platforms struggle to match.",
        },
        {
          heading: "Notable Originals",
          body: "From Ted Lasso's Emmy-winning comedy to Killers of the Flower Moon's Scorsese-directed drama, Apple's originals span every genre with consistent quality. FrameMeta tracks every Apple Original with full quality metrics, cast information, and cross-platform availability data.",
        },
      ]}
      footer="Apple TV+ catalog data is updated daily. All Apple Originals are rated for premium home theater presentation."
    />
  );
}
