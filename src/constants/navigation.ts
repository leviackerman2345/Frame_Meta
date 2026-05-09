import type { NavLink } from "@/types/types";

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------

export const brand = {
  nameStart: "Frame",
  nameEnd: "Meta",
  href: "/",
} as const;

// ---------------------------------------------------------------------------
// Main Navigation Links
// ---------------------------------------------------------------------------

export const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/movies" },
  { name: "Series", href: "/tv-shows" },
  { name: "People", href: "/actor" },
  { name: "News", href: "/news" },
];

// ---------------------------------------------------------------------------
// Footer Links  (stub — expand when footer is built)
// ---------------------------------------------------------------------------

export const footerLinkGroups = [
  {
    heading: "Explore",
    links: [
      { name: "Movies", href: "/movies" },
      { name: "TV Shows", href: "/tv-shows" },
      { name: "Collections", href: "/collections" },
      { name: "Coming Soon", href: "/coming-soon" },
    ] satisfies NavLink[],
  },
  {
    heading: "Platforms",
    links: [
      { name: "Netflix", href: "/platforms/netflix" },
      { name: "Disney+", href: "/platforms/disney-plus" },
      { name: "HBO Max", href: "/platforms/max" },
      { name: "Apple TV+", href: "/platforms/apple-tv-plus" },
    ] satisfies NavLink[],
  },
  {
    heading: "Rankings",
    links: [
      { name: "Top 10 Movies", href: "/rankings/movies" },
      { name: "Top 10 TV Shows", href: "/rankings/tv-shows" },
      { name: "Global Trends", href: "/trends" },
      { name: "Award Winners", href: "/awards" },
    ] satisfies NavLink[],
  },
  {
    heading: "Company",
    links: [
      { name: "About FrameMeta", href: "/about" },
      { name: "Our Partners", href: "/partners" },
      { name: "Press & Media", href: "/press" },
      { name: "Careers", href: "/careers" },
    ] satisfies NavLink[],
  },
] as const;
