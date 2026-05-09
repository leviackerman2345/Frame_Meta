"use client";

import { ErrorBoundary } from "react-error-boundary";
import { ReactNode } from "react";

interface SectionErrorBoundaryProps {
  children: ReactNode;
  label: string;
}

function SectionError({ label, resetErrorBoundary }: { label: string; resetErrorBoundary: () => void }) {
  return (
    <div className="w-full py-12 px-6 flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">
        {label} failed to load
      </p>
      <button
        onClick={() => resetErrorBoundary()}
        className="px-5 py-2.5 rounded-2xl border border-white/20 text-white/60 text-xs font-bold uppercase tracking-widest hover:border-white/50 hover:text-white transition-all"
      >
        Try Again
      </button>
    </div>
  );
}

export function SectionErrorBoundary({ children, label }: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <SectionError label={label} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
