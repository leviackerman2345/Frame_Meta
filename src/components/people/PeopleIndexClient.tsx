"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import type { CuratedPerson } from "@/constants/people";

interface TMDBPerson {
  id: number;
  name: string;
  known_for_department?: string;
  profile_path?: string | null;
  known_for?: Array<{ title?: string; name?: string }>;
}

interface PeopleIndexClientProps {
  curatedPeople: CuratedPerson[];
  trendingPeople: TMDBPerson[];
  popularPeople: TMDBPerson[] | undefined;
}

const FILTER_TABS = ["All", "Director", "Cinematographer", "Actor", "Screenwriter"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function getProfileUrl(path?: string | null): string {
  if (!path) return "/images/poster-placeholder.jpg";
  return path.startsWith("http")
    ? path
    : `https://image.tmdb.org/t/p/w500${path}`;
}

function normalizeRole(dept?: string): string {
  if (!dept) return "Actor";
  if (dept === "Directing") return "Director";
  if (dept === "Camera") return "Cinematographer";
  if (dept === "Writing") return "Screenwriter";
  return "Actor";
}

export function PeopleIndexClient({
  curatedPeople,
  trendingPeople,
  popularPeople,
}: PeopleIndexClientProps) {
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const spotlightArtists =
    curatedPeople.filter((p) => p.isSpotlight).length > 0
      ? curatedPeople.filter((p) => p.isSpotlight)
      : [curatedPeople[0]];
  const spotlight = spotlightArtists[spotlightIndex] || curatedPeople[0];

  // Trending: curated first 5 + TMDB trending (deduped)
  const trendingIds = new Set(curatedPeople.slice(0, 5).map((p) => p.id));
  const combinedTrending = [
    ...curatedPeople.slice(0, 5).map((p) => ({
      id: p.id,
      name: p.name,
      role: p.role,
      profilePath: p.profilePath,
      knownFor: p.signatureAesthetics.slice(0, 2),
    })),
    ...trendingPeople
      .filter((tp) => !trendingIds.has(tp.id))
      .map((tp) => ({
        id: tp.id,
        name: tp.name,
        role: normalizeRole(tp.known_for_department),
        profilePath: tp.profile_path,
        knownFor:
          tp.known_for
            ?.map((k) => k.title || k.name)
            .filter(Boolean)
            .slice(0, 2) || [],
      })),
  ].slice(0, 14);

  // Popular from TMDB (not in curated or trending)
  const existingIds = new Set([
    ...curatedPeople.map((p) => p.id),
    ...trendingPeople.map((p) => p.id),
  ]);
  const extraPeople = (popularPeople || [])
    .filter((p) => !existingIds.has(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      role: normalizeRole(p.known_for_department) as CuratedPerson["role"],
      profilePath: p.profile_path || "",
      signatureAesthetics:
        (p.known_for
            ?.map((k) => k.title || k.name)
            .filter(Boolean)
            .slice(0, 2) as string[]) || ["Cinema"],
      awardsBadge: "Popular",
      bio: "",
      birthdate: "",
      location: "",
      youtubeLoopId: "",
      frequentCollaborators: [],
    }));

  // Full grid: curated + extra popular
  const allGridPeople: CuratedPerson[] = [
    ...curatedPeople,
    ...extraPeople.filter((ep) => !curatedPeople.some((cp) => cp.id === ep.id)),
  ];

  const filteredGridPeople =
    activeFilter === "All"
      ? allGridPeople
      : allGridPeople.filter((p) => p.role === activeFilter);

  // Academy winners for badge section
  const academyWinners = curatedPeople.filter(
    (p) =>
      p.isAcademyWinner ||
      p.awardsBadge.includes("Academy") ||
      p.awardsBadge.includes("Oscar")
  );

  return (
    <div className="w-full bg-black text-white">
      <Navbar />

      {/* 1. Spotlight Hero */}
      <section className="relative min-h-[85vh] w-full flex items-end overflow-hidden pt-20 md:pt-0">
        {/* Background portrait (blurred, low opacity) */}
        <div className="absolute inset-0 z-0">
          <Image
            src={getProfileUrl(spotlight.profilePath)}
            alt=""
            fill
            priority
            className="object-cover object-top scale-110 blur-2xl opacity-20"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-16 md:pb-24 pt-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10 md:gap-16">
            {/* Portrait */}
            <motion.div
              key={`spotlight-img-${spotlight.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-56 h-72 md:w-72 md:h-[420px] rounded-[2rem] overflow-hidden border border-white/10 shrink-0 shadow-2xl"
            >
              <Image
                src={getProfileUrl(spotlight.profilePath)}
                alt={spotlight.name}
                fill
                priority
                className="object-cover object-top"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>

            {/* Info */}
            <motion.div
              key={`spotlight-info-${spotlight.id}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 flex flex-col gap-4 text-center md:text-left max-w-2xl"
            >
              <motion.div variants={itemVariants} className="flex items-center gap-2.5 justify-center md:justify-start">
                <span className="inline-flex items-center rounded-full bg-white/[0.08] px-4 py-1.5 text-[10px] md:text-xs font-semibold tracking-[0.2em] text-zinc-300 uppercase backdrop-blur-xl border border-white/[0.08]">
                  Creator Spotlight
                </span>
                {spotlight.awardsBadge && (
                  <span className="inline-flex items-center rounded-full bg-amber-400/[0.08] px-3 py-1 text-[10px] md:text-xs font-semibold tracking-wider text-amber-300/80 uppercase border border-amber-400/[0.1]">
                    {spotlight.awardsBadge}
                  </span>
                )}
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
              >
                {spotlight.name}
              </motion.h1>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-zinc-300 font-medium justify-center md:justify-start"
              >
                <span className="text-white">{spotlight.role}</span>
                {spotlight.location && (
                  <>
                    <span className="text-zinc-600">&middot;</span>
                    <span className="text-zinc-400">{spotlight.location}</span>
                  </>
                )}
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-sm md:text-base leading-relaxed text-zinc-400 max-w-lg"
              >
                {spotlight.bio}
              </motion.p>

              {/* Signature aesthetics */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2 justify-center md:justify-start">
                {spotlight.signatureAesthetics.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] md:text-xs font-medium text-zinc-300 backdrop-blur-xl"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 pt-2 justify-center md:justify-start">
                <Link
                  href={`/people/${spotlight.id}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 md:px-7 md:py-3 text-xs md:text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 cursor-pointer"
                >
                  Explore Profile
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>

                {/* Spotlight dots */}
                {spotlightArtists.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    {spotlightArtists.map((artist, idx) => (
                      <button
                        key={artist.id}
                        onClick={() => setSpotlightIndex(idx)}
                        className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                          spotlightIndex === idx
                            ? "w-5 bg-white"
                            : "w-1 bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Switch to ${artist.name}`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Trending Talent */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="mb-10">
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/35">
              Now Trending
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Trending Talent Today
            </h2>
          </div>

          <div className="flex gap-5 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory px-1 scroll-smooth scrollbar-hide">
            {combinedTrending.map((person) => (
              <Link
                key={person.id}
                href={`/people/${person.id}`}
                className="group flex flex-col items-center gap-3 text-center shrink-0 snap-start select-none cursor-pointer w-[140px] md:w-[160px]"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-white/10 group-hover:border-white/25 transition-all duration-500">
                  <Image
                    src={getProfileUrl(person.profilePath)}
                    alt={person.name}
                    fill
                    className="object-cover object-top grayscale contrast-[1.05] group-hover:grayscale-0 transition-all duration-700"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors duration-300 leading-tight">
                    {person.name}
                  </span>
                  <span className="text-[10px] text-white/30 mt-0.5 uppercase tracking-wider">
                    {person.role}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Academy Award Winners */}
      <section className="w-full py-16 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="mb-10">
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/35">
              Prestige
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Academy Award Winners
            </h2>
            <p className="mt-2 text-sm text-white/30 max-w-md">
              Celebrated creators whose work has been recognized by the Academy.
            </p>
          </div>

          <div className="flex lg:grid lg:grid-cols-4 gap-4 md:gap-5 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
            {academyWinners.slice(0, 4).map((winner) => (
              <div key={winner.id} className="w-[75%] sm:w-[45%] lg:w-auto shrink-0 snap-center snap-always">
                <Link
                  href={`/people/${winner.id}`}
                  className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/8 bg-zinc-950/50 cursor-pointer block"
                >
                  <Image
                    src={getProfileUrl(winner.profilePath)}
                    alt={winner.name}
                    fill
                    className="object-cover object-top grayscale contrast-[1.05] brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Award badge */}
                  <div className="absolute top-4 right-4 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/15 backdrop-blur-xl border border-amber-400/20 text-[9px] font-semibold text-amber-300/90 uppercase tracking-wider">
                    <Star className="w-2.5 h-2.5 fill-amber-400/80" />
                    Award Winner
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 z-20">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">
                      {winner.role}
                    </span>
                    <h3 className="text-lg md:text-xl font-semibold text-white tracking-tight mt-1 group-hover:text-white/80 transition-colors">
                      {winner.name}
                    </h3>
                    <p className="text-xs text-white/30 mt-1 line-clamp-2 leading-relaxed">
                      {winner.awardsBadge}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. All Creators Grid */}
      <section className="w-full py-16 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          {/* Header + Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/35">
                Explore
              </span>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-white">
                The Visionaries
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {FILTER_TABS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-medium uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeFilter === filter
                      ? "bg-white text-black"
                      : "bg-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/[0.08] border border-white/[0.08]"
                  }`}
                >
                  {filter === "All" ? "All" : filter + "s"}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 min-h-[300px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredGridPeople.map((person) => {
                const isCurated = curatedPeople.some(
                  (cp) => cp.id === person.id
                );
                return (
                  <motion.div
                    layout
                    key={person.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={`/people/${person.id}`}
                      className="group flex gap-4 items-start rounded-[1.5rem] md:rounded-[2rem] border border-white/8 bg-zinc-950/80 p-4 md:p-5 hover:border-white/15 transition-all duration-500 cursor-pointer block"
                    >
                      {/* Portrait */}
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                        <Image
                          src={getProfileUrl(
                            person.profilePath
                          )}
                          alt={person.name}
                          fill
                          className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                          unoptimized
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">
                            {person.role}
                          </span>
                          {isCurated && person.awardsBadge && (
                            <>
                              <span className="text-zinc-700">&middot;</span>
                              <span className="text-[10px] text-amber-400/70 font-medium truncate">
                                {person.awardsBadge}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="text-base md:text-lg font-semibold text-white tracking-tight group-hover:text-white/80 transition-colors truncate">
                          {person.name}
                        </h3>
                        {isCurated && person.bio && (
                          <p className="text-xs text-white/30 line-clamp-2 leading-relaxed mt-1">
                            {person.bio}
                          </p>
                        )}
                        {person.signatureAesthetics &&
                          person.signatureAesthetics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {person.signatureAesthetics
                                .slice(0, 2)
                                .map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[9px] text-white/25 font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          )}
                      </div>

                      <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors mt-1 shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
