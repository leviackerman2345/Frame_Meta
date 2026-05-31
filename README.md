# FrameMeta

### Cinematic Intelligence for the Modern Discovery Era.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**FrameMeta** is a premium film, TV, and news discovery platform engineered for the modern cinephile. It bridges the gap between fragmented streaming libraries and the user's discovery intent through a high-performance, editorial-grade interface. Built with an Apple-inspired minimalism and a data-first philosophy, it provides a unified hub for tracking trailers, ratings, and industry headlines.

---

## Features

### Discovery
- **Curated Libraries** — Browse trending movies, top-rated series, and specialized content across genres.
- **Collections** — Access curated franchise collections including the MCU, Star Wars, DC Universe, and more.
- **Genre Explorer** — Filter and discover content by genre with dedicated browsing pages.
- **The Loop** — Muted cinematic preview cards with TMDB imagery for quick visual browsing.
- **Clips & Trailers** — Watch trailers and clips directly within the platform.
- **Advanced Search** — Full-text search across movies, TV shows, and people with instant results and client-side caching.

### Artist & People Profiles
- **Deep Filmography** — Comprehensive career tracking for actors, directors, and crew.
- **Dynamic Bios** — Interactive biographies with career statistics and department breakdowns.
- **People Index** — Browse and discover actors, directors, and other industry professionals.

### Editorial News
- **NYT Integration** — Entertainment-focused headlines powered by the New York Times Article Search API.
- **Title-Specific News** — Related news sections in movie/TV modals fetch articles specific to each title.
- **Archive Awareness** — Automatic fallback and staleness detection to ensure news relevance.
- **High-Fidelity Layouts** — Multi-column editorial designs with rich typography.

### SEO & Structured Data
- **Dynamic Metadata** — `generateMetadata` on title pages with Open Graph, Twitter cards, and canonical URLs.
- **JSON-LD** — Structured data schemas (WebSite, Organization, Movie, TVSeries, NewsArticle) for rich search results.
- **Sitemap** — Dynamic `sitemap.xml` covering all routes.
- **Robots.txt** — Configured crawling rules with sitemap reference.

### Performance & Design
- **Zero-Blocking Shell** — Instant page loads via granular React Suspense boundaries.
- **Deferred Sections** — Below-fold sections load via IntersectionObserver with a global queue (max 2 concurrent, 150ms stagger).
- **Skeleton Loaders** — Shimmer placeholders for carousels, news, collections, and content sections.
- **Apple-Inspired Aesthetic** — Dark-first design, Inter typography, and liquid-glass UI elements.
- **ISR & Streaming** — Incremental Static Regeneration ensures 5-minute freshness with near-zero latency.
- **Modal Details** — Movie/TV details open in an overlay via intercepting routes, keeping the browsing context intact.

### Accessibility & Compliance
- **Reduced Motion** — `prefers-reduced-motion` respected across animations, skeletons, and infinite scroll.
- **Cookie Consent** — GDPR-compliant cookie banner with accept/decline options.
- **Security Headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4.0 |
| **Animations** | Framer Motion |
| **State Management** | Zustand, SWR |
| **APIs** | TMDB, NYT Article Search, OMDb |
| **Fonts** | Inter via `next/font` |
| **Deployment** | Vercel |

---

## Project Structure

