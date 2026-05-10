// FIX 6 — Route-level error boundary via Next.js App Router error.tsx convention.
//
// Why error.tsx instead of a manual <ErrorBoundary> wrapper inside page.tsx?
//   • Next.js App Router automatically wraps each route segment in a React
//     error boundary when an error.tsx file exists in that segment's directory.
//   • A manual ErrorBoundary inside a Server Component is not straightforward
//     because Server Components cannot use class-based lifecycle methods.
//   • error.tsx must be a "use client" component because React error boundaries
//     can only be implemented in client components (they rely on componentDidCatch
//     or the equivalent hook, which requires the client runtime).
//   • The reset() callback provided by Next.js re-renders the route segment
//     from scratch without a full page reload, giving the user a recovery path.

"use client";

import React from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NewsArticleError({ error, reset }: ErrorProps) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-lg w-full text-center space-y-10">

        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-[1.6rem] bg-zinc-900 border border-white/5 flex items-center justify-center shadow-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
            Article Unavailable
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
            Something went wrong while loading this article. This is usually a
            temporary issue — try again in a moment.
          </p>
        </div>

        {/* Digest (dev-only) */}
        {error.digest && (
          <p className="text-[11px] font-mono text-zinc-600 tracking-wide">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          {/* Retry — calls Next.js reset() to re-render the route segment */}
          <button
            onClick={reset}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            Try Again
          </button>

          {/* Fallback navigation */}
          <a
            href="/news"
            className="px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white text-sm font-black uppercase tracking-widest transition-all active:scale-95"
          >
            Back to News
          </a>
        </div>
      </div>
    </main>
  );
}
