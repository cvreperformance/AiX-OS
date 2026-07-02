"use client";

import Link from "next/link";
import {
  Building2,
  Map,
  Sparkles,
  TrendingUp,
  Activity,
  Coins,
  Newspaper,
  Brain,
  Shield,
  Search,
  Scale,
  DollarSign,
  Plane,
  Car,
  Ship,
  Compass,
  Network,
  Users,
  Anchor,
  Globe,
} from "lucide-react";

interface MenuItem {
  href: string;
  label: string;
  desc: string;
  icon: any;
}

export const PILLAR_MENUS: Record<string, MenuItem[]> = {
  properties: [
    { href: "/proprietati", label: "Properties", desc: "Catalog complet de vile și penthouse-uri exclusive", icon: Building2 },
    { href: "/dezvoltatori", label: "Developers", desc: "Baza de date a dezvoltatorilor premium", icon: Users },
    { href: "/agentii", label: "Agencies", desc: "Agenții partenere licențiate AiX", icon: Compass },
    { href: "/oportunitati", label: "Opportunities", desc: "Oportunități de investiție off-market", icon: TrendingUp },
    { href: "/map", label: "Map GIS", desc: "Scanare spațială și pin clustering", icon: Map },
    { href: "/aix-score", label: "AiX Score", desc: "Algoritm de rating al activelor", icon: Sparkles },
  ],
  markets: [
    { href: "/market", label: "Market Pulse", desc: "Monitorizare macro, dobânzi și ROBOR", icon: Activity },
    { href: "/market#stocks", label: "Stocks", desc: "Indici bursieri S&P 500, Nasdaq și Dow", icon: TrendingUp },
    { href: "/market#crypto", label: "Crypto", desc: "Cotații în timp real Bitcoin, Eth, Sol", icon: Globe },
    { href: "/market#commodities", label: "Commodities", desc: "Preț spot Aur, Argint și Petrol", icon: Coins },
    { href: "/wealth", label: "Wealth", desc: "Averi nete globale și indicatori bursieri", icon: DollarSign },
    { href: "/wealth#billionaires", label: "Forbes Billionaires", desc: "Clasamentul celor mai bogați oameni", icon: Sparkles },
    { href: "/stiri", label: "News", desc: "Analize economice și perspective de piață", icon: Newspaper },
  ],
  ai: [
    { href: "/money-advisor", label: "Money Advisor", desc: "Consilier financiar personal IA", icon: Brain },
    { href: "/proprietati", label: "Property Scanner", desc: "Scanare automată a oportunităților sub-evaluate", icon: Search },
    { href: "/anti-teapa", label: "AntiȚeapă AI", desc: "Analiză riscuri cadastrale și vicii", icon: Shield },
    { href: "/valuation", label: "AI Valuation", desc: "Evaluare instantă preț corect pe m²", icon: Scale },
    { href: "/buyer", label: "Buyer AI", desc: "Asistență automatizată la achiziție", icon: Sparkles },
    { href: "/seller", label: "Seller AI", desc: "Strategii IA de marketing imobiliar", icon: Building2 },
    { href: "/insurance", label: "Insurance AI", desc: "Calculatoare și brokeraj de asigurare", icon: Coins },
  ],
  luxury: [
    { href: "/private-jets", label: "Private Jets", desc: "Charter aerian privat și asistență FBO", icon: Plane },
    { href: "/cars", label: "Luxury Cars", desc: "Supercars și mobilitate terestră VIP", icon: Car },
    { href: "/yachts", label: "Yachts", desc: "Charter yahturi de lux în Monaco & Dubai", icon: Ship },
    { href: "/investments#monaco", label: "Monaco Elite", desc: "Proprietăți ultraluxoase pe Coastă", icon: Anchor },
    { href: "/investments#dubai", label: "Dubai Prime", desc: "Proiecte rezidențiale de top în Emirate", icon: Globe },
    { href: "/concierge", label: "Concierge", desc: "Lifestyle management și servicii post-vânzare", icon: Sparkles },
    { href: "/network", label: "Private Network", desc: "Ecosistem discret pentru investitori UHNW", icon: Network },
  ],
  services: [
    { href: "/buyer", label: "Buyer Representation", desc: "Asistență exclusivă pentru cumpărători", icon: Users },
    { href: "/seller", label: "Seller Representation", desc: "Strategie completă pentru proprietari", icon: Building2 },
    { href: "/proprietati", label: "Real Estate", desc: "Tranzacționare active rezidențiale de lux", icon: Building2 },
    { href: "/insurance", label: "Insurance Desk", desc: "Polițe de asigurare pentru active de mare valoare", icon: Shield },
    { href: "/investments", label: "Investments", desc: "Management de portofoliu imobiliar global", icon: Coins },
  ],
};

interface MegaMenuProps {
  pillar: string;
  onClose: () => void;
}

export function MegaMenu({ pillar, onClose }: MegaMenuProps) {
  const items = PILLAR_MENUS[pillar.toLowerCase()];
  if (!items) return null;

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] rounded-3xl border border-zinc-800 bg-[#080808]/95 backdrop-blur-2xl shadow-2xl p-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-3 duration-250 z-50 overflow-hidden"
      onMouseLeave={onClose}
    >
      {/* Decorative Glow */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500/40 via-amber-300/10 to-transparent" />

      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="flex gap-4 p-3.5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-amber-500/25 hover:bg-amber-500/[0.02] hover:shadow-lg hover:shadow-amber-500/[0.01] transition-all duration-300 group"
          >
            <div className="rounded-xl border border-zinc-900 bg-[#0b0b0b] p-2 text-zinc-400 group-hover:text-amber-400 group-hover:border-amber-500/20 transition-all flex items-center justify-center flex-shrink-0 h-10 w-10">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors">
                {item.label}
              </p>
              <p className="text-[10.5px] text-zinc-450 leading-relaxed mt-0.5">
                {item.desc}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
