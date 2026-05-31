import { ContentPage } from "@/components/ui/ContentPage";

export default function PartnersPage() {
  return (
    <ContentPage
      title="Partners"
      category="Company"
      description="FrameMeta partners with streaming platforms, studios, and cultural institutions to surface the best of cinema to a global audience of discerning viewers. Our audience values quality over quantity — making FrameMeta an ideal channel for premium content discovery."
      sections={[
        {
          heading: "Platform Integrations",
          body: "Streaming platforms can integrate with FrameMeta to surface their catalogs through our quality-ranked discovery experience. We provide deep linking, real-time availability updates, and technical quality metadata (4K, HDR, Atmos) that helps your audience find the right title at the right time. Our integration partners see higher engagement on titles that surface through FrameMeta's curated pathways.",
        },
        {
          heading: "Studio Partnerships",
          body: "For studios launching new titles, FrameMeta offers co-branded editorial features, pre-release quality assessments, and dedicated landing pages that reach our audience of engaged cinephiles. Our editorial team works directly with studio marketing teams to create authentic, quality-focused promotional content that resonates with discerning viewers.",
        },
        {
          heading: "Data & Research Partnerships",
          body: "We offer anonymized, aggregated viewing trend data for research institutions, cultural organizations, and industry analysts studying audience behavior and content discovery patterns. Our datasets cover cross-platform viewing trends, genre evolution, and regional preference shifts across 40+ markets.",
        },
        {
          heading: "Affiliate & Revenue Sharing",
          body: "FrameMeta participates in affiliate programs with select streaming platforms. When users discover content through our platform and subscribe to a streaming service, we may receive a referral fee. This never influences our rankings, ratings, or editorial content — our recommendations are driven entirely by quality metrics and user taste profiles.",
        },
      ]}
      footer="For partnership inquiries, contact partners@framemeta.com. We review all proposals within 5 business days."
    />
  );
}
