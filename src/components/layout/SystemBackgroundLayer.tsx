"use client";

import { Brain } from "lucide-react";

export function SystemBackgroundLayer() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-zinc-950">
      {/* Dynamic Grid Overlay (No noise) */}
      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      {/* Large central neural brain icon background element - GHOST OUTLINE ONLY */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 animate-pulse duration-[12000ms]">
        <Brain className="w-[20rem] h-[20rem] md:w-[45rem] md:h-[45rem] text-amber-500 stroke-[0.2]" fill="none" />
      </div>
    </div>
  );
}
export default SystemBackgroundLayer;
