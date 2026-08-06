"use client";

import React, { useState } from 'react';
import { Play, Clock, Calendar, Eye, Tag } from 'lucide-react';
import { Video, getYouTubeThumbnail } from '@/data/videos';

interface VideoCardProps {
  video: Video;
  onSelectVideo: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onSelectVideo }) => {
  const [imgSrc, setImgSrc] = useState(getYouTubeThumbnail(video.youtubeId, "hq"));

  const handleImageError = () => {
    setImgSrc(getYouTubeThumbnail(video.youtubeId, "hq"));
  };

  return (
    <article
      onClick={() => onSelectVideo(video)}
      className="group relative flex flex-col bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={video.title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center text-[10px] font-mono tracking-wider text-amber-300 uppercase bg-black/75 backdrop-blur-md border border-amber-500/30 px-2.5 py-1 rounded-full">
            {video.category}
          </span>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-300 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-zinc-800">
              <Clock className="w-3 h-3 text-amber-400" />
              {video.duration}
            </span>
          </div>
        )}

        {/* Hover Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-xs">
          <div className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2 font-mono">
            {video.publishedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-500" />
                {video.publishedDate}
              </span>
            )}
            {video.views && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-zinc-500" />
                {video.views} views
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-2 mb-2 leading-snug">
            {video.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {video.description}
          </p>
        </div>

        {/* Footer & Tags */}
        <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">
            {video.author || "AiX Intelligence"}
          </span>

          {video.tags && video.tags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Tag className="w-3 h-3 text-amber-500/70 flex-shrink-0" />
              <span className="text-[11px] text-zinc-400 font-mono truncate max-w-[120px]">
                {video.tags[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
