"use client";

import { PageHeader } from "@/components/ui";
import { Award, FileSignature, FileBadge, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function CertificationLayerPage() {
  const { language } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 space-y-16 animate-in text-left">
      <PageHeader
        badge="AiX OS™ Protocol"
        title="AiX Certification Layer"
        subtitle={
          language === "ro"
            ? "Arhitectura de încredere bazată pe blockchain și validare AI."
            : "The trust architecture based on blockchain and AI validation."
        }
      />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-zinc-950/50 border border-zinc-800 space-y-4 text-left">
            <Award className="h-8 w-8 text-amber-500" />
            <h3 className="text-xl font-bold text-white">Digital Property Passport</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every asset passing through the AiX Certification Layer receives an immutable digital passport containing historical transaction data, yield history, and AiX SCORE™ logs.
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-4 text-left">
            <FileSignature className="h-8 w-8 text-amber-500" />
            <h3 className="text-xl font-bold text-white">Smart Contract Integration</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Transactions executed within the Private Deal Room leverage the Certification Layer to generate automated, self-executing smart contracts, minimizing notary overhead.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
          <h2 className="text-2xl font-light text-white mb-6 text-center">Certification Workflow</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-zinc-800 -z-10" />
            
            {[
              { step: 1, label: "Asset Ingestion", icon: Globe },
              { step: 2, label: "AI Verification", icon: FileBadge },
              { step: 3, label: "Immutable Record", icon: Award }
            ].map((s) => (
              <div key={s.step} className="bg-zinc-950 border border-zinc-800 rounded-full w-40 h-40 flex flex-col items-center justify-center p-4 text-center z-10 shadow-xl shadow-black">
                <s.icon className="h-6 w-6 text-amber-500 mb-2" />
                <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">Step {s.step}</span>
                <span className="text-sm font-semibold text-white">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-4">
          <Link href="/private-deal-room" className="px-6 py-3 rounded-full bg-zinc-900 text-white font-semibold hover:bg-zinc-800 border border-zinc-800 transition-colors">
            {language === "ro" ? "Accesează Deal Room" : "Enter Deal Room"}
          </Link>
        </div>
      </div>
    </div>
  );
}
