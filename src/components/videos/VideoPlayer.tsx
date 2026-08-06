"use client";

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { getYouTubeThumbnail } from '@/data/videos';

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeId,
  title,
  className = "",
  autoPlay = false,
  onPlayStateChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [imgSrc, setImgSrc] = useState(getYouTubeThumbnail(youtubeId, "maxres"));

  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlayStateChange) {
      onPlayStateChange(true);
    }
  };

  const handleImageError = () => {
    // Fallback to hqdefault if maxresdefault doesn't exist for this video
    setImgSrc(getYouTubeThumbnail(youtubeId, "hq"));
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-2xl aspect-video group ${className}`}>
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          className="w-full h-full border-0 absolute inset-0 rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={handlePlay}
          className="w-full h-full relative block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-2xl overflow-hidden cursor-pointer group"
          aria-label={`Play video: ${title}`}
        >
          {/* Static Thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={title}
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:via-black/30 transition-all duration-300" />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <div className="absolute w-20 h-20 rounded-full bg-amber-500/20 blur-xl group-hover:bg-amber-500/40 group-hover:scale-125 transition-all duration-500" />
              
              {/* Play Button Circle */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-900/90 border border-amber-500/40 backdrop-blur-md flex items-center justify-center text-amber-400 group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 shadow-2xl shadow-amber-500/20">
                <Play className="w-7 h-7 md:w-9 md:h-9 ml-1 fill-current transition-transform group-hover:scale-110" />
              </div>
            </div>
          </div>

          {/* Bottom Info Bar Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex items-end justify-between pointer-events-none">
            <div className="max-w-xl">
              <span className="inline-block text-[11px] font-mono tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md mb-2">
                Click to Watch
              </span>
              <h3 className="text-white font-medium text-base md:text-lg line-clamp-1 group-hover:text-amber-200 transition-colors">
                {title}
              </h3>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
