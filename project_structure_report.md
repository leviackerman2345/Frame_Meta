# FrameMeta Project Structure Report

## 1. Directory Overview
FrameMeta follows a standardized Next.js structure with clear separation of concerns between UI, logic, and configuration.

```text
src/
├── app/            # App Router (Routes, Layouts, APIs)
├── components/     # UI Components (Domain-specific & Generic)
├── constants/      # Static Config & Fallback Data
├── contexts/       # React Context Providers
├── data/           # Static or Mock Data
├── hooks/          # Custom React Hooks
├── lib/            # Business Logic & API Clients
├── styles/         # Global & Component-specific CSS
└── types/          # TypeScript Definitions
```

---

## 2. Component Hierarchy
The component architecture is divided into three distinct layers to maximize reusability and maintainability.

### 2.1 UI Layer (`src/components/ui`)
Atomic, low-level components used throughout the application.
*   **Base Elements**: `button.tsx`, `AuthorAvatar.tsx`, `FollowButton.tsx`.
*   **Interactive Cards**: `MediaCard.tsx`, `NewsCard.tsx`, `CastCard.tsx`.
*   **Loaders**: `InitialLoader.tsx`, `LoadingScreen.tsx`, `SkeletonCardGrid.tsx`.
*   **Visual Effects**: `BorderGlow.tsx`, `TitleLogo.tsx`.

### 2.2 Section Layer (`src/components/sections`)
Large, responsive blocks that compose pages.
*   **Navigation & Footer**: `Navbar.tsx`, `Footer.tsx`.
*   **Content Grids**: `Top10Movies.tsx`, `AsianSpotlight.tsx`, `NewReleases.tsx`.
*   **Marketing/Engagement**: `Newsletter.tsx`, `Partners.tsx`, `FAQ.tsx`.

### 2.3 Domain Layer (`src/components/[domain]`)
Highly specialized components for complex detail views.
*   **Actor**: `ArtistHero.tsx`, `ArtistFilmography.tsx`, `BiographyToggle.tsx`.
*   **Titles**: `MovieDetailsHero.tsx`, `MovieDetailsMeta.tsx`, `MovieDetailsModal.tsx`.
*   **Collections**: `CollectionDetailsExtended.tsx`.

---

## 3. Routing Strategy
The application leverages the full power of the Next.js App Router for advanced navigation patterns.

### 3.1 Parallel & Intercepting Routes
*   **Slot**: `@modal/`
*   **Pattern**: Intercepts `titles/[id]` routes using `(.)titles/[id]`.
*   **UX Benefit**: Allows a movie or TV show detail view to open in a modal overlay while the background page (e.g., Home or Search) remains visible and interactive.

### 3.2 Dynamic Data Fetching Routes
*   **Actor**: `/actor/[id]` (Dynamic profile pages).
*   **News**: `/news/[slug]` (SEO-friendly article slugs).
*   **Titles**: `/titles/[id]` (Deep-link detail pages).
*   **Search**: `/search` (URL-driven query engine).

---

## 4. Logical Engine (`src/lib`)
Business logic is strictly decoupled from the UI to ensure testability and performance.

*   **`tmdb.ts`**: The core movie/TV data engine. Handles authentication, complex transformations, and module-level caching for images.
*   **`news.ts`**: The editorial engine. Interfaces with external news APIs (NYT) and handles slug sanitization and fallback logic.
*   **`animations.ts`**: Centralized Framer Motion configuration and variant definitions.
*   **`carousel.ts`**: Logic for managing the state of infinite horizontal scrollers.

---

## 5. Organizational Patterns
*   **Co-location**: `error.tsx` and `loading.tsx` are co-located with their respective `page.tsx` to provide immediate, contextual feedback during data fetching.
*   **Naming Convention**: Components use **PascalCase** (`MediaCard.tsx`), while utilities and logic files use **kebab-case** or **camelCase** (`tmdb.ts`, `fetch-with-timeout.ts`).
*   **Type Safety**: A centralized `types/types.ts` file ensures consistent interfaces between the API layer and the UI components.
