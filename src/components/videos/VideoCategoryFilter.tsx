"use client";

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { VideoCategory, VIDEO_CATEGORIES } from '@/data/videos';

interface VideoCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

export const VideoCategoryFilter: React.FC<VideoCategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalResults,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Controls Bar: Search & Results Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search intelligence briefings, keywords, tags..."
            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-amber-500/60 rounded-xl pl-10 pr-9 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 self-end sm:self-center">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Showing <strong className="text-white">{totalResults}</strong> briefing{totalResults === 1 ? '' : 's'}</span>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="w-full max-w-full min-w-0">
        <div className="flex flex-wrap items-center gap-2 pb-2 pt-1 w-full max-w-full min-w-0">
          <button
            type="button"
            onClick={() => onSelectCategory('ALL')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-medium font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-semibold'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
            }`}
          >
            All Briefings
          </button>

          {VIDEO_CATEGORIES.map((cat: VideoCategory) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-medium font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-semibold'
                    : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
