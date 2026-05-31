"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";

// Global queue: only N sections can mount at a time to prevent burst rendering
const pendingQueue: Array<() => void> = [];
let activeLoads = 0;
const MAX_CONCURRENT = 2;

function processQueue() {
  if (activeLoads >= MAX_CONCURRENT || pendingQueue.length === 0) return;
  activeLoads++;
  const next = pendingQueue.shift()!;
  next();
}

function enqueueLoad(resolve: () => void) {
  pendingQueue.push(() => {
    resolve();
    // Allow next section to mount after a small stagger
    setTimeout(() => {
      activeLoads--;
      processQueue();
    }, 150);
  });
  processQueue();
}

interface DeferredSectionProps {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
}

export function DeferredSection({
  children,
  fallback,
  rootMargin = "50px",
}: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const activate = useCallback(() => setIsVisible(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          enqueueLoad(activate);
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin, activate]);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
}
