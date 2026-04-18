"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { brand, navLinks } from "@/config/nav-config";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 px-4">
      {/* Main Container - Liquid glass effect */}
      <div className="flex w-full items-center justify-between rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        
        {/* Logo */}
        <div className="pl-6 flex items-center">
          <Link href={brand.href} className="text-2xl tracking-tight text-white drop-shadow-md flex items-center">
            <span className="font-medium">{brand.nameStart}</span>
            <span className="font-bold">{brand.nameEnd}</span>
          </Link>
        </div>

        {/* Menu Background - Darken shade glassmorphism */}
        <div className="hidden md:flex items-center space-x-1 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 px-8 py-2.5 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-300 tracking-wide ${
                  isActive
                    ? "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                    : "text-zinc-200 hover:text-blue-400"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 pr-2">
          {/* Icon Button matching the image */}
          <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm">
            <Search className="h-5 w-5" />
          </button>
          {/* Login Button */}
          <button className="h-11 rounded-full bg-black px-7 text-sm font-semibold text-white border border-white/10 hover:bg-zinc-900 transition-colors shadow-md">
            Login
          </button>
        </div>

      </div>
    </nav>
  );
}
