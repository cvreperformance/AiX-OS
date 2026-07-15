"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import {
  Brain, Star, Crown, Building2, ChevronRight, CheckCircle2,
  Shield, Activity, Users, Gem, Globe, Share2, Calculator, ArrowRight,
  MessageCircle, Mail, Send
} from "lucide-react";
import Link from "next/link";
import { brandContent } from "@/lib/content/brand";

const CONTACT_LINKS = {
  whatsapp: "https://wa.me/436509536345",
  email: "mailto:cristianvaduva@duck.com",
  telegram: "https://t.me/AiX_OS",
  linkedin: "https://linkedin.com/in/cristianvaduva",
  facebook: "https://facebook.com/cristianvaduva",
  instagram: "https://instagram.com/cristianvaduva",
  youtube: "https://youtube.com/cristianvaduva",
  cvcom: "https://cristianvaduva.com",
  aixlux: "https://aixluxury.com"
};

export default function PricingClientPage() {
  const { language } = useLanguage();
  
  // Smart Calculator State
  const [calcAsset, setCalcAsset] = useState("Apartment");
  const [calcValue, setCalcValue] = useState("");
  const [calcService, setCalcService] = useState("Standard");

  const [calcResult, setCalcResult] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(calcValue.replace(/[^0-9]/g, ""));
    let bracket = "";
    let recommendation = "";

    if (val <= 50000) {
      bracket = "0–50,000€";
      recommendation = "Fixed Fee: 1,500€ or 3% (Standard), 2,500€ (Premium)";
    } else if (val <= 250000) {
      bracket = "50,001–250,000€";
      recommendation = "Fixed Fee: 3,500€ or 2.5% (Standard), 4.5% (Premium)";
    } else if (val <= 1000000) {
      bracket = "250,001–1,000,000€";
      recommendation = "Fixed Fee: 8,500€ or 2% (Standard), 3.5% (Exclusive)";
    } else {
      bracket = "1,000,001€+";
      recommendation = "Custom Luxury Commission (1.5% - 3%) depending on asset and exposure.";
    }

    setCalcResult(`Asset Bracket: ${bracket} | Recommendation: ${recommendation}`);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-600 selection:bg-amber-500/30">
      
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <div className="relative pt-32 pb-20 overflow-hidden border-b border-zinc-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-amber-500/10 blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
            <Gem className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Property & Investment Ecosystem
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light text-zinc-900 tracking-tight mb-6 leading-tight">
            Unlock local yield data <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 font-normal">
              and scan transactions instantly
            </span>
          </h1>
          <p className="text-xl text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
            The ultimate ecosystem linking AiX OS™, Home Find, CristianVaduva.com, AiXLuxury.com, and doar-inchirieri.ro.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-32 py-24">

        {/* ─── 1. AiX OS™ Membership ───────────────────────────────────────── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-zinc-900 mb-4">1. Access properties and analyze data</h2>
            <p className="text-zinc-400">Select the plan matching your transaction volume to scan properties and calculate net yields.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* FREE */}
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50/30 p-8 flex flex-col hover:border-zinc-300 transition-all">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">FREE ACCESS</h3>
                <p className="text-3xl font-light text-zinc-600 mb-2">FREE</p>
                <p className="text-xs text-zinc-400">Basic ecosystem entry</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {["Learning Center", "Market insights", "Basic AI tools", "Public resources", "Basic calculators"].map((f,i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                    <CheckCircle2 className="h-4 w-4 text-zinc-400 mt-0.5" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-3 px-4 rounded-xl text-center bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-700 transition-colors">Start free search</Link>
            </div>
            {/* STARTER */}
            <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 flex flex-col hover:border-blue-500/40 transition-all">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">AiX STARTER</h3>
                <p className="text-3xl font-light text-blue-400 mb-2">49€<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="text-xs text-zinc-400">Perfect for individuals</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {["Track market trends", "Automated description builder", "Property analysis tools", "Real-time pricing data", "Priority support"].map((f,i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={CONTACT_LINKS.whatsapp} className="w-full py-3 px-4 rounded-xl text-center bg-blue-500/20 text-blue-400 font-medium hover:bg-blue-500/30 transition-colors">Get property tools</Link>
            </div>
            {/* PROFESSIONAL */}
            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-8 flex flex-col relative shadow-2xl shadow-amber-500/10 md:-translate-y-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-bold uppercase tracking-widest">Recommended</div>
              <div className="mb-8 mt-2">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">AiX PROFESSIONAL</h3>
                <p className="text-3xl font-light text-amber-400 mb-2">149€<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="text-xs text-amber-500/80">For professionals</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {["AI-assisted valuation scans", "Financial yield models", "Detailed price trend reports", "Business management tools", "Automated listing workflows", "Complete portfolio tracking"].map((f,i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 mt-0.5" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={CONTACT_LINKS.whatsapp} className="w-full py-3 px-4 rounded-xl text-center bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">Get professional features</Link>
            </div>
            {/* BUSINESS */}
            <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-8 flex flex-col hover:border-purple-500/40 transition-all">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">AiX BUSINESS</h3>
                <p className="text-3xl font-light text-purple-400 mb-2">Custom</p>
                <p className="text-xs text-zinc-400">For agencies & companies</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {["Full API Access", "Custom Integration", "White-label options", "Dedicated support", "Enterprise scale"].map((f,i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                    <CheckCircle2 className="h-4 w-4 text-purple-400 mt-0.5" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={CONTACT_LINKS.whatsapp} className="w-full py-3 px-4 rounded-xl text-center border border-purple-500/50 text-purple-400 font-medium hover:bg-purple-500/10 transition-colors">Connect custom systems</Link>
            </div>
          </div>
        </section>

        {/* ─── 2. AiX OS™ + Home Find ──────────────────────────────────────── */}
        <section>
          <div className="rounded-[40px] bg-gradient-to-br from-zinc-50/80 to-zinc-100 border border-zinc-200 p-8 md:p-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-light text-zinc-900 mb-6">2. AiX OS™ + Home Find</h2>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  Complete integration between AI, property marketing, automation and business management. Seamless workflow from lead to closing.
                </p>
                <ul className="space-y-4">
                  {["AI property descriptions", "Lead management", "Market analysis", "Workflow automation", "CRM support", "Productivity tools"].map((f,i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                {[
                  { name: "STARTER", price: "149€/month" },
                  { name: "PRO", price: "299€/month" },
                  { name: "BUSINESS", price: "499€/month" }
                ].map(p => (
                  <div key={p.name} className="flex items-center justify-between p-6 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-amber-500/30 transition-all">
                    <span className="font-bold text-zinc-900">{p.name}</span>
                    <span className="font-light text-xl text-amber-400">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. Complete Digital Presence ─────────────────────────────────── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-zinc-900 mb-4">3. Attract buyers online directly</h2>
            <p className="text-zinc-400">Maximize asset reach and client conversion through integrated digital infrastructure.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {["AiX OS™", "Home Find", "CristianVaduva.com", "AiXLuxury.com"].map(brand => (
              <span key={brand} className="px-4 py-2 rounded-full border border-zinc-200 bg-zinc-50/50 text-xs font-mono text-zinc-600">{brand}</span>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl border border-zinc-200 bg-zinc-50/30 text-center">
              <h3 className="text-xl font-bold text-zinc-900 mb-2">DIGITAL PRESENCE</h3>
              <p className="text-3xl font-light text-zinc-600 mb-6">499€<span className="text-lg text-zinc-400">/mo</span></p>
            </div>
            <div className="p-8 rounded-3xl border border-amber-500/30 bg-amber-500/10 text-center shadow-2xl shadow-amber-500/10 md:-translate-y-4">
              <h3 className="text-xl font-bold text-zinc-900 mb-2">ENHANCED EXPOSURE</h3>
              <p className="text-3xl font-light text-amber-400 mb-6">799€<span className="text-lg text-amber-500/50">/mo</span></p>
            </div>
            <div className="p-8 rounded-3xl border border-zinc-200 bg-zinc-50/30 text-center">
              <h3 className="text-xl font-bold text-zinc-900 mb-2">INTEGRATED ECOSYSTEM</h3>
              <p className="text-3xl font-light text-zinc-600 mb-6">Custom</p>
            </div>
          </div>
        </section>

        {/* ─── 4. Full Real Estate Ecosystem ──────────────────────────────── */}
        <section className="relative rounded-[40px] overflow-hidden border border-amber-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-zinc-900/80 backdrop-blur-3xl" />
          <div className="relative p-12 md:p-20 text-center">
            <Globe className="h-12 w-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-light text-zinc-900 mb-6">4. Get direct exposure on all portals</h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-10">
              Appear higher in search results, save hours of manual writing with AI integration, and get maximum visibility across AiX OS™, Home Find, CristianVaduva.com, AiXLuxury.com, and doar-inchirieri.ro.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <div className="px-8 py-6 rounded-2xl bg-white/40 border border-amber-500/30 backdrop-blur-md">
                <p className="text-sm text-zinc-400 mb-1">ALL PLATFORM ACCESS</p>
                <p className="text-3xl font-light text-amber-400">999€<span className="text-lg text-amber-500/50">/mo</span></p>
              </div>
              <div className="px-8 py-6 rounded-2xl bg-white/40 border border-zinc-200 backdrop-blur-md">
                <p className="text-sm text-zinc-400 mb-1">Custom Plan</p>
                <p className="text-3xl font-light text-zinc-900">Custom</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. doar-inchirieri.ro ────────────────────────────────────── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-zinc-900 mb-4">5. List rentals on specialized networks</h2>
            <p className="text-zinc-400">Specialized rental platform access.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-zinc-50/30 border border-zinc-200 text-center">
              <h3 className="font-bold text-zinc-900 mb-1">FREE RENTAL</h3>
              <p className="text-2xl font-light text-zinc-400">FREE</p>
              <p className="text-xs text-zinc-400 mt-2">3 months</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50/30 border border-zinc-200 text-center">
              <h3 className="font-bold text-zinc-900 mb-1">STARTER</h3>
              <p className="text-2xl font-light text-blue-400">49€<span className="text-sm">/mo</span></p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50/30 border border-amber-500/30 text-center shadow-[0_0_30px_rgba(245,158,11,0.05)]">
              <h3 className="font-bold text-zinc-900 mb-1">PRO</h3>
              <p className="text-2xl font-light text-amber-400">149€<span className="text-sm">/mo</span></p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50/30 border border-zinc-200 text-center">
              <h3 className="font-bold text-zinc-900 mb-1">BUSINESS</h3>
              <p className="text-2xl font-light text-purple-400">Custom</p>
            </div>
          </div>
        </section>

        {/* ─── 6. Social Media Management ────────────────────────────────── */}
        <section>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl md:text-5xl font-light text-zinc-900">6. Social Media <br/>Management</h2>
              <p className="text-zinc-400">Professional brand building across all major platforms. Allow clients to publish using their own accounts.</p>
              <div className="flex flex-wrap gap-2">
                {["Facebook", "Instagram", "LinkedIn", "YouTube", "TikTok"].map(plat => (
                  <span key={plat} className="px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs text-zinc-600">{plat}</span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-3xl bg-zinc-50/30 border border-zinc-200">
                <h3 className="text-sm font-bold text-zinc-900 mb-4">SOCIAL STARTER</h3>
                <p className="text-2xl font-light text-zinc-600 mb-6">299€</p>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li>• Content creation</li>
                  <li>• Posting</li>
                  <li>• Management</li>
                </ul>
              </div>
              <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20">
                <h3 className="text-sm font-bold text-zinc-900 mb-4">SOCIAL GROWTH</h3>
                <p className="text-2xl font-light text-blue-400 mb-6">599€</p>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li>• Strategy</li>
                  <li>• Multi-platform mgt</li>
                  <li>• Lead generation</li>
                </ul>
              </div>
              <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30">
                <h3 className="text-sm font-bold text-zinc-900 mb-4">SOCIAL AUTHORITY</h3>
                <p className="text-2xl font-light text-amber-400 mb-6">999€</p>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li>• Premium branding</li>
                  <li>• Video strategy</li>
                  <li>• Luxury positioning</li>
                  <li>• Authority building</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7. Subscription Plans & Add-ons ───────────────────────────── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-zinc-900 mb-4">7. Subscriptions & Add-Ons</h2>
            <p className="text-zinc-400">Scale your access as you grow.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { n: "FREE", p: "FREE", sub: "3 months" },
              { n: "STARTER", p: "29€/mo" },
              { n: "PRO", p: "79€/mo", tag: "MOST POPULAR" },
              { n: "AGENCY", p: "199€/mo" },
              { n: "DEVELOPER", p: "399€/mo" },
              { n: "ENTERPRISE", p: "Custom" }
            ].map(plan => (
              <div key={plan.n} className={`w-40 p-5 rounded-2xl text-center relative ${plan.tag ? 'bg-amber-500/10 border border-amber-500/40' : 'bg-zinc-50/30 border border-zinc-200'}`}>
                {plan.tag && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full whitespace-nowrap">{plan.tag}</div>}
                <p className="text-xs font-bold text-zinc-400 mb-2">{plan.n}</p>
                <p className={`text-xl font-light ${plan.tag ? 'text-amber-400' : 'text-zinc-900'}`}>{plan.p}</p>
                {plan.sub && <p className="text-[10px] text-zinc-400 mt-1">{plan.sub}</p>}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50/20 p-8 md:p-12">
            <h3 className="text-2xl font-light text-zinc-900 mb-8 text-center">Performance Add-ons</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {["Priority Listing Placement", "Featured Property Styling", "AI Copywriting Boost", "Top Search Placement", "Actionable Performance Metrics", "Automated Workflow Pack"].map(add => (
                <div key={add} className="flex items-center gap-3 p-4 rounded-xl bg-white/50 border border-zinc-200/60">
                  <Activity className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-zinc-600">{add}</span>
                </div>
              ))}
            </div>
            <div className="text-center p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
              <p className="text-sm text-zinc-400">
                <strong className="text-amber-400">AiX OS™ enhances:</strong> AI writing, AI descriptions, AI market analysis, Lead qualification, and Workflow automation.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 8. Smart Commission Model ──────────────────────────────────── */}
        <section>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
               {["Vehicle", "Apartment", "Villa", "Commercial Property", "High-Value Asset"].map(ex => (
                 <div key={ex} className="p-4 rounded-xl bg-zinc-50/30 border border-zinc-200 text-center text-sm text-zinc-400">{ex}</div>
               ))}
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-5xl font-light text-zinc-900">8. Flexible <br/>Commission Model</h2>
              <p className="text-zinc-400">Users choose between <strong className="text-zinc-900">Fixed Price</strong> or <strong className="text-zinc-900">Percentage</strong>.</p>
              <p className="text-sm text-zinc-400">Pricing adapts dynamically based on:</p>
              <ul className="space-y-2">
                {["Asset category", "Complexity", "Exposure", "Marketing effort", "Property value"].map((item,i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                    <ChevronRight className="h-4 w-4 text-amber-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── 9. Exceptional Full Representation ────────────────────────── */}
        <section className="rounded-[40px] bg-white border border-zinc-200 p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[100px] pointer-events-none" />
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-light text-zinc-900 mb-4">9. Hire specialists to close transactions</h2>
            <p className="text-zinc-400">Specialized property sales representation and off-market deal matching.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-12">
            {[
              "Dedicated Buyer Representation", "Dedicated Seller Representation", "Return-on-Investment Advisory", "Capital Partner Network", 
              "Unlisted Property Deals", "Targeted Listing Marketing", "Expert Deal Negotiation", "Asset Risk Assessment", 
              "Portfolio Wealth Strategy", "Price Trend Analysis"
            ].map(srv => (
              <div key={srv} className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-50/40 border border-zinc-200/80">
                <Crown className="h-5 w-5 text-amber-700/80" />
                <span className="text-zinc-600 text-sm">{srv}</span>
              </div>
            ))}
          </div>
          <div className="text-center relative z-10">
            <p className="inline-block px-8 py-4 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-lg font-light tracking-wide">
              Custom / Commission Based
            </p>
          </div>
        </section>

        {/* ─── 10. Smart Pricing Calculator ─────────────────────────────── */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-zinc-900 mb-4">10. Calculate transactional fees instantly</h2>
            <p className="text-zinc-400">Intelligent bracket-based fee estimation.</p>
          </div>
          <div className="max-w-3xl mx-auto rounded-3xl border border-zinc-200 bg-zinc-50/30 p-8 md:p-12">
            <form onSubmit={handleCalculate} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-600">Asset Category</label>
                <select 
                  value={calcAsset} 
                  onChange={e => setCalcAsset(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {["Apartment", "House", "Land", "Commercial", "Car", "High-Value Asset", "Other"].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-600">Estimated Value (€)</label>
                <input 
                  type="text" 
                  value={calcValue} 
                  onChange={e => setCalcValue(e.target.value)}
                  placeholder="e.g. 150000"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-600">Service Type</label>
                <select 
                  value={calcService} 
                  onChange={e => setCalcService(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {["Standard", "Enhanced", "Featured", "Dedicated"].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl bg-amber-500 text-black font-bold text-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2">
                <Calculator className="h-5 w-5" /> Calculate Estimate
              </button>
            </form>

            {calcResult && (
              <div className="mt-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center animate-in fade-in zoom-in duration-300">
                <p className="text-lg text-amber-400 font-light">{calcResult}</p>
              </div>
            )}

            <div className="mt-8 p-5 rounded-2xl bg-red-950/20 border border-red-900/30 text-xs text-zinc-400 text-center space-y-2">
              <p>⚠️ &quot;Declared values may be reviewed according to available market information.&quot;</p>
              <p>&quot;AiX OS™ reserves the right to verify submitted information. Incorrect or misleading data may result in pricing adjustments or listing removal.&quot;</p>
            </div>
          </div>
        </section>

        {/* ─── CONTACT SECTION ────────────────────────────────────────────── */}
        <section className="pt-16 border-t border-zinc-200 text-center">
          <h2 className="text-2xl font-light text-zinc-900 mb-8">Ready to upgrade your reality?</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a href={CONTACT_LINKS.email} className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 border border-zinc-200 hover:border-amber-500/50 hover:text-amber-400 transition-colors">
              <Mail className="h-4 w-4" /> Email
            </a>
            <a href={CONTACT_LINKS.whatsapp} className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 border border-zinc-200 hover:border-[#25D366]/50 hover:text-[#25D366] transition-colors">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href={CONTACT_LINKS.telegram} className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 border border-zinc-200 hover:border-[#0088cc]/50 hover:text-[#0088cc] transition-colors">
              <Send className="h-4 w-4" /> Telegram
            </a>
            <a href={CONTACT_LINKS.linkedin} className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 border border-zinc-200 hover:border-[#0A66C2]/50 hover:text-[#0A66C2] transition-colors">
               LinkedIn
            </a>
            <a href={CONTACT_LINKS.facebook} className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 border border-zinc-200 hover:border-[#1877F2]/50 hover:text-[#1877F2] transition-colors">
               Facebook
            </a>
            <a href={CONTACT_LINKS.instagram} className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 border border-zinc-200 hover:border-[#E4405F]/50 hover:text-[#E4405F] transition-colors">
               Instagram
            </a>
            <a href={CONTACT_LINKS.youtube} className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 border border-zinc-200 hover:border-[#FF0000]/50 hover:text-[#FF0000] transition-colors">
               YouTube
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
            <a href={CONTACT_LINKS.cvcom} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">CristianVaduva.com</a>
            <span>•</span>
            <a href={CONTACT_LINKS.aixlux} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">AiXLuxury.com</a>
          </div>
        </section>

      </div>
    </div>
  );
}
