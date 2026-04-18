import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/sections/Navbar";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
