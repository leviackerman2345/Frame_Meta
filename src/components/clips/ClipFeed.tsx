"use client"

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Clip } from '@/types/types';
import { getClipFeed } from '@/lib/clips';
import ClipPlayer from './ClipPlayer';
import ClipOverlay from './ClipOverlay';

interface ClipFeedProps {
  initialClips: Clip[];
}

export default function ClipFeed({ initialClips }: ClipFeedProps) {
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelObserver = useRef<IntersectionObserver | null>(null);

  // IntersectionObserver to update activeIndex
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 } // Slightly lower threshold for faster activation response
    );

    if (containerRef.current) {
      const slots = containerRef.current.querySelectorAll('.clip-slot');
      slots.forEach((slot) => observer.observe(slot));
    }

    return () => observer.disconnect();
  }, [clips]);

  // Centralized Modal State Tracking
  const pathname = usePathname();
  useEffect(() => {
    const match = pathname.match(/\/titles\/(\d+)/);
    if (match) {
      const tmdbId = parseInt(match[1], 10);
      const activeClip = clips.find(c => c.tmdbId === tmdbId);
      if (activeClip) {
        setOpenModalId(activeClip.id);
      }
    } else {
      setOpenModalId(null);
    }
  }, [pathname, clips]);

  // Proactive Background Fetch Logic
  const loadMoreClips = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const newClips = await getClipFeed({ page: nextPage, limit: 10 });

      if (newClips.length > 0) {
        setClips((prev) => [...prev, ...newClips]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load next clips:', err);
      setError('Failed to load next clips');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Sentinel Ref Callback: Attaches an observer to the 3rd-to-last item
  // When this item is approached, we trigger the background fetch.
  const sentinelRef = (node: HTMLDivElement | null) => {
    if (sentinelObserver.current) sentinelObserver.current.disconnect();

    if (node && hasMore && !isLoadingMore) {
      sentinelObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreClips();
        }
      }, { threshold: 0.1 });
      sentinelObserver.current.observe(node);
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative bg-black"
    >
      {clips.map((clip, index) => {
        const isModalOpen = openModalId === clip.id;
        const externalIsActive = index === activeIndex;
        // Sentinel is placed 3 items before the end to hide network latency
        const isSentinel = index === clips.length - 3;

        return (
          <div
            key={`${clip.id}-${index}`}
            ref={isSentinel ? sentinelRef : null}
            data-index={index}
            className="clip-slot relative h-screen w-full snap-start snap-always flex-shrink-0 overflow-hidden bg-black"
          >
            <ClipPlayer clip={clip} isActive={!isModalOpen && externalIsActive} isFirst={index === 0} />
            <ClipOverlay clip={clip} isActive={externalIsActive} />
          </div>
        );
      })}

      {/* Error state (Toast style so it doesn't break flow) */}
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 text-white text-sm px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-md border border-white/10 shadow-2xl">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}