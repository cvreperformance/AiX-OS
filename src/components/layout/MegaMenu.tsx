"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Building2,
  TrendingUp,
  Shield,
  BookOpen,
} from "lucide-react";

type MegaMenuProps = {
  onClose: () => void;
  onMouseEnter?: () => void;
  headerBottom?: number;
};

export function MegaMenu({ onClose, onMouseEnter, headerBottom: propHeaderBottom }: MegaMenuProps) {
  const { language } = useLanguage();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const [headerBottom, setHeaderBottom] = useState<number>(propHeaderBottom ?? 84);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (propHeaderBottom) {
      setHeaderBottom(propHeaderBottom);
      return;
    }
    const updateHeaderBottom = () => {
      const h = document.querySelector('header');
      if (h) {
        setHeaderBottom(h.getBoundingClientRect().height);
      }
    };
    updateHeaderBottom();
    window.addEventListener("resize", updateHeaderBottom);
    window.addEventListener("scroll", updateHeaderBottom, { passive: true });
    return () => {
      window.removeEventListener("resize", updateHeaderBottom);
      window.removeEventListener("scroll", updateHeaderBottom);
    };
  }, [propHeaderBottom]);

  const handleEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (onMouseEnter) onMouseEnter();
  };

  const handleLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 250);
  };

  if (!mounted) return null;

  // Complete list of ALL platform services grouped into 4 compact horizontal columns
  const megaMenuColumns = [
    {
      id: "buy",
      title: "Cumpără",
      titleEn: "Buy",
      icon: Building2,
      description: "Proprietăți, dezvoltatori și stil de viață lux",
      descriptionEn: "Properties, developers & luxury lifestyle",
      items: [
        { label: "Property & Investment Hub", labelEn: "Property & Investment Hub", href: "/proprietati" },
        { label: "Developers", labelEn: "Developers", href: "/dezvoltatori" },
        { label: "Agencies", labelEn: "Agencies", href: "/agentii" },
        { label: "Buyer Representation", labelEn: "Buyer Representation", href: "/buyer" },
        { label: "Private Jets", labelEn: "Private Jets", href: "/private-jets" },
        { label: "Luxury Cars", labelEn: "Luxury Cars", href: "/cars" },
        { label: "Yachts Marine", labelEn: "Yachts Marine", href: "/yachts" },
        { label: "Luxury Concierge", labelEn: "Luxury Concierge", href: "/concierge" },
      ],
    },
    {
      id: "sell",
      title: "Vinde",
      titleEn: "Sell",
      icon: TrendingUp,
      description: "Reprezentare exclusivă și evaluare",
      descriptionEn: "Exclusive seller representation & valuation",
      items: [
        { label: "Seller Representation", labelEn: "Seller Representation", href: "/seller" },
        { label: "Evaluare Proprietate", labelEn: "Property Valuation", href: "/valuation" },
        { label: "Comparație Proprietăți", labelEn: "Compare Properties", href: "/compare" },
        { label: "Convenience Hub", labelEn: "Convenience Hub", href: "/convenience" },
      ],
    },
    {
      id: "invest",
      title: "Investește",
      titleEn: "Invest",
      icon: Shield,
      description: "Analiză de piață, legal și private equity",
      descriptionEn: "Market intelligence, legal & private equity",
      items: [
        { label: "Market Pulse", labelEn: "Market Pulse", href: "/market" },
        { label: "AiX Score", labelEn: "AiX Score", href: "/aix-score" },
        { label: "Private Wealth & Network", labelEn: "Private Wealth & Network", href: "/private-wealth" },
        { label: "Insurance", labelEn: "Insurance", href: "/insurance" },
        { label: "RO Law", labelEn: "RO Law", href: "/law" },
        { label: "Anti-Țeapă AI", labelEn: "Anti-Țeapă AI", href: "/anti-teapa" },
        { label: "Private Deal Room", labelEn: "Private Deal Room", href: "/private-deal-room" },
        { label: "Market Radar", labelEn: "Market Radar", href: "/market-radar" },
      ],
    },
    {
      id: "learn-ecosystem",
      title: "Învață & Ecosistem",
      titleEn: "Learn & Ecosystem",
      icon: BookOpen,
      description: "Educație, AI, cercetare și acces",
      descriptionEn: "Education, AI, research & ecosystem access",
      items: [
        { label: "Books", labelEn: "Books", href: "/books" },
        { label: "Educație & Ghiduri", labelEn: "Education & Guides", href: "/learning" },
        { label: "Research Center", labelEn: "Research Center", href: "/research" },
        { label: "Technology", labelEn: "Technology", href: "/technology" },
        { label: "Intelligence Newsroom", labelEn: "Intelligence Newsroom", href: "/newsroom" },
        { label: "Real Estate News", labelEn: "Real Estate News", href: "/stiri" },
        { label: "Sistem AI & Agenti", labelEn: "AI System & Agents", href: "/ai" },
        { label: "Document Intelligence", labelEn: "Document Intelligence", href: "/document-intelligence" },
        { label: "Cybersecurity", labelEn: "Cybersecurity", href: "/cybersecurity" },
        { label: "Future Simulation", labelEn: "Future Simulation", href: "/simulation" },
        { label: "Planuri & Acces", labelEn: "Pricing & Access", href: "/pricing" },
        { label: "Home Find", labelEn: "Home Find", href: "/home-find" },
        { label: "Contact & Suport", labelEn: "Contact & Support", href: "/contact" },
      ],
    },
  ];

  return createPortal(
    <div
      id="services-mega-menu"
      data-testid="platform-services-menu"
      className="fixed z-[99999] pointer-events-auto rounded-[28px] bg-[rgba(12,12,12,.94)] backdrop-blur-[24px] border border-zinc-800 shadow-[0_20px_80px_rgba(0,0,0,0.5)] flex flex-col box-border overflow-hidden transition-opacity duration-200 ease-out"
      style={{
        top: `${headerBottom + 12}px`,
        left: '50%',
        right: undefined,
        margin: 0,
        transform: 'translateX(-50%)',
        width: "calc(100% - 32px)",
        maxWidth: "calc(100% - 32px)",
        maxHeight: `calc(100vh - ${headerBottom + 28}px)`,
        boxSizing: "border-box",
        opacity: 1,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Header bar inside the mega menu - Clean title without extra CTA button */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 text-amber-300 flex-shrink-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
          {language === "ro" ? "Servicii Platformă AiX OS™" : "AiX OS™ Platform Services"}
        </h2>
        <span className="text-[11px] text-zinc-500 font-mono">
          {language === "ro" ? "Toate serviciile active" : "All active services"}
        </span>
      </div>

      {/* Grid of category cards forced to 4 compact horizontal columns in 1 single row */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 w-full min-w-0"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "1.25rem",
            width: "100%",
          }}
        >
          {megaMenuColumns.map((cat, idx) => {
            const Icon = cat.icon;
            const title = language === "ro" ? cat.title : cat.titleEn;
            const desc = language === "ro" ? cat.description : cat.descriptionEn;
            return (
              <div
                key={cat.id}
                data-services-column={idx + 1}
                className="flex flex-col rounded-[20px] bg-zinc-900/70 border border-zinc-800/80 p-4 hover:border-amber-500/30 transition-all duration-200 min-w-0"
              >
                <div className="flex items-center gap-2.5 mb-2 sm:mb-2.5 pb-2 border-b border-zinc-800/60">
                  <Icon className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <h3 className="text-sm font-bold text-amber-300 truncate tracking-tight">{title}</h3>
                </div>
                {desc && (
                  <p className="text-[11px] text-zinc-400/90 leading-tight mb-2 sm:mb-2.5 line-clamp-1">{desc}</p>
                )}
                <ul className="flex flex-col gap-1.5 min-w-0">
                  {cat.items.map((item) => {
                    const label = language === "ro" ? item.label : item.labelEn;
                    return (
                      <li key={item.href} className="group flex items-center justify-between min-w-0">
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="text-[12px] leading-tight text-zinc-400 group-hover:text-amber-300 transition-colors duration-150 truncate"
                        >
                          {label}
                        </Link>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-amber-400 text-xs ml-1 flex-shrink-0">
                          →
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
