"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Bot, Wand2, RefreshCw, FileText, Globe, Search, BarChart3, Target, Crosshair, Star } from "lucide-react";

interface ListingAIToolsProps {
  onApplyDescription?: (text: string) => void;
  onApplyPrice?: (price: string) => void;
}

export function ListingAITools({ onApplyDescription, onApplyPrice }: ListingAIToolsProps) {
  const { language } = useLanguage();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const aiActions = [
    { id: "desc", icon: FileText, label: "Generate Description", action: () => handleGenerateDescription() },
    { id: "seo", icon: Search, label: "Generate SEO Tags", action: () => handleMockAction("seo") },
    { id: "en", icon: Globe, label: "English Version", action: () => handleMockAction("en") },
    { id: "ro", icon: Globe, label: "Romanian Version", action: () => handleMockAction("ro") },
    { id: "price", icon: Bot, label: "Suggested Asking Price", action: () => handleGeneratePrice() },
    { id: "invest", icon: BarChart3, label: "Investment Analysis", action: () => handleMockAction("invest") },
    { id: "luxury", icon: Star, label: "Luxury Classification", action: () => handleMockAction("luxury") },
    { id: "aix", icon: Wand2, label: "AiX Score™", action: () => handleMockAction("aix") },
    { id: "persona", icon: Target, label: "Buyer Persona", action: () => handleMockAction("persona") },
    { id: "market", icon: Crosshair, label: "Market Position", action: () => handleMockAction("market") },
  ];

  const handleGenerateDescription = () => {
    setActiveAction("desc");
    setTimeout(() => {
      onApplyDescription?.("Această proprietate exclusivistă oferă o combinație rară de confort modern și eleganță clasică. Situată într-o locație de top, beneficiază de finisaje premium, spații luminoase și o vedere panoramică. Ideală pentru cei care caută un stil de viață luxos și intim.");
      setActiveAction(null);
    }, 1500);
  };

  const handleGeneratePrice = () => {
    setActiveAction("price");
    setTimeout(() => {
      onApplyPrice?.("450000");
      setActiveAction(null);
    }, 1500);
  };

  const handleMockAction = (id: string) => {
    setActiveAction(id);
    setTimeout(() => {
      setActiveAction(null);
    }, 1500);
  };

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-zinc-50/50 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-zinc-900">{language === "ro" ? "Asistent AI AiX OS™" : "AiX OS™ AI Assistant"}</h3>
      </div>
      <p className="text-xs text-zinc-500">
        {language === "ro" 
          ? "Folosește inteligența artificială pentru a optimiza listarea, a calcula prețul corect și a genera profile de cumpărători."
          : "Use artificial intelligence to optimize your listing, calculate accurate pricing, and generate buyer personas."}
      </p>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {aiActions.map(action => {
          const Icon = action.icon;
          const isActive = activeAction === action.id;
          return (
            <button
              key={action.id}
              onClick={action.action}
              disabled={activeAction !== null}
              className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                isActive 
                  ? "border-amber-500 bg-amber-500/10 text-amber-600" 
                  : "border-zinc-200 bg-white hover:border-amber-500/50 hover:bg-zinc-50 text-zinc-700"
              }`}
            >
              {isActive ? (
                <RefreshCw className="w-4 h-4 animate-spin text-amber-500 shrink-0" />
              ) : (
                <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
              )}
              <span className="text-xs font-medium leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
