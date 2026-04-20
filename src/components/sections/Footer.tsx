"use client";

import Link from "next/link";
import { Camera, Share2, Video } from "lucide-react";
import { brand, footerLinkGroups, navLinks } from "@/config/nav-config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#050505] text-white pt-32 pb-8 overflow-hidden border-t border-white/5">
      {/* Dynamic Background Gradients inspired by Image 2 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-indigo-600/15 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[50%] bg-purple-600/10 blur-[100px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-rose-500/5 blur-[80px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Top Section - Image 2 Style Headline */}
        <div className="max-w-4xl mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-zinc-200">
            Interested in working together, <span className="text-zinc-500">trying our platform or simply learning more?</span>
          </h2>
        </div>

        {/* Middle Grid - Image 1 Style Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Social and Contact Column (Left) */}
          <div className="lg:col-span-4 space-y-12">
            {/* Social Icons matching Image 1 circle style */}
            <div className="flex items-center space-x-4">
              <Link href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all">
                <Camera className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all">
                <Share2 className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all">
                <Video className="w-5 h-5" />
              </Link>
            </div>

            <div className="space-y-6 text-lg text-zinc-400">
              <p className="leading-snug">
                The Cinematic Hub.<br />
                Los Angeles, CA
              </p>
              <div className="space-y-2 font-medium">
                <Link href="mailto:hello@framemeta.com" className="block hover:text-white transition-colors">hello@framemeta.com</Link>
                <p className="text-white">frame the future.</p>
              </div>
            </div>
          </div>

          {/* Nav Links Column (Right) */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* MENU column using navLinks as requested */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Menu</h4>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-zinc-400 hover:text-white transition-colors text-base font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Columns from footerLinkGroups */}
            {footerLinkGroups.filter(g => g.heading !== "Explore").map((group) => (
              <div key={group.heading} className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                  {group.heading}
                </h4>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-zinc-400 hover:text-white transition-colors text-base font-medium"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Separator Line with Get Started Button - Image 1 Style */}
        <div className="relative flex items-center mb-16">
          <div className="flex-1 h-px bg-zinc-800" />
          <div className="absolute right-0">
            <Link 
              href="/get-started" 
              className="px-8 py-3 bg-white text-black rounded-full font-bold text-sm tracking-tight hover:bg-zinc-200 transition-all flex items-center gap-2 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Bottom Bar with Footer Branding - Image 1 & 2 Style */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 relative pb-20">
          <div className="max-w-xs text-sm text-zinc-500 leading-relaxed font-medium">
            Discover the ultimate cinematic experience. FrameMeta aggregates the world's best movies and series into one seamless discovery platform.
          </div>

          <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <Link href="/terms" className="hover:text-white transition-colors text-zinc-400">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-white transition-colors text-zinc-400">Privacy Policy</Link>
          </div>
        </div>

        {/* Copyright and Bottom Mini-nav */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-white/5 relative z-20">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            © {currentYear} {brand.nameStart.toUpperCase()}{brand.nameEnd.toUpperCase()}. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          </div>
        </div>
      </div>

      {/* Hero Brand Backdrop - Seamless integration as requested */}
      <div className="absolute bottom-[-5%] md:bottom-[-10%] left-0 w-full pointer-events-none select-none text-center flex justify-center z-10 transition-opacity duration-1000">
        <h2 className="text-[25vw] font-black tracking-tighter leading-none whitespace-nowrap text-zinc-400 opacity-[0.08]">
          {brand.nameStart.toLowerCase()}{brand.nameEnd.toLowerCase()}
        </h2>
      </div>
    </footer>
  );
}
