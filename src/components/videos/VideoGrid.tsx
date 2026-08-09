"use client";

import React from 'react';
import { Video } from '@/data/videos';
import { VideoCard } from './VideoCard';
import { VideoOff } from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, onSelectVideo }) => {
  if (videos.length === 0) {
    return (
      <div className="py-16 text-center bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-8">
        <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-zinc-300 mb-1 font-display">No videos are currently available.</h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          No video intelligence matches your current search criteria or category filter. Try clearing filters or searching for alternative keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onSelectVideo={onSelectVideo} />
      ))}
    </div>
  );
};
