"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clip } from "@/types/types";

/**
 * Z-INDEX HIERARCHY:
 * z-0: iframe (video content)
 * z-10: transparent interaction blocker (prevents direct YouTube interaction)
 * z-20: targeted overlay bars (top/bottom gradient bars)
 */

interface ClipPlayerProps { clip: Clip; isActive: boolean; isFirst?: boolean; }

export default function ClipPlayer({ clip, isActive, isFirst = false }: ClipPlayerProps) {
  const [shouldZoom, setShouldZoom] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // SMART ZOOM LOGIC — Only scale up if there is empty space on the left/right
  useEffect(() => {
    const checkAspectRatio = () => {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const containerRatio = containerWidth / containerHeight;
      const videoRatio = 16 / 9;
      setShouldZoom(containerRatio > videoRatio);
    };
    checkAspectRatio();
    window.addEventListener('resize', checkAspectRatio);
    return () => window.removeEventListener('resize', checkAspectRatio);
  }, []);

  // Quality management via postMessage
  useEffect(() => {
    if (!isActive || !iframeRef.current) return;

    const requestHighestQuality = () => {
      const qualities = ['hd2160', 'hd1440', 'hd1080', 'hd720'];
      qualities.forEach((quality, index) => {
        setTimeout(() => {
          if (!iframeRef.current) return;
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: [quality] }),
            '*'
          );
        }, index * 400);
      });
    };

    // Pulsing logic: Initial staggered request, followed by "nudges" at 3s, 4s, and 5s
    requestHighestQuality();
    const timers = [3000, 4000, 5000].map(delay => setTimeout(requestHighestQuality, delay));

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  const embedUrl = `https://www.youtube.com/embed/${clip.youtubeId}`
    + `?autoplay=1`          // plays immediately when slot becomes active
    + `&controls=0`          // hides all YouTube UI controls
    + `&modestbranding=1`    // removes YouTube logo watermark
    + `&rel=0`               // prevents related videos from showing
    + `&showinfo=0`          // hides video title overlay
    + `&iv_load_policy=3`    // disables video annotations
    + `&disablekb=1`         // disables keyboard shortcuts on iframe
    + `&loop=1`              // loops clip continuously
    + `&playlist=${clip.youtubeId}` // required alongside loop=1 for single video looping
    + `&vq=hd1080`           // requests 1080p quality (more reliably respected)
    + `&enablejsapi=1`;      // enables postMessage JS API

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black"
      style={{ isolation: 'isolate' }}
    >
      {/* z-10: Transparent interaction blocker */}
      <div className="absolute inset-0 z-10 pointer-events-auto" />

      {/* TARGETED OVERLAYS - Reset animation on every clip change */}
      {isActive && (
        <>
          {/* Top Bar Overlay */}
          <motion.div 
            key={`top-${clip.youtubeId}`}
            className="absolute top-0 w-full h-[15%] bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Bottom Bar Overlay - Increased height to 18% and made solid area deeper to hide the red line */}
          <motion.div 
            key={`bottom-${clip.youtubeId}`}
            className="absolute bottom-0 w-full h-[18%] bg-gradient-to-t from-black via-black/90 to-transparent z-20 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </>
      )}

      <AnimatePresence>
        {isActive && (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0"
          >
            {/* Smart Zoom Iframe */}
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-0 origin-center transition-transform duration-300"
              style={{
                /* GPU acceleration */
                transform: shouldZoom ? 'scale(1.15) translateZ(0)' : 'scale(1) translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                willChange: 'transform'
              }}
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              loading="lazy"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
