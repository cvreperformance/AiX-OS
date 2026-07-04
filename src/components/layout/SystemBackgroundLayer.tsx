"use client";

import { Brain } from "lucide-react";

export function SystemBackgroundLayer() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />

      {/* Subtle animated neon neural node sparks */}
      <div className="absolute top-[15%] left-[10%] w-[40rem] h-[40rem] bg-amber-500/[0.015] blur-[120px] rounded-full animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] bg-violet-500/[0.015] blur-[120px] rounded-full animate-pulse duration-[8000ms]" />

      {/* Large central neural brain icon background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] animate-pulse duration-[12000ms]">
        <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full" />
        <Brain className="w-[40rem] h-[40rem] text-amber-500 stroke-[0.3]" />
      </div>
    </div>
  );
}
export default SystemBackgroundLayer;
