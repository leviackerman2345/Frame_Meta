import { ContentPage } from "@/components/ui/ContentPage";

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      category="Legal"
      description="Your privacy is foundational to how we build FrameMeta. This policy explains what data we collect, why we collect it, how we use it, and the controls you have over your information."
      sections={[
        {
          heading: "1. Information We Collect",
          body: "We collect information to provide and improve FrameMeta's services. The types of data we gather include:",
          list: [
            "Usage data — pages you visit, titles you view, search queries, filters you apply, and time spent on the platform. This helps us understand what content is most valuable and improve our recommendations.",
            "Device information — browser type and version, operating system, screen resolution, and device identifiers. This ensures FrameMeta renders correctly across all devices.",
            "IP address and approximate location — used solely for regional content personalization (e.g., showing locally popular titles and region-appropriate streaming availability). We do not track precise geolocation.",
            "Cookies and local storage — used for session management, theme preferences, and caching to improve load times. We do not use third-party advertising cookies.",
          ],
        },
        {
          heading: "2. How We Use Your Information",
          body: "We use collected data exclusively to operate and improve FrameMeta:",
          list: [
            "Personalization — tailoring title recommendations, trending content, and discovery features based on your viewing patterns and preferences.",
            "Performance optimization — analyzing load times, identifying broken features, and improving the responsiveness of our platform across devices and regions.",
            "Content curation — understanding aggregate viewing patterns to surface quality content that might otherwise go undiscovered.",
            "Security — detecting and preventing abuse, unauthorized access, and other harmful activity on our platform.",
          ],
        },
        {
          heading: "3. Data Sharing & Third Parties",
          body: "We do not sell, rent, or trade your personal information to anyone. We share data only in these limited circumstances:",
          list: [
            "Service providers — we use trusted infrastructure providers (hosting, analytics, CDN) who process data on our behalf under strict contractual obligations.",
            "TMDB integration — when you view a title, we fetch metadata from The Movie Database (TMDB). Your requests are proxied through our servers; TMDB does not receive your personal data.",
            "Legal compliance — we may disclose information if required by law, court order, or governmental request, and only to the extent legally mandated.",
          ],
        },
        {
          heading: "4. Data Retention",
          body: "We retain usage data for up to 24 months in aggregated, anonymized form. Session data and cookies expire automatically based on their configured lifetime (typically 30 days). If you contact us directly, we retain correspondence for up to 12 months to provide support continuity.",
        },
        {
          heading: "5. Your Rights & Controls",
          body: "You have the right to access, correct, or delete any personal data we hold about you. You can also opt out of non-essential data collection at any time. To exercise these rights, contact us at privacy@framemeta.com. We respond to all requests within 30 days.",
        },
        {
          heading: "6. Children's Privacy",
          body: "FrameMeta is not directed at children under 16. We do not knowingly collect personal information from anyone under 16. If we learn that we have collected such data, we will delete it promptly.",
        },
        {
          heading: "7. Changes to This Policy",
          body: "We may update this privacy policy from time to time. When we make material changes, we will notify you by updating the date at the top of this page and, where appropriate, through a notice on our platform. Your continued use of FrameMeta after changes constitutes acceptance of the updated policy.",
        },
      ]}
      footer="Last updated: May 2026. If you have questions about this policy, contact us at privacy@framemeta.com."
    />
  );
}
