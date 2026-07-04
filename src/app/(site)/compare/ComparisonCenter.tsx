"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import {
  Building,
  Compass,
  Shield,
  Coins,
  Plane,
  Check,
  X,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function ComparisonCenter() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    "properties" | "developers" | "insurance" | "investments" | "luxury"
  >("properties");

  // --- DATASETS ---
  const propertiesData = {
    headers: ["Parameter", "Penthouse Floreasca Lake", "Vila Modernă Pipera", "Apartament Dorobanți Glass"],
    rows: [
      ["Price", "4.850.000 €", "2.100.000 €", "3.600.000 €"],
      ["Location", "Floreasca, Bucharest", "Pipera, Bucharest", "Dorobanți, Bucharest"],
      ["Area", "320 sqm", "450 sqm", "240 sqm"],
      ["AiX Score", "9.2 / 10", "8.7 / 10", "9.0 / 10"],
      ["Pool", "No (Lake access)", "Yes (Private outdoor)", "No"],
      ["Green Certification", "Yes (BREEAM Outstanding)", "Yes (Passive House)", "Yes (LEED Gold)"],
      ["Yield Estimate", "5.2% / year", "4.8% / year", "5.0% / year"],
    ],
  };

  const developersData = {
    headers: ["Parameter", "One United Properties", "Emaar Properties", "Pastor Group"],
    rows: [
      ["HQ Location", "Bucharest, RO", "Dubai, UAE", "Monte-Carlo, MC"],
      ["Est. Foundation", "2007", "1997", "1920"],
      ["Core Market", "Residential & Office Green", "Mega Projects & Master Communities", "UHNW Properties Monte-Carlo"],
      ["Flagship Project", "One Floreasca City", "Downtown Dubai & Burj Khalifa", "Tour Odeon Monaco"],
      ["BREEAM / LEED focus", "100% Green Portfolio", "Moderate / Urban Focus", "High luxury bespoke focus"],
      ["AiX Trust Rating", "9.4 / 10", "9.5 / 10", "9.7 / 10"],
    ],
  };

  const insuranceData = {
    headers: ["Parameters", "PAD (Mandatory)", "Facultative Basic", "Facultative Premium (AiX HNWI)"],
    rows: [
      ["Annual Cost (Base)", "€20 / year", "€80 - €200 / year", "€500 - €2.500 / year"],
      ["Natural Disasters", "Yes (Capped €20k)", "Yes (Full property value)", "Yes (Full property value)"],
      ["Fire & Explosions", "No", "Yes", "Yes"],
      ["Theft & Vandalism", "No", "Yes", "Yes"],
      ["Valuable Art & Jewellery", "No", "No", "Yes (Bespoke schedule)"],
      ["Water Damage (Pipe burst)", "No", "Yes", "Yes"],
      ["Third-Party Civil Liability", "No", "Yes (€10k cap)", "Yes (Unlimited / €500k cap)"],
    ],
  };

  const investmentsData = {
    headers: ["Parameter", "RO Property Yield", "S&P 500 ETF (SPY)", "Physical Gold Spot", "Bitcoin (BTC)"],
    rows: [
      ["Asset Class", "Real Estate (Physical)", "Equities (Global Index)", "Commodity (Metal)", "Crypto Asset"],
      ["Volatility Profile", "Low", "Medium", "Low", "High"],
      ["Avg. Annual Return", "5.5% - 7.5% + Capital Gain", "8% - 10% (Historical)", "4% - 6% (Inflation hedge)", "30%+ (High risk volatility)"],
      ["Minimum Entry", "€100,000", "€100 (ETF shares)", "€80 (1g gold bar)", "€10 (Fractional BTC)"],
      ["Liquidity Horizon", "Months / Years (Low)", "Daily (High)", "Daily (Medium / High)", "Instant 24/7 (High)"],
      ["Fiscal Taxation (RO)", "10% net rental tax + CASS", "1% / 3% capital gains tax", "No tax if physical hold/capital gain", "10% capital gains tax"],
    ],
  };

  const luxuryData = {
    headers: ["Parameter", "Gulfstream G650 Jet", "Benetti 120 Yacht", "Ferrari SF90 Supercar"],
    rows: [
      ["Asset Type", "Aviation (Private Jet)", "Marine (Motor Yacht)", "Mobility (Supercar)"],
      ["Acquisition Cost", "$65,000,000", "$14,500,000", "€550,000"],
      ["Charter / Daily Run", "$8,500 / flight hour", "€15,000 / day + fuel", "€2,500 / day"],
      ["Top Cruise Speed", "956 km/h (Mach 0.90)", "15 knots (28 km/h)", "340 km/h (0-100 in 2.5s)"],
      ["Passenger Capacity", "16 passengers", "10 guests / 6 crew", "2 passengers"],
      ["Base Port Location", "Bucharest Baneasa / Geneva", "Monaco / Cannes", "Dubai / Cannes"],
    ],
  };

  const activeDataset =
    activeTab === "properties"
      ? propertiesData
      : activeTab === "developers"
      ? developersData
      : activeTab === "insurance"
      ? insuranceData
      : activeTab === "investments"
      ? investmentsData
      : luxuryData;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10 animate-in">
      <PageHeader
        badge="Ecosistem Comparativ"
        title={language === "ro" ? "Centru de Comparații Active" : "Multi-Asset Comparison Center"}
        subtitle={
          language === "ro"
            ? "Analiză side-by-side pentru proprietăți premium, dezvoltatori, cotații de asigurare sau randamente de active."
            : "Direct comparative metrics for real estate, corporate entities, policies, index yield structures, and lifestyle assets."
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2.5 bg-zinc-950/60 p-2 rounded-2xl border border-zinc-850 justify-center max-w-xl mx-auto">
        {[
          { key: "properties" as const, label: language === "ro" ? "Proprietăți" : "Properties", icon: Building },
          { key: "developers" as const, label: language === "ro" ? "Dezvoltatori" : "Developers", icon: Compass },
          { key: "insurance" as const, label: language === "ro" ? "Asigurări" : "Insurance", icon: Shield },
          { key: "investments" as const, label: language === "ro" ? "Investiții" : "Investments", icon: Coins },
          { key: "luxury" as const, label: language === "ro" ? "Echipament Lux" : "Luxury Assets", icon: Plane },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? "bg-amber-500 text-black shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Comparison Grid Table */}
      <div className={`rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-950/30 backdrop-blur-md shadow-2xl`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 font-mono text-[9px] uppercase tracking-wider bg-black/40">
                {activeDataset.headers.map((h, i) => (
                  <th key={i} className="p-4 font-semibold text-white first:text-zinc-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-xs">
              {activeDataset.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-zinc-900/10 transition-colors">
                  {row.map((cell, cIdx) => {
                    const isYes = cell === "Yes" || cell.startsWith("Yes");
                    const isNo = cell === "No" || cell.startsWith("No");

                    return (
                      <td
                        key={cIdx}
                        className={`p-4 ${
                          cIdx === 0
                            ? "font-semibold text-zinc-450 font-mono uppercase text-[10px] tracking-wider"
                            : "text-zinc-300"
                        }`}
                      >
                        {isYes ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <Check className="h-4 w-4" />
                            {cell}
                          </span>
                        ) : isNo ? (
                          <span className="inline-flex items-center gap-1 text-red-400">
                            <X className="h-4 w-4" />
                            {cell}
                          </span>
                        ) : cell.includes("/ 10") ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-bold font-mono">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
