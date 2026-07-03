"use client";

import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { SERVICES_DIRECTORY } from "@/lib/services";

interface MegaMenuProps {
  onClose: () => void;
}

// Featured services shown prominently at the bottom of the menu
const FEATURED_HREFS = ["/money-advisor", "/valuation", "/anti-teapa", "/calculators"];

export function MegaMenu({ onClose }: MegaMenuProps) {
  const featured = SERVICES_DIRECTORY.flatMap((c) => c.items).filter((item) =>
    FEATURED_HREFS.includes(item.href)
  );

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[1060px] rounded-3xl border border-zinc-800 bg-[#080808]/97 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-3 duration-250 z-[500] overflow-hidden"
      onMouseLeave={onClose}
    >
      {/* Top glow */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500/50 via-amber-300/15 to-transparent" />

      {/* Header bar */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-zinc-900/80">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-amber-500/70" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Platform Services</span>
          <span className="ml-2 text-[10px] font-mono text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-full px-2 py-0.5">
            {SERVICES_DIRECTORY.reduce((a, c) => a + c.items.length, 0)} services
          </span>
        </div>
        <Link
          href="/services"
          onClick={onClose}
          className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-500/70 hover:text-amber-400 transition-colors"
        >
          View all services
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Category Grid — 4 columns */}
      <div className="p-8 grid grid-cols-4 gap-x-8 gap-y-8">
        {SERVICES_DIRECTORY.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center gap-2.5 border-b border-zinc-900/80 pb-2">
                <div className={`p-1.5 rounded-lg border border-zinc-800/50 bg-zinc-900/50 flex-shrink-0 ${category.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider leading-none">{category.title}</h3>
              </div>

              <div className="space-y-2.5 pl-0.5">
                {category.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-start gap-2.5 group"
                  >
                    <div className="mt-0.5 opacity-35 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <item.icon className="h-3 w-3 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-zinc-300 group-hover:text-amber-400 transition-colors leading-tight">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-zinc-600 leading-tight mt-0.5 line-clamp-1 group-hover:text-zinc-500 transition-colors">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Strip */}
      <div className="border-t border-zinc-900/80 bg-zinc-950/50 px-8 py-4">
        <div className="flex items-center gap-6">
          <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold flex-shrink-0">Featured</span>
          <div className="flex items-center gap-3 flex-wrap">
            {featured.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/15 bg-amber-500/5 px-3 py-1.5 text-[10px] font-semibold text-amber-400/80 hover:text-amber-400 hover:border-amber-500/35 hover:bg-amber-500/10 transition-all"
              >
                <item.icon className="h-3 w-3" />
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/services"
            onClick={onClose}
            className="ml-auto flex items-center gap-1 text-[10px] text-zinc-600 hover:text-amber-400 transition-colors flex-shrink-0"
          >
            All {SERVICES_DIRECTORY.reduce((a, c) => a + c.items.length, 0)} services →
          </Link>
        </div>
      </div>
    </div>
  );
}
