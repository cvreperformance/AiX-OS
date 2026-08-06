"use client";

import React from 'react';
import { Video } from '@/data/videos';
import { VideoPlayer } from './VideoPlayer';
import { Sparkles, Calendar, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface FeaturedVideoProps {
  video: Video;
}

export const FeaturedVideo: React.FC<FeaturedVideoProps> = ({ video }) => {
  return (
    <section aria-label="Featured Intelligence Video" className="mb-12">
      <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950/80 border border-zinc-800/80 p-6 md:p-8 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header Badge */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Featured Intelligence
            </span>
            <span className="hidden sm:inline-block text-xs text-zinc-500 font-mono">
              Exclusive Briefing
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
            {video.publishedDate && (
              <span className="hidden md:flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {video.publishedDate}
              </span>
            )}
            {video.duration && (
              <span className="flex items-center gap-1 bg-zinc-800/60 px-2 py-0.5 rounded text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {video.duration}
              </span>
            )}
          </div>
        </div>

        {/* Hero Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Facade Player (7 cols) */}
          <div className="lg:col-span-7">
            <VideoPlayer youtubeId={video.youtubeId} title={video.title} />
          </div>

          {/* Video Metadata & CTA (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-amber-400/90 uppercase tracking-widest">
                  {video.category}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-mono text-zinc-400">
                  {video.author || "Cristian Vaduva"}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-display text-white tracking-tight leading-tight mb-4">
                {video.title}
              </h2>

              <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                {video.description}
              </p>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {video.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 px-2.5 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Consultation Banner Callout */}
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Private Capital Briefing
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Looking for customized real estate portfolio underwriting?
                  </p>
                </div>
              </div>

              <a
                href="mailto:contact@aix-os.com?subject=Private%20Investment%20Consultation%20Request"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 rounded-lg transition-colors border border-amber-500/30 font-mono whitespace-nowrap"
              >
                Request Advisory
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
