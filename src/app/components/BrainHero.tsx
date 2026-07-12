import React from 'react';

interface BrainHeroProps {
  heading: string; // Can include HTML tags like <br />
  subheading: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

/**
 * Central hero section for the Home Find platform.
 * It applies the premium dark‑theme background and showcases the headline,
 * sub‑headline and two call‑to‑action buttons.
 */
export default function BrainHero({
  heading,
  subheading,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: BrainHeroProps) {
  return (
    <header className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden border-b border-white/5">
      {/* Optional glow orbs can be added here if desired */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
        <div className="reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 text-sm text-gray-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            The Next Generation of Real Estate
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-[1.05] mb-6 tracking-tight" dangerouslySetInnerHTML={{ __html: heading }} />
          <p className="text-xl text-gray-400 font-light mb-10 max-w-lg leading-relaxed">
            {subheading}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={primaryHref} className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform text-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              {primaryLabel}
            </a>
            <a href={secondaryHref} className="px-8 py-4 bg-transparent text-zinc-900 font-semibold rounded-full hover:bg-white/5 transition-colors border border-white/10 text-center">
              {secondaryLabel}
            </a>
          </div>
        </div>
        {/* Placeholder for future AI illustration or brain graphic */}
        <div className="reveal delay-200 relative hidden lg:block">
          {/* You can replace this with an <img> showing the brain illustration */}
          <div className="glass-card p-6 w-full shadow-2xl shadow-blue-900/20 transform rotate-y-6 rotate-x-6 perspective-1000 border-t border-white/20">
            {/* Example placeholder */}
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>
            <div className="bg-white/50 border border-white/10 rounded-2xl p-4 flex items-center gap-4 mb-6 shadow-inner">
              <span className="text-gray-400">AI Visualization Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
