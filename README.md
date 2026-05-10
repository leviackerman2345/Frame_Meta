# FrameMeta
### Cinematic Intelligence for the Modern Discovery Era.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**FrameMeta** is a premium film, TV, and news discovery platform engineered for the modern cinephile. It bridges the gap between fragmented streaming libraries and the user's discovery intent through a high-performance, editorial-grade interface. Built with an "Apple-inspired" minimalism and a data-first philosophy, it provides a unified hub for tracking trailers, ratings, and industry headlines.

---

## 2. Features Overview

FrameMeta is designed to be a frictionless companion for cinematic exploration.

### 🎥 Discovery
*   **Curated Libraries**: Browse trending movies, top-rated series, and specialized Asian spotlights.
*   **The Vault**: Access curated franchise collections including the MCU, Star Wars, and DC Universe.
*   **Integrated Watchability**: Real-time tracking of streaming availability across global and regional platforms (Netflix, Disney+, Viu).

### 🎭 Artist Profiles
*   **Deep Filmography**: Comprehensive career tracking for actors and crew.
*   **Dynamic Bios**: Interactive biographies with career statistics and department breakdowns.
*   **Artist-Specific News**: Contextual news articles fetched dynamically based on the current profile.

### 📰 Editorial News
*   **NYT Integration**: Live headlines and deep-dives powered by the New York Times Article Search API.
*   **Archive Awareness**: Automatic fallback and staleness detection to ensure news relevance.
*   **High-Fidelity Layouts**: Multi-column editorial designs with rich typography.

### 🚀 Performance & Design
*   **Zero-Blocking Shell**: Instant page loads via granular React Suspense boundaries.
*   **Apple-Inspired Aesthetic**: Dark-first design, Inter typography, and liquid-glass UI elements.
*   **ISR & Streaming**: Incremental Static Regeneration ensures 1-hour freshness with near-zero latency.

---

## 3. Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4.0 |
| **Animations** | Framer Motion |
| **APIs** | TMDB, NYT Article Search, OMDb |
| **Fonts** | Inter via `next/font` |
| **Deployment** | Vercel |

---

## 4. Project Structure

```text
src/
├── app/              # Next.js App Router: layouts, pages, and parallel slots (@modal)
│   ├── api/          # Internal API proxies and prefetch engines
│   ├── actor/        # Actor profile engine with parallel Suspense
│   └── titles/       # Movie/TV detail routes (intercepted by @modal)
├── components/       
│   ├── ui/           # Atomic components (Cards, Buttons, Loaders)
│   ├── sections/     # Large, responsive page-level blocks (Hero, Grids)
│   └── [domain]/     # Feature-specific complex components (ArtistHero, etc.)
├── lib/              # The "Brain": TMDB/NYT API clients and business logic
├── constants/        # Static content, navigation maps, and fallback news data
├── styles/           # Global CSS and Tailwind 4.0 theme configuration
└── types/            # Centralized TypeScript interfaces for strict type safety
```

---

## 5. Getting Started

### Prerequisites
*   **Node.js**: v26 or higher
*   **Package Manager**: npm or yarn

### Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/leviackerman2345/Frame_Meta-FullStack-.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory.
    ```plaintext
    # TMDB API Access Token (Bearer Token from https://www.themoviedb.org/settings/api)
    TMDB_ACCESS_TOKEN="your_tmdb_token_here"

    # NYT API Key (from https://developer.nytimes.com/)
    NYT_API_KEY="your_nyt_key_here"

    # OMDb API Key (from http://www.omdbapi.com/)
    OMDB_API_KEY="your_omdb_key_here"
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 6. Architecture Overview

### ⚡ Streaming Architecture
FrameMeta utilizes **React Suspense** to deliver an "Instant-On" experience. The page shell (Navbar, Layout) renders on the server and is sent to the client immediately. Data-intensive sections like the filmography and news feeds are streamed in as independent chunks. This prevents slow 3rd-party API calls (like TMDB or NYT) from blocking the initial paint.

### 🔄 Incremental Static Regeneration (ISR)
We use a **1-hour revalidation (ISR)** strategy. This was chosen to balance data freshness with performance. Movie metadata and industry news are stable enough that 60-minute caching significantly reduces API costs and server load while keeping the platform updated with the latest releases.

### 🎭 Parallel & Intercepting Routes
The platform uses the **@modal parallel route** combined with **(.)titles intercepting routes**. This allows users to click a movie card and open its details in a modal overlay while keeping the background search or discovery feed visible. The URL updates to `/titles/[id]`, making the modal fully shareable and deep-linkable.

### 🛠️ The Actor Page Fix
In `CastCard.tsx`, navigation to an actor profile uses `window.location.href` instead of `router.push()`. 
**Why?** Because `router.push()` in Next.js can be intercepted by parallel route slots. Since the actor page is a top-level page and not a modal, using a hard navigation bypasses the `@modal` interceptor entirely, ensuring the browser makes a fresh request to the new page shell without conflicting with the active modal state.

---

## 7. API Integrations

*   **TMDB API**: The primary source for movie/TV metadata. We use the `/discover`, `/trending`, and `/person` endpoints. Requests are enriched with textless posters and logos via a custom concurrency-limited worker pool.
*   **NYT Article Search API**: Powers the editorial section. We utilize Lucene query strings to filter for cinema-related content. A robust fallback system serves cached content if the NYT rate limits (4000/day) are hit.
*   **OMDb API**: Supplements TMDB data with critical ratings (Rotten Tomatoes, IMDb). It provides the "Scoreboard" metadata found in the extended detail views.

---

## 8. Performance

*   **Streaming with Suspense**: Granular loading states for independent page sections.
*   **ISR (1hr)**: Near-zero TTFB by serving pre-rendered HTML from the Vercel Edge.
*   **In-memory Caching**: A 30-minute server-side cache for expensive image-enrichment transforms.
*   **Parallel Fetching**: Independent data resolution within Server Components to prevent waterfall delays.
*   **Hover Prefetching**: High-priority background fetches trigger on user hover to "warm" the cache before the click.
*   **fetchWithTimeout**: All external calls are wrapped in an `AbortController` to prevent server hanging on slow upstream responses.

---

## 9. Security

*   **server-only Guard**: API clients and sensitive logic are isolated to the server to prevent leakage to the client bundle.
*   **Lucene Injection Protection**: Artist search queries are sanitized and escaped before being embedded in NYT API calls.
*   **Fetch Timeouts**: Global 5-second deadline on all 3rd-party API requests.
*   **Secure Context Guard**: Clipboard operations for sharing are protected by `isSecureContext` checks.
*   **Error Boundaries**: Granular recovery points ensure that a failure in one section (e.g., News) doesn't crash the entire page.

---

## 10. Known Limitations

*   **Author Metadata**: The NYT API does not provide author photos; the editorial team uses the NYT mark or generic avatars as a fallback.
*   **Rate Limiting**: The current in-memory rate limiter resets on serverless cold starts.
*   **Quota Limits**: The free tier of the NYT API is limited to 4000 requests per day, which may lead to fallback content during high-traffic windows.
*   **Fallback Staleness**: Hardcoded news articles expire after 30 days and will trigger a developer warning to update the fallback constants.

---

## 11. Roadmap

*   [ ] **Distributed Rate Limiting**: Implementing Upstash Redis for global quota management.
*   [ ] **Real-time Monitoring**: Automated alerting for NYT/TMDB API health and quota usage.
*   [ ] **Dynamic OG Images**: Automated OpenGraph image generation for movies and actor profiles.
*   [ ] **User Personalization**: A follow system for actors and movies with personalized notifications.

---

## 12. Contributing

1.  **Open an Issue**: For bugs or feature requests, please open an issue first.
2.  **Branching**: Use `feature/` or `fix/` prefixes for all branch names.
3.  **PR Checklist**:
    *   Does the project build successfully? (`npm run build`)
    *   Do all TypeScript checks pass?
    *   Does the code follow the "Apple-inspired" minimalism and existing design tokens?

---

## 13. License

This project is licensed under the **MIT License**.