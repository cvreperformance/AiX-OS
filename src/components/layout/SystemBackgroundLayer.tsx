"use client";

import { Brain } from "lucide-react";

export function SystemBackgroundLayer() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none">
      {/* Dynamic Grid Overlay (No noise) */}
      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      {/* Large central neural brain icon background element - prominent gold brain */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 animate-pulse duration-[12000ms]">
        <Brain className="w-[30rem] h-[30rem] md:w-[60rem] md:h-[60rem] text-amber-400 stroke-[0.2]" fill="none" />
      </div>
    </div>
  );
}
export default SystemBackgroundLayer;