```text
src/
├── app/                  # Next.js App Router: layouts, pages, and parallel slots (@modal)
│   ├── api/              # Internal API proxies and prefetch engines
│   ├── titles/[id]/      # Movie/TV detail routes (intercepted by @modal)
│   ├── movies/           # Movie browsing page
│   ├── series/           # Series browsing page
│   ├── people/           # People index and detail pages
│   ├── genres/           # Genre explorer
│   ├── collections/      # Curated franchise collections
│   ├── clips/            # Trailer and clip browser
│   ├── news/             # Editorial news pages
│   ├── search/           # Search results page
│   ├── sitemap.ts        # Dynamic sitemap generation
│   └── robots.ts         # Robots.txt configuration
├── components/
│   ├── ui/               # Atomic components (Cards, Buttons, Loaders, CookieConsent, DevNotice)
│   ├── sections/         # Large, responsive page-level blocks (Hero, Grids, Navbar)
│   ├── seo/              # JSON-LD structured data component
│   ├── titles/           # Movie/TV detail components (Modal, Extended, Hero)
│   ├── collections/      # Collection detail components
│   ├── people/           # People index and detail components
│   ├── search/           # Search UI components (Modal, Header)
│   └── auth/             # Authentication components
├── lib/                  # TMDB/NYT/OMDb API clients and business logic
│   ├── tmdb.ts           # Main TMDB exports
│   ├── tmdb-movies.ts    # Movie-specific TMDB functions
│   ├── tmdb-tv.ts        # TV-specific TMDB functions
│   ├── tmdb-people.ts    # People TMDB functions
│   ├── tmdb-clips.ts     # Clip/video TMDB functions
│   ├── tmdb-cache.ts     # In-memory caching layer
│   ├── news.ts           # NYT Article Search integration
│   └── clips.ts          # Clip feed generation
├── constants/            # Static content, navigation maps, and fallback data
└── types/                # Centralized TypeScript interfaces
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **Package Manager**: npm, yarn, or pnpm

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/leviackerman2345/Frame_Meta.git
   cd Frame_Meta
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Copy `.env.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

   ```plaintext
   # TMDB API — Bearer Token from https://www.themoviedb.org/settings/api
   TMDB_ACCESS_TOKEN=your_tmdb_read_access_token_here
   TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

   # NYT API — Key from https://developer.nytimes.com/
   NYT_API_KEY=your_nyt_api_key_here

   # OMDb API — Key from https://www.omdbapi.com/apikey.aspx
   OMDB_API_KEY=your_omdb_api_key_here

   # Base URL (for SEO metadata, sitemap, and canonical URLs)
   NEXT_PUBLIC_BASE_URL=https://framemeta.app
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Architecture

### Streaming with React Suspense
FrameMeta uses granular Suspense boundaries to deliver an "Instant-On" experience. The page shell (Navbar, Layout) renders on the server and streams to the client immediately. Data-intensive sections like filmography and news feeds load independently, preventing slow API calls from blocking the initial paint.

### Deferred Section Loading
Below-fold sections use an IntersectionObserver-based `DeferredSection` component with a global loading queue. This prevents burst rendering by limiting concurrent mounts to 2 with 150ms stagger, reducing homepage scroll lag.

### Incremental Static Regeneration (ISR)
A 5-minute revalidation strategy balances data freshness with performance. Movie metadata and industry news are cached at the edge, significantly reducing API costs while keeping the platform updated with the latest releases.

### Parallel & Intercepting Routes
The platform uses `@modal` parallel routes combined with `(.)titles` intercepting routes. Clicking a movie card opens its details in a modal overlay while keeping the background feed visible. The URL updates to `/titles/[id]`, making modals fully shareable and deep-linkable.

### Optimized Search
The search modal uses a fast API endpoint (`searchMultiFast`) that skips textless poster enrichment, reducing response time from ~3s to ~300ms. Client-side caching provides instant results for repeat queries.

---

## API Integrations

- **TMDB API** — Primary source for movie/TV metadata. Uses `/discover`, `/trending`, `/search/multi`, and `/person` endpoints with textless posters and logos.
- **NYT Article Search API** — Powers the editorial section with entertainment-focused content filtering. Includes fallback caching for rate limit resilience.
- **OMDb API** — Supplements TMDB data with critical ratings (Rotten Tomatoes, IMDb, Metacritic) for the extended detail scoreboard.

---

## Performance

- **Streaming Suspense** — Granular loading states for independent page sections.
- **Deferred Sections** — IntersectionObserver with global queue prevents burst rendering.
- **Skeleton Loaders** — Shimmer placeholders for all below-fold content.
- **ISR (5min)** — Near-zero TTFB by serving pre-rendered HTML from Vercel Edge.
- **In-memory Caching** — Server-side cache for TMDB data with configurable TTLs.
- **Parallel Fetching** — Independent data resolution within Server Components to prevent waterfall delays.
- **Search Caching** — Client-side Map cache for instant repeat searches.
- **fetchWithTimeout** — All external calls wrapped in `AbortController` with a 5-second deadline.
- **Optimized LCP** — Splash screen reduced to 1.2s, priority images minimized.

---

## Security

- **server-only Guard** — API clients and sensitive logic isolated to the server bundle.
- **Security Headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- **Lucene Injection Protection** — Search queries sanitized before NYT API calls.
- **Fetch Timeouts** — Global 5-second deadline on all 3rd-party API requests.
- **Error Boundaries** — Granular recovery points ensure a failure in one section doesn't crash the page.
- **Rate Limiting** — API routes protected with per-IP rate limiting.

---

## Contributing

1. **Open an Issue** — For bugs or feature requests, open an issue first.
2. **Branching** — Use `feature/` or `fix/` prefixes for branch names.
3. **PR Checklist**:
   - Does the project build successfully? (`npm run build`)
   - Do all TypeScript checks pass?
   - Does the code follow the existing design patterns and tokens?

---

## License

This project is licensed under the **MIT License**.
