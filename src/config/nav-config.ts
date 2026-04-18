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
  { name: "Overview", href: "/" },
  { name: "Movies", href: "/movies" },
  { name: "TV Shows", href: "/tv-shows" },
  { name: "News", href: "/news" },
  { name: "Film Info", href: "/film-info" },
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
      { name: "News", href: "/news" },
    ] satisfies NavLink[],
  },
  {
    heading: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
    ] satisfies NavLink[],
  },
] as const;
