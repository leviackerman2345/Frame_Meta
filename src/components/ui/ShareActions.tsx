"use client";

import React, { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";

interface ShareActionsProps {
  url?: string;
  title?: string;
}

/**
 * Client-side interactive share buttons.
 * Uses Lucide for UI icons and React-Icons (FontAwesome 6) for brand-specific social logos.
 */
export function ShareActions({ url, title }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || "Check out this article on FrameMeta";

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fail silently
      }
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const shareOnX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(xUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Copy Link Button - Icon Only */}
      <button
        onClick={handleCopyLink}
        aria-label={copied ? "Link copied" : "Copy link to article"}
        title={copied ? "Link copied" : "Copy link to article"}
        className="liquid-fill liquid-copy p-3 rounded-2xl border border-white/5 transition-all active:scale-95 group"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-400 relative z-10" />
        ) : (
          <Copy className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors relative z-10" />
        )}
      </button>

      {/* Social Media Buttons - Using React-Icons for Brands */}
      <div className="flex items-center gap-2">
        {/* X (formerly Twitter) */}
        <button
          onClick={shareOnX}
          aria-label="Share on X"
          title="Share on X"
          className="liquid-fill liquid-x p-3 rounded-2xl border border-white/5 text-zinc-400 hover:text-white transition-all active:scale-95 group"
        >
          <FaXTwitter className="w-4 h-4 relative z-10" />
        </button>

        {/* Facebook */}
        <button
          onClick={shareOnFacebook}
          aria-label="Share on Facebook"
          title="Share on Facebook"
          className="liquid-fill liquid-facebook p-3 rounded-2xl border border-white/5 text-zinc-400 hover:text-white transition-all active:scale-95 group"
        >
          <FaFacebookF className="w-4 h-4 relative z-10" />
        </button>

        {/* More Options */}
        <button
          onClick={handleNativeShare}
          aria-label="More sharing options"
          title="More sharing options"
          className="liquid-fill liquid-share p-3 rounded-2xl border border-white/5 text-zinc-400 hover:text-white transition-all active:scale-95 group"
        >
          <Share2 className="w-4 h-4 relative z-10" />
        </button>
      </div>
    </div>
  );
}
