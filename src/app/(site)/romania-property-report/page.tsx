import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, ShieldCheck, FileText, Calendar, Award } from "lucide-react";
import { canonical, buildBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Romania Property Report — August 2026 | AiX OS™ Institutional Research",
  description:
    "Institutional market intelligence, transaction volume metrics, price index trajectories, and regional investment analysis for Romania's property market.",
};

export default async function RomaniaPropertyReportPage() {
  const canonicalUrl = await canonical("/romania-property-report");

  const reportSchema = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: "Romania Property Report — August 2026",
    headline: "Institutional Analysis of Romania's Real Estate Market & Capital Allocation Dynamics",
    description: "Comprehensive research covering prime residential, commercial yields, macro transaction volumes, and regional price index trends in Romania.",
    url: canonicalUrl,
    datePublished: "2026-08-01",
    author: {
      "@type": "Organization",
      name: "AiX OS™ Intelligence",
      url: "https://os.cristianvaduva.com"
    },
    publisher: {
      "@type": "Organization",
      name: "AiX OS™",
      url: "https://os.cristianvaduva.com"
    }
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://os.cristianvaduva.com" },
    { name: "Research Reports", item: "https://os.cristianvaduva.com/romania-property-report" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reportSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="bg-[#050505] text-[#F5F5F7] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Top Navigation */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1A6] hover:text-amber-400 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Ecosystem
            </Link>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-3 h-3" />
                Institutional Report
              </span>
              <span className="text-xs font-mono text-[#A1A1A6]">August 2026 Edition</span>
            </div>
          </div>

          {/* Report Cover Header */}
          <section className="relative rounded-3xl bg-[#0B0B0D] border border-zinc-800/80 p-8 sm:p-12 overflow-hidden shadow-2xl space-y-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4 max-w-3xl relative z-10">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-md">
                AiX OS™ Macro Research
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F5F5F7] tracking-tight leading-tight">
                Romania Property Report — Q3 2026
              </h1>
              <p className="text-base sm:text-lg text-[#A1A1A6] leading-relaxed">
                Institutional market overview, transaction volume metrics, prime residential yield trajectories, and regional capital placement intelligence across Romania&apos;s key hubs.
              </p>
            </div>

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-zinc-800/80 relative z-10 font-mono">
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
                <span className="text-[10px] text-[#A1A1A6] uppercase tracking-wider block mb-1">Prime Yield Average</span>
                <span className="text-2xl text-amber-400 font-semibold">6.85%</span>
                <span className="text-[10px] text-emerald-400 block mt-1">+15 bps YoY</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
                <span className="text-[10px] text-[#A1A1A6] uppercase tracking-wider block mb-1">Bucharest Prime Index</span>
                <span className="text-2xl text-[#F5F5F7] font-semibold">€2,450 / m²</span>
                <span className="text-[10px] text-emerald-400 block mt-1">+4.2% Annual</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
                <span className="text-[10px] text-[#A1A1A6] uppercase tracking-wider block mb-1">Transaction Volume</span>
                <span className="text-2xl text-[#F5F5F7] font-semibold">€1.42B</span>
                <span className="text-[10px] text-[#A1A1A6] block mt-1">H1 Institutional</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
                <span className="text-[10px] text-[#A1A1A6] uppercase tracking-wider block mb-1">Data Verification</span>
                <span className="text-2xl text-emerald-400 font-semibold">Verified</span>
                <span className="text-[10px] text-[#A1A1A6] block mt-1">ANCPI & Eurostat</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800/60">
              <div className="flex items-center gap-3 text-xs text-[#A1A1A6] font-mono">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Publication Date: August 2026</span>
                <span>·</span>
                <FileText className="w-4 h-4 text-amber-400" />
                <span>28 Pages Full Analysis</span>
              </div>

              <a
                href="#download-section"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10"
              >
                <Download className="w-4 h-4" />
                Request Institutional PDF
              </a>
            </div>
          </section>

          {/* Section 1: Executive Summary */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-amber-400" />
              <h2 className="text-xs font-mono text-amber-400 uppercase tracking-widest">Section 01</h2>
            </div>
            <h2 className="font-display text-3xl text-[#F5F5F7]">Executive Summary</h2>
            <div className="prose prose-invert max-w-none text-[#A1A1A6] leading-relaxed space-y-4 text-base">
              <p>
                Romania’s real estate ecosystem in Q3 2026 demonstrates structural resilience characterized by stable capitalization rates, sustained demand in Bucharest’s northern business corridor, and accelerating institutional liquidity in major regional cities including Cluj-Napoca, Timișoara, and Iași.
              </p>
              <p>
                While macroeconomic adjustments in Eurozone interest rates have realigned valuation benchmarks, prime assets in residential and commercial segments maintain attractive risk-adjusted yield spreads compared to Western European capital markets.
              </p>
            </div>
          </section>

          {/* Section 2: Market Overview & Regional Data */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-amber-400" />
              <h2 className="text-xs font-mono text-amber-400 uppercase tracking-widest">Section 02</h2>
            </div>
            <h2 className="font-display text-3xl text-[#F5F5F7]">Regional Market Comparison</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[#0B0B0D] border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#F5F5F7] text-lg">Bucharest Prime</h3>
                  <span className="text-xs font-mono text-amber-400">Capital Hub</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-[#A1A1A6]">Avg Price/m²</span>
                    <span className="text-[#F5F5F7]">€2,450</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-[#A1A1A6]">Rental Yield</span>
                    <span className="text-[#F5F5F7]">6.9%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#A1A1A6]">Market Status</span>
                    <span className="text-emerald-400">High Demand</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B0B0D] border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#F5F5F7] text-lg">Cluj-Napoca</h3>
                  <span className="text-xs font-mono text-amber-400">Tech Corridor</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-[#A1A1A6]">Avg Price/m²</span>
                    <span className="text-[#F5F5F7]">€2,720</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-[#A1A1A6]">Rental Yield</span>
                    <span className="text-[#F5F5F7]">5.8%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#A1A1A6]">Market Status</span>
                    <span className="text-emerald-400">Premium Growth</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#0B0B0D] border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#F5F5F7] text-lg">Timișoara & Brașov</h3>
                  <span className="text-xs font-mono text-amber-400">Logistics & Tourism</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-[#A1A1A6]">Avg Price/m²</span>
                    <span className="text-[#F5F5F7]">€1,680 - €1,950</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-[#A1A1A6]">Rental Yield</span>
                    <span className="text-[#F5F5F7]">7.2%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#A1A1A6]">Market Status</span>
                    <span className="text-amber-400">Value Opportunity</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PDF Request CTA Section */}
          <section id="download-section" className="rounded-3xl bg-gradient-to-br from-zinc-950 via-[#0B0B0D] to-zinc-950 border border-amber-500/30 p-8 sm:p-12 text-center space-y-6">
            <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="font-display text-3xl text-[#F5F5F7]">Access Full Institutional Intelligence Report</h2>
            <p className="text-sm text-[#A1A1A6] max-w-xl mx-auto">
              Download the complete 28-page PDF report including ANCPI transaction breakdowns, commercial lease index curves, and private wealth investment guidance.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-full bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10 w-full sm:w-auto"
              >
                Request Full Report via Advisor
              </Link>
              <Link
                href="/"
                className="px-8 py-3.5 rounded-full border border-zinc-800 text-[#F5F5F7] text-xs font-semibold hover:border-amber-500/40 transition-all w-full sm:w-auto"
              >
                Explore AiX Ecosystem
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
