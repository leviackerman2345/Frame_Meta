import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { InitialLoader } from "@/components/ui/InitialLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FrameMeta",
  description: "FrameMeta — Built with Next.js",
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
      className={`${inter.variable} ${inter.className} h-full antialiased`}
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
      <body className="min-h-full flex flex-col bg-black overflow-x-hidden" suppressHydrationWarning>
        <InitialLoader />
        <Navbar />
        {children}
        {modal}
        <Footer />
      </body>
    </html>
  );
}
