import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InitialLoader } from "@/components/ui/InitialLoader";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { DevNotice } from "@/components/ui/DevNotice";
import { AuthProvider } from "@/contexts/AuthContext";
import { LayoutShell } from "@/components/auth/LayoutShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inters",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://framemeta.app"),
  title: {
    default: "FrameMeta — Cinematic Discovery Platform",
    template: "%s | FrameMeta",
  },
  description:
    "Discover movies, series, and collections with cinematic-grade detail. Trailers, ratings, cast, streaming providers, and curated recommendations.",
  keywords: [
    "movies",
    "series",
    "streaming",
    "cinema",
    "watch",
    "trailers",
    "collections",
    "ratings",
    "reviews",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FrameMeta",
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          * Blocking inline script — must be inside <head> to prevent Next.js hydration errors.
          * It runs synchronously during HTML parsing, before the browser has painted
          * a single pixel. This stamps data-loading="true" on <html> immediately so
          * the CSS rule in globals.css can hide Navbar/Footer from frame zero.
          *
          * useEffect (in InitialLoader.tsx) always fires AFTER the first paint, so
          * it cannot prevent the flash. Only a render-blocking script can.
          * This is the same technique used by every flash-free dark-mode solution.
          */}
        <script
          id="loading-state-script"
          dangerouslySetInnerHTML={{
            __html: `(function(){
    var nav = performance.getEntriesByType('navigation')[0];
    if (nav && (nav.type === 'navigate' || nav.type === 'reload')) {
      document.documentElement.setAttribute('data-loading', 'true');
    }
  })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black overflow-x-clip" suppressHydrationWarning>
        <AuthProvider>
          <InitialLoader />
          <DevNotice />
          <LayoutShell>
            {children}
            {modal}
          </LayoutShell>
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
