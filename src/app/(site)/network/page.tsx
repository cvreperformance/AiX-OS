"use client";

import { useState } from "react";
import {
  Globe, Users, Lock, Handshake, Star, Building2, ArrowRight,
  MessageCircle, ChevronRight, Activity, Award, Briefcase, MapPin
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";

const BENEFITS = [
  { icon: Lock, title: "Acces Exclusiv Off-Market", desc: "Proprietăți care nu sunt listate public. Disponibile doar membrilor rețelei noastre private." },
  { icon: Users, title: "Networking cu Investitori HNWI", desc: "Conectează-te direct cu investitori, developeri și family offices cu capital alocat." },
  { icon: Globe, title: "Oportunități Internaționale", desc: "Deal-uri în România, Dubai, Monaco, Abu Dhabi și alte destinații premium europene." },
  { icon: Handshake, title: "Co-investiții & JV", desc: "Structurăm parteneriate de investiție pentru proiecte mari. Putere colectivă, risc distribuit." },
  { icon: Star, title: "Evenimente Private", desc: "Lansări exclusive, property tours private și sesiuni de networking pentru membri." },
  { icon: Building2, title: "Acces Prioritar la Noi Proiecte", desc: "Developerii parteneri prezintă proiectele membrilor rețelei înainte de lansarea publică." },
];

const TIERS = [
  {
    name: "Silver",
    price: "€299 / an",
    description: "Acces la comunitatea de investitori și newsletter premium.",
    features: [
      "Newsletter lunar cu deal-flow exclusiv",
      "Acces la 2 eventi private/an",
      "Profil în directorul de membri",
      "Raport lunar piețe premium",
    ],
    highlight: false,
  },
  {
    name: "Gold",
    price: "€799 / an",
    description: "Acces complet la oportunități off-market și co-investiții.",
    features: [
      "Tot din Silver",
      "Acces off-market database complet",
      "Participare co-investiții platformă",
      "4 eventi exclusive / an",
      "Consultanță lunară cu advisor dedicat",
    ],
    highlight: true,
  },
  {
    name: "Platinum",
    price: "NDA & Vetting",
    description: "Cerc restrâns pentru family offices și UHNWI cu portofolii €5M+.",
    features: [
      "Tot din Gold",
      "Acces la deal flow confidențial",
      "Matching personalizat cu investitori calificați",
      "Acces la rețeaua Monaco & Dubai",
      "Manager dedicat 24/7",
    ],
    highlight: false,
  },
];

// Anonymous network member thumbnails
const MEMBER_STATS = [
  { value: "200+", label: "Membri activi" },
  { value: "€50M+", label: "Capital alocat" },
  { value: "40+", label: "Deal-uri facilitate" },
  { value: "12", label: "Orașe active" },
];

const LOCATIONS = [
  { city: "București", flag: "🇷🇴", members: "85 membri", focus: "Residential + Commercial" },
  { city: "Cluj-Napoca", flag: "🇷🇴", members: "32 membri", focus: "Student Housing + Tech HQ" },
  { city: "Dubai", flag: "🇦🇪", members: "42 membri", focus: "Off-Plan + Marina Luxury" },
  { city: "Monaco", flag: "🇲🇨", members: "18 membri", focus: "Ultra-Luxury Boutique" },
  { city: "Londra", flag: "🇬🇧", members: "12 membri", focus: "Prime Central London" },
  { city: "Lisabona", flag: "🇵🇹", members: "9 membri", focus: "Golden Visa + NHR" },
];

export default function NetworkPage() {
  const [selectedTier, setSelectedTier] = useState(1);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-20 py-12 animate-in">
      
      {/* Hero */}
      <section className="space-y-6">
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-500/80 border border-amber-500/20 rounded-full px-3 py-1">
          AiX OS · Luxury Network Platform
        </span>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
              Rețeaua Privată a<br />
              <span className="gradient-gold">Investitorilor de Top</span>
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Un cerc select de investitori, proprietari și experți imobiliari conectați prin AiX OS. Oportunități exclusive, deal-uri private și capital cu care să co-investești în piețe globale.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MEMBER_STATS.map(({ value, label }) => (
                <div key={label} className={`text-center rounded-2xl ${designSystem.glass} p-4`}>
                  <p className="text-xl font-light text-amber-400">{value}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 text-black px-6 py-3 text-xs font-semibold uppercase hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10"
            >
              <MessageCircle className="h-4 w-4" />
              Solicită Acces la Rețea
            </button>
          </div>

          {/* Live location map grid */}
          <div className={`rounded-3xl ${designSystem.glass} p-6 space-y-4`}>
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500/80" />
              Distribuție Geografică Membri
            </h3>
            <div className="space-y-2.5">
              {LOCATIONS.map((loc) => (
                <div key={loc.city} className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950/40 px-4 py-3 hover:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{loc.flag}</span>
                    <div>
                      <p className="text-xs font-semibold text-white">{loc.city}</p>
                      <p className="text-[10px] text-zinc-500">{loc.focus}</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-amber-400 font-mono font-semibold bg-amber-500/5 border border-amber-500/15 rounded-full px-2 py-0.5">
                    {loc.members}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-light text-white">Avantajele Membrilor</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className={`rounded-3xl ${designSystem.glass} ${designSystem.glassHover} p-6 space-y-3`}>
                <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 w-fit">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-white">{b.title}</h3>
                <p className="text-xs text-zinc-450 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-light text-white">Membership Tiers</h2>
          <p className="text-xs text-zinc-500">Selectează nivelul de acces care corespunde obiectivelor tale de investiție.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TIERS.map((tier, idx) => (
            <div
              key={tier.name}
              onClick={() => setSelectedTier(idx)}
              className={`rounded-3xl border p-6 space-y-5 cursor-pointer transition-all duration-300 ${
                selectedTier === idx
                  ? tier.highlight
                    ? "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20 shadow-lg shadow-amber-500/5"
                    : "border-zinc-700 bg-zinc-900/40 ring-1 ring-zinc-700/40"
                  : tier.highlight
                    ? "border-amber-500/20 bg-amber-500/[0.02]"
                    : "border-zinc-900 bg-zinc-950/40"
              }`}
            >
              {tier.highlight && (
                <span className="inline-block text-[9px] uppercase tracking-widest text-amber-400 border border-amber-500/30 rounded-full px-2.5 py-0.5 font-bold">
                  Recomandat
                </span>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">{tier.name}</h3>
                </div>
                <p className="text-xl font-light text-amber-400 mt-1">{tier.price}</p>
                <p className="text-[11px] text-zinc-450 mt-2 leading-relaxed">{tier.description}</p>
              </div>
              <ul className="space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <ChevronRight className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] text-zinc-350">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
                className={`block w-full rounded-xl py-2.5 text-center text-xs font-semibold transition-all ${
                  tier.highlight ? "bg-amber-500 text-black hover:bg-amber-400" : "border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                Solicită {tier.name} Access
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Invitation CTA */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-10 md:p-14 text-center space-y-5">
        <Globe className="h-10 w-10 text-amber-500/60 mx-auto" />
        <h2 className="text-2xl font-light text-white">Membership pe bază de invitație</h2>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Rețeaua AiX Luxury Network este selectivă. Calitatea comunității este prioritatea noastră. Aplică pentru a fi evaluat pentru membership.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 text-black px-8 py-3 text-xs font-semibold uppercase hover:bg-amber-400 transition-all shadow-md"
        >
          Aplică pentru Membership
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-[10px] text-zinc-600">Răspuns în 48h · NDA disponibil la cerere</p>
      </section>
    </div>
  );
}
