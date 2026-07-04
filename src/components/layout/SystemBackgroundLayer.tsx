"use client";

import { Brain, TrendingUp } from "lucide-react";

export function SystemBackgroundLayer() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />

      {/* Subtle animated neon neural node sparks */}
      <div className="absolute top-[15%] left-[10%] w-[30rem] h-[30rem] bg-amber-500/[0.015] blur-[120px] rounded-full animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[20%] right-[10%] w-[25rem] h-[25rem] bg-violet-500/[0.015] blur-[100px] rounded-full animate-pulse duration-[6000ms]" />

      {/* Large central neural brain icon background element */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 opacity-[0.025] animate-pulse duration-[10000ms]">
        <Brain className="w-[36rem] h-[36rem] text-amber-500 stroke-[0.35]" />
      </div>

      {/* Decorative OS stats/numbers visualization tags */}
      <div className="absolute top-[30%] left-[5%] font-mono text-[9px] text-zinc-800 leading-relaxed tracking-wider opacity-60 hidden xl:block">
        <div>SYS_ADDR: 0x7FFF5FBFFD</div>
        <div>NET_LNK: CONNECTED</div>
        <div>SYS_STATUS: PRODUCTION</div>
        <div>AI_LOAD: 12.4%</div>
      </div>

      <div className="absolute bottom-[35%] right-[5%] font-mono text-[9px] text-zinc-800 leading-relaxed tracking-wider opacity-60 hidden xl:block text-right">
        <div>EUR_RON: 4.9765 (+0.02%)</div>
        <div>GOLD_SPOT: 2,342.10 USD/oz</div>
        <div>BNR_RATE: 6.75%</div>
        <div>aix_score: 9.72 (AAA)</div>
      </div>

      {/* Floating mini charts/market lines */}
      <div className="absolute top-[45%] right-[10%] opacity-[0.02] hidden lg:block">
        <TrendingUp className="w-48 h-48 text-zinc-400 stroke-[0.5]" />
      </div>
    </div>
  );
}
export default SystemBackgroundLayer;
