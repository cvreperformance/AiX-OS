"use client";

import React, { useState } from 'react';
import { Play, Video as VideoIcon, ShieldCheck } from 'lucide-react';

interface PropertyVideoPlayerProps {
  videoUrl: string;
  videoProvider?: string;
  videoThumbnail?: string;
  propertyTitle?: string;
  className?: string;
}

export function parsePropertyVideoUrl(url: string): {
  provider: 'youtube' | 'vimeo' | 'unknown';
  embedId: string | null;
  embedUrl: string | null;
  defaultThumbnail: string | null;
} {
  if (!url) {
    return { provider: 'unknown', embedId: null, embedUrl: null, defaultThumbnail: null };
  }

  const cleanUrl = url.trim();

  // YouTube regex patterns
  const youtubeMatch = cleanUrl.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (youtubeMatch && youtubeMatch[1]) {
    const embedId = youtubeMatch[1];
    return {
      provider: 'youtube',
      embedId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1&rel=0&modestbranding=1`,
      defaultThumbnail: `https://img.youtube.com/vi/${embedId}/maxresdefault.jpg`,
    };
  }

  // Vimeo regex patterns
  const vimeoMatch = cleanUrl.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+))/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    const embedId = vimeoMatch[1];
    return {
      provider: 'vimeo',
      embedId,
      embedUrl: `https://player.vimeo.com/video/${embedId}?autoplay=1&dnt=1`,
      defaultThumbnail: null,
    };
  }

  return { provider: 'unknown', embedId: null, embedUrl: null, defaultThumbnail: null };
}

export const PropertyVideoPlayer: React.FC<PropertyVideoPlayerProps> = ({
  videoUrl,
  videoThumbnail,
  propertyTitle = "Property Video Tour",
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const parsed = parsePropertyVideoUrl(videoUrl);

  if (!parsed.embedUrl) {
    return null;
  }

  const initialThumbnail =
    videoThumbnail || parsed.defaultThumbnail || `https://img.youtube.com/vi/${parsed.embedId}/maxresdefault.jpg`;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 uppercase">
            <VideoIcon className="w-3.5 h-3.5 text-amber-400" />
            4K Video Tour
          </span>
          <span className="text-xs font-mono text-zinc-400 uppercase">
            {parsed.provider} Presentation
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-xs text-zinc-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Verified Property Media
        </span>
      </div>

      {/* Facade Player Frame */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800/80 shadow-2xl aspect-video group">
        {isPlaying ? (
          <iframe
            src={parsed.embedUrl}
            title={propertyTitle}
            className="w-full h-full border-0 absolute inset-0 rounded-3xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="w-full h-full relative block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-3xl overflow-hidden cursor-pointer group"
            aria-label={`Play Video Tour for ${propertyTitle}`}
          >
            {/* Thumbnail Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={initialThumbnail}
              alt={`Video tour preview for ${propertyTitle}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:via-black/30 transition-all duration-300" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full bg-amber-500/20 blur-xl group-hover:bg-amber-500/40 group-hover:scale-125 transition-all duration-500" />
                
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-900/90 border border-amber-500/40 backdrop-blur-md flex items-center justify-center text-amber-400 group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 shadow-2xl shadow-amber-500/20">
                  <Play className="w-7 h-7 md:w-9 md:h-9 ml-1 fill-current transition-transform group-hover:scale-110" />
                </div>
              </div>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex items-end justify-between pointer-events-none">
              <div>
                <span className="inline-block text-[11px] font-mono tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md mb-2">
                  Interactive Video Tour
                </span>
                <h3 className="text-white font-semibold text-base md:text-lg line-clamp-1 group-hover:text-amber-200 transition-colors">
                  {propertyTitle} — Virtual Walkthrough
                </h3>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
