import type { Metadata } from "next";
import { Suspense } from "react";
import BrainClient from "./BrainClient";

export const metadata: Metadata = {
  title: "AiX Brain Central Router | AiX OS™",
  description: "Interact with our multi-module cognitive intelligence router linking real estate, markets, and legal parameters.",
};

export default function BrainPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-500 font-mono animate-pulse">Loading Decision Engine...</div>}>
      <BrainClient />
    </Suspense>
  );
}
