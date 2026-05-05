"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FollowButton } from "@/components/ui/FollowButton";

interface Credit {
  id: number;
  releaseYear?: number;
  release_date?: string;
  first_air_date?: string;
}

interface ArtistHeroProps {
  name: string;
  profileImages: string[];
  department?: string;
  placeOfBirth?: string;
  birthday?: string;
  deathday?: string | null;
  externalIds?: {
    imdb_id?: string;
    instagram_id?: string;
    twitter_id?: string;
  };
  movieCredits?: { cast: Credit[]; crew: Credit[] };
  tvCredits?: { cast: Credit[]; crew: Credit[] };
}

const getLifespan = (birth?: string, death?: string | null) => {
  if (!birth) return null;
  
  const birthDate = new Date(birth);
  const endDate = death ? new Date(death) : new Date();
  
  let age = endDate.getFullYear() - birthDate.getFullYear();
  const m = endDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && endDate.getDate() < birthDate.getDate())) {
    age--;
  }

  if (death) {
    const deathYear = new Date(death).getFullYear();
    const birthYear = birthDate.getFullYear();
    return `${birthYear} - ${deathYear} (Age ${age})`;
  }
  
  return `${age} years old`;
};

export function ArtistHero({
  name,
  profileImages,
  department,
  placeOfBirth,
  birthday,
  deathday,
  externalIds = {},
  movieCredits = { cast: [], crew: [] },
  tvCredits = { cast: [], crew: [] },
}: ArtistHeroProps) {
  const primaryImage = profileImages?.[0];
  const tmdbBaseUrl = "https://image.tmdb.org/t/p/original";
  
  const imageUrl = primaryImage 
    ? (primaryImage.startsWith("http") ? primaryImage : `${tmdbBaseUrl}${primaryImage}`)
    : null;

  const lifespan = getLifespan(birthday, deathday);



  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.1 }
    }
  };



  return (
    <section className="relative w-full bg-linear-to-b from-zinc-950 via-zinc-900/50 to-black pt-48 pb-20 overflow-hidden">
      <div className="w-full max-w-360 mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 relative z-10">
        
        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-48 h-48 md:w-[320px] md:h-80 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl shrink-0"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              priority
              quality={100}
              unoptimized
              sizes="(max-width: 768px) 192px, 320px"
              className="object-cover object-center contrast-[1.05] saturate-[1.05] drop-shadow-xl"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
              <span className="text-zinc-600 font-bold uppercase">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8 flex-1 w-full text-center md:text-left"
        >
          {/* Header Line: Name + Badge */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
              <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tight subpixel-antialiased drop-shadow-2xl text-white leading-none whitespace-nowrap">
                {name}
              </h1>
              <Image
                src="https://cdn-icons-png.magnific.com/256/7641/7641727.png"
                alt="Verified"
                width={32}
                height={32}
                className="shrink-0"
              />
            </div>
          </div>

          {/* Metadata Line */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-zinc-400 text-sm md:text-xl font-medium">
              <span>{department}</span>
              <span className="opacity-30">•</span>
              <span>{placeOfBirth}</span>
              {lifespan && (
                <>
                  <span className="opacity-30">•</span>
                  <span>{lifespan}</span>
                </>
              )}
            </div>
            
            <div className="flex justify-center md:justify-start">
              <FollowButton />
            </div>
          </div>



            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              {externalIds.instagram_id && (
                <a
                  href={`https://instagram.com/${externalIds.instagram_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${name} on Instagram`}
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 transition-all duration-300 hover:text-white active:scale-95"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
              )}
              {externalIds.twitter_id && (
                <a
                  href={`https://twitter.com/${externalIds.twitter_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${name} on Twitter`}
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 transition-all duration-300 hover:text-white hover:bg-black active:scale-95"
                >
                  <FaXTwitter className="w-6 h-6" />
                </a>
              )}
              {externalIds.imdb_id && (
                <a
                  href={`https://imdb.com/name/${externalIds.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${name} on IMDb`}
                  className="px-4 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 transition-all duration-300 hover:text-black hover:bg-[#f5c518] active:scale-95 font-black text-xs"
                >
                  IMDb
                </a>
              )}
            </div>
        </motion.div>

      </div>
    </section>
  );
}


