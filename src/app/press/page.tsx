import { ContentPage } from "@/components/ui/ContentPage";

export default function PressPage() {
  return (
    <ContentPage
      title="Press"
      category="Company"
      description="Media resources, brand assets, and editorial contacts for journalists covering the intersection of technology and cinema. FrameMeta is redefining how audiences discover what to watch next."
      sections={[
        {
          heading: "About FrameMeta",
          body: "FrameMeta is a cinematic intelligence platform that aggregates critic scores, audience sentiment, technical quality metrics, and streaming availability into a curated discovery experience. We rate every title for premium home theater — 4K, HDR, Dolby Vision, and Dolby Atmos — helping modern audiences find what's truly worth watching.",
        },
        {
          heading: "Key Facts",
          list: [
            "Founded in 2025, headquartered in the Philippines.",
            "Covers 50,000+ titles across movies and television series.",
            "Aggregates data from TMDB, Metacritic, and Rotten Tomatoes.",
            "Tracks streaming availability across 15+ major platforms.",
            "Quality-first methodology that prioritizes technical presentation alongside critical merit.",
          ],
        },
        {
          heading: "Press Kit",
          body: "Our press kit includes FrameMeta logos (light and dark variants), product screenshots at multiple viewport sizes, executive headshots and bios, and one-pagers summarizing our platform and methodology. All assets are available in high-resolution formats suitable for both digital and print publication.",
        },
        {
          heading: "Spokesperson Availability",
          body: "Our founding team is available for interviews, podcast appearances, and expert commentary on topics including streaming trends, content discovery technology, film criticism in the digital age, and the future of cinematic recommendation systems. We typically accommodate requests within 48 hours.",
        },
      ]}
      footer="For press inquiries, contact press@framemeta.com. We respond within 24 hours on business days."
    />
  );
}
