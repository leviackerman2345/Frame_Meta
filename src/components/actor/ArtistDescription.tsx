"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BiographyToggle } from "./BiographyToggle";
import { Film, Tv, Calendar, Milestone } from "lucide-react";
import BorderGlow from "../ui/BorderGlow";

interface Credit {
  id: number;
  release_date?: string;
  first_air_date?: string;
}

interface ArtistDescriptionProps {
  biography: string;
  deathday?: string | null;
  movieCredits?: { cast: Credit[]; crew: Credit[] };
  tvCredits?: { cast: Credit[]; crew: Credit[] };
}

export function ArtistDescription({
  biography,
  deathday,
  movieCredits = { cast: [], crew: [] },
  tvCredits = { cast: [], crew: [] },
}: ArtistDescriptionProps) {
  
  // Stats Calculation
  const totalMovies = (movieCredits.cast?.length || 0) + (movieCredits.crew?.length || 0);
  const totalTV = (tvCredits.cast?.length || 0) + (tvCredits.crew?.length || 0);
  
  const allCredits = [
    ...(movieCredits.cast || []),
    ...(movieCredits.crew || []),
    ...(tvCredits.cast || []),
    ...(tvCredits.crew || []),
  ];
  
  const releaseYears = allCredits
    .map((c) => {
      const dateStr = c.release_date || c.first_air_date;
      return dateStr ? parseInt(dateStr.substring(0, 4)) : null;
    })
    .filter((y): y is number => y !== null && !isNaN(y));
    
  const careerStart = releaseYears.length > 0 ? Math.min(...releaseYears) : "N/A";
  const careerEnd = deathday ? Math.max(...releaseYears) : "Present";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as any }
    }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full max-w-360 mx-auto px-6 md:px-12 relative z-20 py-10 md:py-16 flex flex-col gap-12"
    >
      {/* Big Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        <StatItem 
          icon={<Film className="w-5 h-5 text-white" />} 
          label="Movies" 
          value={totalMovies} 
          variants={itemVariants}
          baseColor="#6366f1" // Indigo
        />
        <StatItem 
          icon={<Tv className="w-5 h-5 text-white" />} 
          label="TV Series" 
          value={totalTV} 
          variants={itemVariants}
          baseColor="#f43f5e" // Rose
        />
        <StatItem 
          icon={<Calendar className="w-5 h-5 text-white" />} 
          label="Career Start" 
          value={careerStart} 
          variants={itemVariants}
          baseColor="#f59e0b" // Amber
        />
        <StatItem 
          icon={<Milestone className="w-5 h-5 text-white" />} 
          label="Career End" 
          value={careerEnd} 
          variants={itemVariants}
          baseColor="#10b881" // Emerald
        />
      </div>

      {/* Biography */}
      <motion.div variants={itemVariants} className="w-full flex flex-col gap-6">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Biography
        </h2>
        <div className="max-w-4xl">
          <BiographyToggle biography={biography} />
        </div>
      </motion.div>
    </motion.section>
  );
}


// ... (existing interfaces)

function StatItem({ 
  icon, 
  label, 
  value, 
  variants, 
  baseColor 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  variants: any; 
  baseColor: string 
}) {
  // Convert hex color to a simple HSL-like string for the glow
  // This is a rough estimation for the glowColor prop "H S L"
  const getGlowColor = (hex: string) => {
    if (hex === "#6366f1") return "239 84 67"; // Indigo
    if (hex === "#f43f5e") return "350 89 60"; // Rose
    if (hex === "#f59e0b") return "38 92 50";  // Amber
    if (hex === "#10b881") return "161 84 39"; // Emerald
    return "200 80 50";
  };

  return (
    <motion.div variants={variants}>
      <BorderGlow
        backgroundColor="rgba(9, 9, 11, 0.4)" // Match zinc-950/40
        borderRadius={40} // 2.5rem
        glowRadius={50}
        glowIntensity={1.2}
        edgeSensitivity={40}
        glowColor={getGlowColor(baseColor)}
        colors={[baseColor, baseColor, "#ffffff"]}
        className="h-full"
      >
        <div className="flex flex-col items-center text-center gap-6 p-8 min-h-45 justify-center">
          {/* Row 1: Icon + Label */}
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 transition-all duration-500 group-hover:bg-white/10"
            >
              {icon}
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
              {label}
            </span>
          </div>
          
          {/* Row 2: Value */}
          <div className="w-full">
            <span className="text-2xl md:text-5xl font-black text-white tracking-tighter block">
              {value}
            </span>
          </div>
        </div>
      </BorderGlow>
    </motion.div>
  );
}
