"use client";

import React, { useState } from "react";
import Image from "next/image";

interface AuthorAvatarProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}

/**
 * Premium Author Avatar component with automatic fallback.
 * It attempts to load the provided src (e.g. NYT headshot) and falls back to a
 * high-contrast circular monogram if the image fails to load or is missing.
 */
export function AuthorAvatar({ src, name, size = 56, className = "" }: AuthorAvatarProps) {
  const [error, setError] = useState(false);

  // Extract initials for the monogram fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Deterministic background color based on name
  const colors = [
    "bg-indigo-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-amber-600",
    "bg-sky-600",
    "bg-violet-600",
  ];
  const charSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const bgColor = colors[charSum % colors.length];

  return (
    <div
      className={`relative rounded-full overflow-hidden flex-shrink-0 bg-black shadow-2xl ${className}`}
      style={{ width: size, height: size }}
    >
      {src && !error ? (
        <Image
          src={src}
          alt={`${name} profile photo`}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setError(true)}
          unoptimized // Often better for external staff headshots to avoid double-optimization issues
        />
      ) : (
        <div className={`absolute inset-0 flex items-center justify-center ${bgColor}`}>
          <span
            className="font-black text-white uppercase tracking-tighter"
            style={{ fontSize: size * 0.4 }}
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
