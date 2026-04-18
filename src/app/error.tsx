"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-foreground/40">
        Error
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-foreground/60">
        An unexpected error has occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Try again
      </button>
    </div>
  );
}
