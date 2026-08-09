"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Video } from '@/data/videos';
import { FeaturedVideo } from './FeaturedVideo';
import { VideoCategoryFilter } from './VideoCategoryFilter';
import { VideoGrid } from './VideoGrid';
import { VideoPlayer } from './VideoPlayer';
import { X, Calendar, Clock } from 'lucide-react';

export const VideoContainer: React.FC<{videos: Video[]}> = ({videos: initialVideos}) => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalVideo, setActiveModalVideo] = useState<Video | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalVideo(null);
      }
    };
    if (activeModalVideo) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalVideo]);
  // Videos are provided from server via props; no client fetch needed

  // Find default featured video
  const featuredVideo = useMemo(() => {
    return videos.find((v) => v.featured) || videos[0];
  }, [videos]);

  // Filtered video list
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'ALL' || video.category === selectedCategory;

      // Search query match
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        (video.author && video.author.toLowerCase().includes(query)) ||
        (video.tags && video.tags.some((t) => t.toLowerCase().includes(query)));

      return matchesCategory && matchesQuery;
    });
  }, [videos, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Featured Video Section */}
      {featuredVideo && (
        <FeaturedVideo video={featuredVideo} />
      )}

      {/* Filter and Search Header */}
      <VideoCategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalResults={filteredVideos.length}
      />

      {/* Main Video Grid */}
      <VideoGrid
        videos={filteredVideos}
        onSelectVideo={(video) => setActiveModalVideo(video)}
      />

      {/* Video Modal Player Dialog */}
      {activeModalVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModalVideo(null)}
        >
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-video-title"
            className="relative w-full max-w-full min-w-0 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-850 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                  {activeModalVideo.category}
                </span>
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline-block">
                  Intelligence Briefing
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalVideo(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Facade Player */}
            <div className="p-4 md:p-6 space-y-6">
              <VideoPlayer
                youtubeId={activeModalVideo.youtubeId}
                title={activeModalVideo.title}
                autoPlay={true}
              />

              <div>
                <h2 id="modal-video-title" className="text-xl md:text-2xl font-bold font-display text-white mb-2">
                  {activeModalVideo.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 mb-4">
                  <span>Author: <strong className="text-zinc-200">{activeModalVideo.author || "AiX Intelligence"}</strong></span>
                  {activeModalVideo.publishedDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      {activeModalVideo.publishedDate}
                    </span>
                  )}
                  {activeModalVideo.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {activeModalVideo.duration}
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  {activeModalVideo.description}
                </p>

                {activeModalVideo.tags && activeModalVideo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeModalVideo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
