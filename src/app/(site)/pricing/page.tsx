"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Brain, Star, Crown, Building2, ChevronRight, CheckCircle2, Shield, Activity, Users, Gem } from "lucide-react";
import Link from "next/link";
import { brandContent } from "@/lib/content/brand";

const pricingTiers = [
  {
    id: "free",
    nameRo: "Acces Gratuit",
    nameEn: "Free Access",
    descRo: "Pentru utilizatorii care explorează ecosistemul AiX OS™",
    descEn: "For users exploring the AiX OS™ ecosystem",
    icon: Activity,
    color: "text-zinc-400",
    bgColor: "bg-zinc-400/10",
    borderColor: "border-zinc-800",
    featuresRo: [
      "Perspective asupra pieței",
      "Resurse educaționale",
      "Instrumente de bază",
      "Intelligence public",
      "Acces Learning Center",
    ],
    featuresEn: [
      "Market insights",
      "Educational resources",
      "Basic tools",
      "Public intelligence",
      "Learning Center access",
    ],
    ctaRo: "Începe Acum",
    ctaEn: "Get Started",
    href: "/register",
    featured: false,
  },
  {
    id: "professional",
    nameRo: "Professional",
    nameEn: "Professional",
    descRo: "Pentru profesioniști și utilizatori activi",
    descEn: "For professionals and active users",
    icon: Star,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-500/30",
    featuresRo: [
      "Toate beneficiile Free",
      "Instrumente avansate",
      "Funcționalități AI",
      "Analiză de investiții",
      "Intelligence imobiliar",
      "Resurse profesionale",
    ],
    featuresEn: [
      "All Free benefits",
      "Advanced tools",
      "AI features",
      "Investment analysis",
      "Real estate intelligence",
      "Professional resources",
    ],
    ctaRo: "Solicită Acces",
    ctaEn: "Request Access",
    href: "/contact",
    featured: true,
  },
  {
    id: "investor",
    nameRo: "Investor",
    nameEn: "Investor",
    descRo: "Pentru investitori și dezvoltatori de portofoliu",
    descEn: "For investors and portfolio developers",
    icon: Crown,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-500/30",
    featuresRo: [
      "Toate beneficiile Professional",
      "Oportunități de investiții",
      "Analiză de piață aprofundată",
      "Instrumente ROI",
      "Asistență AI pentru investiții",
      "Perspective Premium",
    ],
    featuresEn: [
      "All Professional benefits",
      "Investment opportunities",
      "Deep market analysis",
      "ROI tools",
      "AI investment assistance",
      "Premium insights",
    ],
    ctaRo: "Alătură-te AiX OS™",
    ctaEn: "Join AiX OS™",
    href: "/join",
    featured: false,
  },
  {
    id: "private-wealth",
    nameRo: "Private Wealth",
    nameEn: "Private Wealth",
    descRo: "Pentru clienți premium și High-Net-Worth",
    descEn: "For premium and High-Net-Worth clients",
    icon: Gem,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-500/30",
    featuresRo: [
      "Acces rețea privată",
      "Oportunități off-market",
      "Consultanță de lux",
      "Soluții Private Wealth",
      "Servicii Concierge",
      "Intelligence exclusiv",
    ],
    featuresEn: [
      "Private network access",
      "Off-market opportunities",
      "Luxury advisory",
      "Private wealth solutions",
      "Concierge services",
      "Exclusive intelligence",
    ],
    ctaRo: "Contactează Consilier",
    ctaEn: "Contact Advisor",
    href: brandContent.contact.whatsappText,
    featured: true,
  },
  {
    id: "business",
    nameRo: "Business / Partners",
    nameEn: "Business / Partners",
    descRo: "Pentru companii și parteneri strategici",
    descEn: "For companies and strategic partners",
    icon: Building2,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-500/30",
    featuresRo: [
      "Soluții B2B personalizate",
      "Parteneriate strategice",
      "Acces enterprise",
      "API & Integrări suportate",
      "Management de cont dedicat",
    ],
    featuresEn: [
      "Custom B2B solutions",
      "Strategic partnerships",
      "Enterprise access",
      "API & Integrations support",
      "Dedicated account management",
    ],
    ctaRo: "Discută cu Noi",
    ctaEn: "Let's Talk",
    href: "/contact",
    featured: false,
  },
];

export default function PricingPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 selection:bg-amber-500/30">
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-amber-500/5 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
              <Brain className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                {language === "ro" ? "AiX OS™ Ecosystem" : "AiX OS™ Ecosystem"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight mb-6">
              {language === "ro" ? "Alege Nivelul Tău de" : "Choose Your Level of"} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 font-normal">
                {language === "ro" ? "Intelligence" : "Intelligence"}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
              {language === "ro"
                ? "AiX OS™ oferă acces gradual la date, instrumente AI și oportunități exclusive adaptate obiectivelor tale imobiliare și financiare."
                : "AiX OS™ provides graduated access to data, AI tools, and exclusive opportunities tailored to your real estate and financial goals."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => {
              const Icon = tier.icon;
              const isFeatured = tier.featured;
              
              return (
                <div 
                  key={tier.id}
                  className={`relative flex flex-col p-6 sm:p-8 rounded-3xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 ${
                    isFeatured 
                      ? `bg-zinc-900/40 backdrop-blur-xl ${tier.borderColor} shadow-2xl shadow-amber-500/5 md:-translate-y-2` 
                      : "bg-zinc-950/40 border-zinc-800/60 hover:bg-zinc-900/40 hover:border-zinc-700"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {isFeatured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-amber-500/25">
                      {language === "ro" ? "Recomandat" : "Recommended"}
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`inline-flex p-3 rounded-2xl ${tier.bgColor} ${tier.color} mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {language === "ro" ? tier.nameRo : tier.nameEn}
                    </h3>
                    <p className="text-sm text-zinc-400 min-h-[40px]">
                      {language === "ro" ? tier.descRo : tier.descEn}
                    </p>
                  </div>

                  <div className="flex-grow">
                    <ul className="space-y-3 mb-8">
                      {(language === "ro" ? tier.featuresRo : tier.featuresEn).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                          <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${tier.color}`} />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    href={tier.href}
                    className={`group flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isFeatured
                        ? "bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                        : "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800"
                    }`}
                  >
                    {language === "ro" ? tier.ctaRo : tier.ctaEn}
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-24 max-w-3xl mx-auto text-center p-8 rounded-3xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/40 to-transparent backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4">
              {language === "ro" ? "Ai nevoie de o soluție complet personalizată?" : "Need a fully customized solution?"}
            </h3>
            <p className="text-zinc-400 mb-6 text-sm">
              {language === "ro" 
                ? "Contactează echipa AiX OS™ pentru a discuta cum putem integra sistemele noastre de intelligence decizional în structura ta de afaceri sau de management al averii."
                : "Contact the AiX OS™ team to discuss how we can integrate our decision intelligence systems into your business structure or wealth management framework."}
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
            >
              <Users className="h-4 w-4" />
              {language === "ro" ? "Contactează Echipa" : "Contact Team"}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
