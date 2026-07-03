"use client";

import Link from "next/link";
import { SERVICES_DIRECTORY } from "@/lib/services";

interface MegaMenuProps {
  onClose: () => void;
}

export function MegaMenu({ onClose }: MegaMenuProps) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[1000px] rounded-3xl border border-zinc-800 bg-[#080808]/95 backdrop-blur-2xl shadow-2xl p-8 grid grid-cols-3 gap-x-8 gap-y-10 animate-in fade-in slide-in-from-top-3 duration-250 z-[500] overflow-hidden"
      onMouseLeave={onClose}
    >
      {/* Decorative Glow */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500/40 via-amber-300/10 to-transparent" />

      {SERVICES_DIRECTORY.map((category) => {
        const Icon = category.icon;
        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-2">
              <div className={`p-1.5 rounded-lg border border-zinc-800/50 bg-zinc-900/50 ${category.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">{category.title}</h3>
            </div>
            
            <div className="space-y-3 pl-1">
              {category.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <item.icon className="h-3.5 w-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-300 group-hover:text-amber-400 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-zinc-500 leading-tight mt-0.5 line-clamp-1">
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
  );
}
