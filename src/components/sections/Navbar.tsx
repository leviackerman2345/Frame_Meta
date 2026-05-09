"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { brand, navLinks } from "@/constants/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname.startsWith("/titles/") || pathname.startsWith("/collection/")) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

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

        {/* Menu Background - Solid background container */}
        <div className="hidden md:flex items-center space-x-1 rounded-full bg-zinc-900/90 backdrop-blur-md border border-white/10 px-2 py-2 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-5 py-1.5 text-sm font-medium transition-colors duration-300 tracking-wide rounded-full ${
                  isActive ? "text-black" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white rounded-full shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-3 pr-2">
          {/* Icon Button matching the image */}
          <Link 
            href="/search"
            className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          {/* Login Button */}
          <button className="hidden sm:block h-10 md:h-11 rounded-full bg-black px-5 md:px-7 text-xs md:text-sm font-semibold text-white border border-white/10 hover:bg-zinc-900 transition-colors shadow-md">
            Login
          </button>
          
          {/* Mobile Toggle */}
          <button 
            onClick={toggleMenu}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors border border-white/10"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden mt-4 w-full rounded-[2rem] bg-zinc-900/95 backdrop-blur-2xl border border-white/10 p-4 shadow-2xl overflow-hidden"
            id="mobile-nav"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`relative px-6 py-4 text-lg font-medium transition-colors duration-300 rounded-2xl ${
                      isActive ? "text-black" : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavMobile"
                        className="absolute inset-0 bg-white rounded-2xl shadow-lg"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
              
              {/* Extra Mobile Actions */}
              <div className="pt-4 mt-2 border-t border-white/5 sm:hidden">
                <button className="w-full py-4 rounded-2xl bg-black text-white font-semibold border border-white/10 hover:bg-zinc-800 transition-colors">
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
