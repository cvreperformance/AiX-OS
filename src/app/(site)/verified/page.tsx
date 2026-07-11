"use client";

import { PageHeader } from "@/components/ui";
import { CheckCircle2, Shield, Search, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function VerifiedPropertyPage() {
  const { language } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 space-y-16 animate-in text-left">
      <PageHeader
        badge="AiX OS™ Quality Standard"
        title="AiX Verified Property™"
        subtitle={
          language === "ro"
            ? "Garanția calității și a siguranței juridice în ecosistemul imobiliar."
            : "The gold standard for quality and legal safety in the real estate ecosystem."
        }
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="p-8 md:p-12 rounded-[40px] bg-zinc-900/40 border border-amber-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] pointer-events-none" />
          <Shield className="h-16 w-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-light text-white mb-4">What does AiX Verified™ mean?</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every property carrying the AiX Verified™ badge has undergone a strict 40-point inspection covering legal status, structural integrity, market value alignment, and yield potential.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Legal Safety", desc: "Clear cadastre, no hidden mortgages or active litigation.", icon: FileText },
            { title: "Market Aligned", desc: "Pricing is algorithmically verified against current market comps.", icon: Search },
            { title: "Quality Assured", desc: "Structural and developmental background checks completed.", icon: CheckCircle2 },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-3xl bg-zinc-950/50 border border-zinc-800 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <item.icon className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link href="/property-scanner" className="px-6 py-3 rounded-full bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
            {language === "ro" ? "Scanează Proprietate" : "Scan Property Now"}
          </Link>
        </div>
      </div>
    </div>
  );
}
