# FrameMeta

FrameMeta is a high-fidelity, Apple-inspired cinematic movie and TV series catalog built using the cutting-edge capabilities of **Next.js 16**, **React 19**, and **Tailwind CSS v4**.

## ✨ Key Features

- **Apple-Inspired Cinematic Interface**: Designed to wow users with vibrant gradients, sleek dark mode layouts, glassmorphism, and smooth micro-animations.
- **Instant-Load "Shell-Pattern" Details**: Leverages Next.js Parallel and Intercepting Routes to instantly open media detail modals with partial data, while full data (cast, trailers, streaming links) hydrates seamlessly in the background.
- **Dynamic Content Discovery**: Fetches real-time media details from the TMDB API, featuring textless high-resolution posters, "Asian Spotlight", "Coming Soon", and "Top 10" sections.
- **State Management**: Built-in state synchronization using Zustand to ensure consistent modal and page state across routing transitions.
- **Curated News Integration**: Displays the latest cinema updates via NewsAPI integration.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19
- **Styling**: Tailwind CSS v4 (with Vanilla CSS utility integration)
- **State/Data**: Zustand & SWR
- **Motion**: Framer Motion
- **UI Components**: Base UI / Radix primitives

## 📂 Project Structure

```
src/
├── app/          → App Router (pages, layouts, parallel routes `@modal`)
├── components/   → Reusable UI components & homepage sections
├── contexts/     → React Context Providers
├── data/         → Static data and constant templates
├── hooks/        → Custom React hooks (SWR fetchers, etc.)
├── lib/          → Utilities, state store (Zustand), and TMDB wrappers
└── styles/       → Component-level styling modules
public/           → Static public assets
```

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js installed on your system.

### 2. Environment Setup
Create a `.env.local` file in the root directory and add the following keys:

```env
# TMDB API Configuration
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=your_tmdb_access_token_here

# News API Configuration
NEWS_API_KEY=your_news_api_key_here
```

### 3. Run Development Server
Install your dependencies and start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start viewing your cinematic dashboard.

## 📜 Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start development server   |
| `npm run build`   | Build for production       |
| `npm run start`   | Start production server    |
| `npm run lint`    | Run ESLint                 |
