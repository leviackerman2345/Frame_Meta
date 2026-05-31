import { ContentPage } from "@/components/ui/ContentPage";

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Service"
      category="Legal"
      description="These terms govern your access to and use of FrameMeta — our platform, content, and services. By using FrameMeta, you agree to be bound by these terms. Please read them carefully."
      sections={[
        {
          heading: "1. Acceptance of Terms",
          body: "By accessing or using FrameMeta, you confirm that you are at least 16 years of age and agree to comply with these Terms of Service. If you are using FrameMeta on behalf of an organization, you represent that you have the authority to bind that organization to these terms. If you do not agree with any part of these terms, you may not access or use our platform.",
        },
        {
          heading: "2. Description of Service",
          body: "FrameMeta is a cinematic discovery platform that aggregates metadata, ratings, reviews, and streaming availability information for film and television content. We source data from publicly available APIs and editorial curation. FrameMeta does not host, stream, or distribute any video content. All streaming links redirect to third-party platforms.",
        },
        {
          heading: "3. User Conduct",
          body: "You agree to use FrameMeta only for lawful purposes. You must not:",
          list: [
            "Attempt to gain unauthorized access to any part of our platform, servers, or connected systems.",
            "Use automated tools (bots, scrapers, crawlers) to extract data from FrameMeta without our express written permission.",
            "Interfere with or disrupt the integrity or performance of our platform.",
            "Impersonate any person or entity, or misrepresent your affiliation with any person or entity.",
            "Use FrameMeta to distribute spam, malware, or other harmful content.",
          ],
        },
        {
          heading: "4. Intellectual Property",
          body: "The FrameMeta platform — including its design, code, editorial content, logos, and branding — is the intellectual property of FrameMeta and protected by applicable copyright and trademark laws. Movie and television metadata, including titles, images, and descriptions, is sourced from TMDB and subject to their licensing terms. You may not reproduce, modify, or distribute any part of FrameMeta without prior written consent.",
        },
        {
          heading: "5. Third-Party Links & Services",
          body: "FrameMeta contains links to third-party streaming platforms, external websites, and API-sourced content. We are not responsible for the availability, accuracy, or practices of these external services. Your interactions with third-party platforms are governed by their respective terms of service and privacy policies.",
        },
        {
          heading: "6. Disclaimers",
          body: 'FrameMeta is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of harmful components. Ratings, reviews, and metadata are provided for informational purposes only and should not be the sole basis for viewing decisions.',
        },
        {
          heading: "7. Limitation of Liability",
          body: "To the fullest extent permitted by law, FrameMeta and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform. Our total liability shall not exceed the amount you paid us, if any, in the twelve months preceding the claim.",
        },
        {
          heading: "8. Modifications",
          body: "We reserve the right to modify these terms at any time. When we make material changes, we will update the date at the top of this page and may provide additional notice through our platform. Your continued use of FrameMeta after changes take effect constitutes acceptance of the revised terms.",
        },
        {
          heading: "9. Governing Law",
          body: "These terms are governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of FrameMeta shall be resolved through good-faith negotiation. If negotiation fails, disputes shall be submitted to binding arbitration.",
        },
      ]}
      footer="Last updated: May 2026. If you have questions about these terms, contact us at legal@framemeta.com."
    />
  );
}
