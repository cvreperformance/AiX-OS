"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  Phone,
  MessageCircle,
  ChevronDown,
  Home,
  Send,
  Users,
  Newspaper,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  Globe,
  CheckCircle,
  Sliders,
  Gem,
  Calculator,
  Lock,
  Star,
  Activity,
  Heart
} from "lucide-react";
import { brandContent } from "@/lib/content/brand";
import { mainNavLinks, navigationCategories } from "@/config/navigation.config";
import { footerColumns } from "@/config/footer.config";
import { MegaMenu } from "./MegaMenu";
import { useLanguage } from "@/context/LanguageContext";
import NotificationPopover from "@/components/ui/NotificationPopover";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  
  const dynamicLinks = mainNavLinks.map((link) => ({
    ...link,
    label: language === "ro" ? link.label : link.labelEn,
  }));

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll lock for mobile drawer
  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      html.classList.add("overflow-hidden");
    } else {
      html.classList.remove("overflow-hidden");
    }
    return () => html.classList.remove("overflow-hidden");
  }, [open]);

  // Close menu on route change
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    const timer = window.setTimeout(() => {
      setOpen(false);
      setExpandedCategory(null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const closeMenu = () => {
    setOpen(false);
    setExpandedCategory(null);
  };

  return (
    <header
      className={`sticky top-0 z-[300] border-b transition-all duration-500 ${
        scrolled
          ? "border-zinc-800 bg-[#080808]/90 backdrop-blur-xl shadow-2xl shadow-black/40"
          : "border-zinc-800/40 bg-[#080808]/60 backdrop-blur-md"
      }`}
      onMouseLeave={() => setActivePillar(null)}
    >
      <div className="mx-auto flex h-16 sm:h-20 max-w-[90rem] items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 group flex-shrink-0 z-10" aria-label="AiX OS - Acasă">
          <span className="text-xl font-light tracking-[0.2em] text-white group-hover:text-amber-400 transition-colors duration-300">
            AiX
          </span>
          <span className="text-xl font-light tracking-[0.2em] text-amber-500 group-hover:text-amber-400 transition-colors duration-300">
            OS
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden xl:flex items-center gap-2 relative">
          {dynamicLinks.map((link) => {
            if (link.isPillar && link.key) {
              const isHovered = activePillar === link.key;
              return (
                <div
                  key={link.key}
                  className="relative py-4"
                  onMouseEnter={() => setActivePillar(link.key)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg hover:bg-zinc-900/45 ${
                      isHovered ? "text-amber-400" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    {link.label}
                    <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isHovered ? "rotate-180" : ""}`} />
                  </button>
                  {isHovered && (
                    <MegaMenu onClose={() => setActivePillar(null)} />
                  )}
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href || "/"}
                className={`relative px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg hover:bg-zinc-900/45 ${
                  isActive ? "text-amber-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden xl:flex items-center gap-3">
          {/* Notification Center */}
          <NotificationPopover />

          {/* Language Switcher */}
          <div className="flex items-center gap-0.5 border border-zinc-850 bg-zinc-950/60 rounded-full p-0.5 mr-1">
            <button
              onClick={() => setLanguage("ro")}
              className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all ${
                language === "ro" ? "bg-amber-500/20 text-amber-400" : "text-zinc-550 hover:text-zinc-300"
              }`}
            >
              RO
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all ${
                language === "en" ? "bg-amber-500/20 text-amber-400" : "text-zinc-550 hover:text-zinc-300"
              }`}
            >
              EN
            </button>
          </div>

          <Link
            href="/join"
            className="rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/25 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-400 transition-all duration-300 flex items-center gap-1.5 shadow-sm"
          >
            {t("nav.join")}
          </Link>
          <a
            href={brandContent.contact.whatsappText}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 transition-all duration-300 flex items-center gap-1.5 shadow-sm"
          >
            <MessageCircle className="h-4 w-4" />
            {t("nav.whatsapp")}
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="xl:hidden flex items-center gap-2">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center justify-center w-11 h-11 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-all duration-200 relative z-10"
            aria-label={open ? "Închide meniu" : "Deschide meniu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            style={{ touchAction: "manipulation" }}
          >
            <span className="flex flex-col gap-[5px] w-5">
              <span className={`h-[1.5px] bg-current rounded-full transition-all duration-300 origin-left ${open ? "rotate-45 translate-x-[3px] -translate-y-[1px] w-[20px]" : "w-full"}`} />
              <span className={`h-[1.5px] bg-current rounded-full transition-all duration-300 ${open ? "opacity-0 scale-x-0" : "w-4/5"}`} />
              <span className={`h-[1.5px] bg-current rounded-full transition-all duration-300 origin-left ${open ? "-rotate-45 translate-x-[3px] translate-y-[1px] w-[20px]" : "w-full"}`} />
            </span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          MOBILE MENU DRAWER
          ───────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={`xl:hidden fixed inset-0 z-[400] overflow-hidden transition-all duration-300 ease-out ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-[340px] flex flex-col bg-[#0a0a0a] border-l border-zinc-800/80 shadow-2xl transition-transform duration-300 ease-out overflow-hidden ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 flex-shrink-0 bg-[#0a0a0a] z-10">
            <Link href="/" className="flex items-center gap-1.5" onClick={closeMenu}>
              <span className="text-lg font-light tracking-[0.2em] text-white">AiX</span>
              <span className="text-lg font-light tracking-[0.2em] text-amber-500">OS</span>
            </Link>

            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-0.5 border border-zinc-850 bg-zinc-950/60 rounded-full p-0.5">
              <button
                onClick={() => setLanguage("ro")}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all ${
                  language === "ro" ? "bg-amber-500/20 text-amber-400" : "text-zinc-550"
                }`}
              >
                RO
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-all ${
                  language === "en" ? "bg-amber-500/20 text-amber-400" : "text-zinc-550"
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={closeMenu}
              className="flex items-center justify-center w-11 h-11 text-zinc-500 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-all"
              aria-label="Închide meniu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Nav Area */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 overscroll-contain">
            
            <Link
              href="/"
              onClick={closeMenu}
              className={`flex items-center gap-3 px-3 py-3.5 rounded-xl text-[13px] font-semibold transition-all active:scale-98 ${
                pathname === "/"
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <Home className="h-4.5 w-4.5 flex-shrink-0" />
              {t("nav.home")}
            </Link>

            <div className="pt-4 pb-2">
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-bold">
                  {language === "ro" ? "Servicii & Module" : "Services & Modules"}
                </p>
                <Link
                  href="/services"
                  onClick={closeMenu}
                  className="text-[10px] font-semibold text-amber-500/70 hover:text-amber-400 transition-colors uppercase tracking-wider"
                >
                  Director →
                </Link>
              </div>
            </div>

            {/* Accordion List for the 5 Categories */}
            {navigationCategories.map((category) => {
              const isExpanded = expandedCategory === category.id;
              const Icon = category.icon;
              const title = language === "ro" ? category.title : category.titleEn;

              return (
                <div key={category.id} className="mb-1">
                  <button
                    type="button"
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    className={`w-full flex items-center justify-between px-3 py-3.5 rounded-xl text-[13px] font-semibold transition-all active:scale-98 ${
                      isExpanded
                        ? "bg-zinc-900/80 text-white"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-900/40"
                    }`}
                    aria-expanded={isExpanded}
                  >
                    <span className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg border border-zinc-800/50 bg-zinc-900/50 flex-shrink-0 transition-colors ${isExpanded ? category.color : "text-zinc-500"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {title}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-amber-400" : "text-zinc-600"
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      isExpanded ? "max-h-[1400px] opacity-100 mt-1" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-5 pl-4 border-l border-zinc-850 space-y-2 py-2">
                      {category.items.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = pathname === sub.href;
                        const label = language === "ro" ? sub.label : sub.labelEn;
                        const desc = language === "ro" ? sub.desc : sub.descEn;

                        return (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            onClick={closeMenu}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 active:scale-98 border border-transparent ${
                              isSubActive
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-400 font-semibold"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                            }`}
                          >
                            <div className={`mt-0.5 p-1.5 rounded-lg border border-zinc-800/60 bg-zinc-900/60 flex-shrink-0 transition-colors ${isSubActive ? "text-amber-400" : "text-zinc-500"}`}>
                              <SubIcon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-zinc-200 leading-tight">{label}</p>
                              <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">{desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 mt-2 border-t border-zinc-800/60 space-y-1">
              {[
                { href: "/despre", label: language === "ro" ? "Despre AiX" : "About AiX", icon: Users },
                { href: "/stiri", label: language === "ro" ? "Analize Piață" : "Market Analysis", icon: Newspaper },
                { href: "/contact", label: t("nav.contact"), icon: Send },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-3 py-3.5 rounded-xl text-[13px] font-semibold transition-all active:scale-98 ${
                      pathname === link.href
                        ? "bg-amber-500/10 text-amber-400"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-900/40"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="px-4 pb-6 pt-4 border-t border-zinc-800/60 space-y-3 bg-[#0a0a0a] z-10 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${brandContent.contact.phoneRORaw}`}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-zinc-800 text-[11px] uppercase tracking-wider font-bold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
              >
                <Phone className="h-4 w-4 text-amber-400" />
                {t("nav.call")}
              </a>
              <a
                href={brandContent.contact.whatsappText}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-[11px] uppercase tracking-wider font-bold text-emerald-400 hover:bg-emerald-600/20 transition-all active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                {t("nav.whatsapp")}
              </a>
            </div>
            <Link
              href="/join"
              onClick={closeMenu}
              className="w-full flex items-center justify-center py-4 text-xs font-bold uppercase tracking-widest text-black bg-amber-500 hover:bg-amber-400 rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              {t("nav.cta")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const [expandedCol, setExpandedCol] = useState<string | null>(null);
  
  return (
    <footer className="border-t border-zinc-800 bg-[#050505] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 space-y-16">

        {/* ─── HERO FOOTER BANNER ─────────────────────────────────────────── */}
        <div className="p-8 md:p-12 rounded-3xl border border-zinc-850 bg-gradient-to-br from-zinc-950 via-zinc-950/95 to-zinc-900/40 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.02] blur-3xl pointer-events-none rounded-full" />
          
          <div className="space-y-4 max-w-2xl text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-light tracking-[0.15em] text-white">AiX</span>
              <span className="text-2xl font-light tracking-[0.15em] text-amber-500">OS</span>
            </div>
            <h3 className="text-lg font-light text-zinc-300">
              {language === "ro" ? "Creierul tău imobiliar secundar. Gândește mai rapid." : "Your second brain. Think faster."}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
              {language === "ro"
                ? "O platformă de intelligence decizional care ajută investitorii să facă alegeri informate în Imobiliare, Wealth, Asigurări, AI, Tehnologie și Investiții globale."
                : "A decision intelligence platform helping people make better decisions across Real Estate, Wealth, Insurance, AI, Technology and Investments."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/join"
              className="flex-1 sm:flex-none text-center px-6 py-3.5 rounded-xl bg-amber-500 text-black hover:bg-amber-400 text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-98 shadow-lg shadow-amber-500/10"
            >
              {language === "ro" ? "Alătură-te Waitlist" : "Join Waitlist"}
            </Link>
            <Link
              href="/contact"
              className="flex-1 sm:flex-none text-center px-6 py-3.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-98"
            >
              {language === "ro" ? "Contact Support" : "Contact Support"}
            </Link>
            <Link
              href="/money-advisor"
              className="flex-1 sm:flex-none text-center px-6 py-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              {language === "ro" ? "Deschide AI Advisor" : "Open AI Advisor"}
            </Link>
          </div>
        </div>

        {/* ─── OUTCOME-BASED NAVIGATION COLUMNS GRID ──────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 border-t border-zinc-900 pt-12 text-left">
          {footerColumns.map((col) => {
            const isExpanded = expandedCol === col.title;
            return (
              <div key={col.title} className="space-y-4">
                {/* Column header (button accordion on mobile, static title on desktop) */}
                <button
                  type="button"
                  onClick={() => setExpandedCol(isExpanded ? null : col.title)}
                  className="w-full md:pointer-events-none text-left flex items-center justify-between pb-2 border-b border-zinc-900/80 md:border-none md:pb-0"
                >
                  <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-bold font-mono">
                    {language === "ro" ? col.title : col.titleEn}
                  </h4>
                  <ChevronDown
                    className={`h-4.5 w-4.5 text-zinc-650 transition-transform duration-350 md:hidden ${
                      isExpanded ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>

                {/* Navigation lists collapsible on mobile drawers */}
                <div
                  className={`overflow-hidden transition-all duration-350 ease-out ${
                    isExpanded ? "max-h-[850px] opacity-100" : "max-h-0 md:max-h-none opacity-0 md:opacity-100"
                  }`}
                >
                  <ul className="space-y-3 pt-2 md:pt-0">
                    {col.items.map((item) => {
                      const label = language === "ro" ? item.label : item.labelEn;
                      if (item.external) {
                        return (
                          <li key={item.id}>
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-zinc-500 hover:text-amber-400 transition-all font-medium flex items-center gap-1.5"
                            >
                              {label}
                              <span className="text-[9px] text-zinc-700 font-mono">↗</span>
                            </a>
                          </li>
                        );
                      }
                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            className="text-xs text-zinc-500 hover:text-amber-400 transition-all font-medium block"
                          >
                            {label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── BOTTOM CLEAN FOOTER BAR ─────────────────────────────────────── */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          {/* Copyrights, Author, Status, Version */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-500">
              &copy; {new Date().getFullYear()} AiX OS &bull; {language === "ro" ? "Ecosistem de Intelligence Imobiliar" : "Decision Intelligence Platform"}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1.5 text-[10px] text-zinc-600 font-mono font-medium">
              <span>{language === "ro" ? "Status: Online" : "Status: Online"}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>&bull;</span>
              <span>Version: v4.2.0-prod</span>
              <span>&bull;</span>
              <span>
                {language === "ro" ? "Creat de " : "Created by "}
                <a href="https://cristianvaduva.com" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-amber-400 underline transition-colors">
                  CristianVaduva.com
                </a>
              </span>
            </div>
          </div>

          {/* Languages switch + Legal paths */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Minimal Language Toggles */}
            <div className="flex items-center gap-0.5 border border-zinc-850 bg-zinc-950/60 rounded-full p-0.5">
              <button
                onClick={() => setLanguage("ro")}
                className={`px-2.5 py-1 text-[9.5px] font-bold rounded-full transition-all ${
                  language === "ro" ? "bg-amber-500/20 text-amber-400 font-bold" : "text-zinc-550 hover:text-zinc-300"
                }`}
              >
                RO
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 text-[9.5px] font-bold rounded-full transition-all ${
                  language === "en" ? "bg-amber-500/20 text-amber-400 font-bold" : "text-zinc-550 hover:text-zinc-300"
                }`}
              >
                EN
              </button>
            </div>

            {/* Sitemap, policies */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-zinc-550">
              <Link href="/sitemap" className="hover:text-amber-400 transition-colors">Sitemap</Link>
              <Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
              <Link href="/cookie-policy" className="hover:text-amber-400 transition-colors">Cookie Policy</Link>
              <Link href="/contact" className="hover:text-amber-400 transition-colors">Terms</Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
