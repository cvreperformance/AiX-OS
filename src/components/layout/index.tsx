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
  Heart,

  BookOpen,
  Wrench,
  Shield,
  ArrowUpRight,
  Brain,
  Building2,
  Mail
} from "lucide-react";
import { brandContent } from "@/lib/content/brand";
import { mainNavLinks, navigationCategories } from "@/config/navigation.config";
import { useLanguage } from "@/context/LanguageContext";
import NotificationPopover from "@/components/ui/NotificationPopover";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDeskDropdown, setShowDeskDropdown] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
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
      setShowDeskDropdown(false);
      setExpandedCategory(null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const closeMenu = () => {
    setOpen(false);
    setExpandedCategory(null);
  };

  return (
    <>
      {/* ─── PRIMARY GLASS PANEL SERVICE HUB (TOP NAV REPLACEMENT) ───────── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 lg:pt-6">
        {/* Full Flat Grid Header - Visible on desktop at the top */}
        <div className={`hidden lg:block rounded-3xl border border-zinc-900 bg-[#080808]/75 backdrop-blur-xl p-6 sm:p-7 shadow-2xl relative transition-all duration-300 ${
          scrolled ? "opacity-0 -translate-y-4 pointer-events-none absolute" : "opacity-100 translate-y-0"
        }`}>
          {/* Top Brand & Actions line */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-5 mb-5">
            <Link href="/" className="flex items-center gap-1.5 group">
              <Brain className="h-5 w-5 text-amber-500 mr-1 animate-pulse" />
              <span className="text-xl font-light tracking-[0.2em] text-white group-hover:text-amber-400 transition-colors">AiX</span>
              <span className="text-xl font-light tracking-[0.2em] text-amber-500">OS</span>
            </Link>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {/* Notification Center */}
              <NotificationPopover />

              {/* Language Switcher */}
              <div className="flex items-center gap-0.5 border border-zinc-850 bg-zinc-950/60 rounded-full p-0.5 mr-1 font-mono">
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
                className="rounded-full border border-amber-500/25 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 transition-all shadow-sm"
              >
                Waitlist
              </Link>
            </div>
          </div>

          {/* 6-Column Navigation Grid (Flat layout - discoverable in under 5 seconds) */}
          <div className="grid grid-cols-6 gap-6 text-left">
            {navigationCategories.map((cat) => {
              const Icon = cat.icon;
              const title = language === "ro" ? cat.title : cat.titleEn;
              return (
                <div key={cat.id} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <Icon className={`h-4.5 w-4.5 ${cat.color}`} />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 font-mono">
                      {title}
                    </h4>
                  </div>
                  <ul className="space-y-2.5">
                    {cat.items.map((item) => {
                      const label = language === "ro" ? item.label : item.labelEn;
                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            className="text-xs text-zinc-500 hover:text-amber-400 hover:pl-0.5 transition-all block font-medium leading-relaxed"
                          >
                            {label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── STICKY HEADER TRIGGER (SHOWS ONLY ON SCROLL) ───────────────── */}
      <header
        className={`sticky top-0 z-[300] border-b border-zinc-900 bg-[#080808]/90 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          scrolled ? "translate-y-0 opacity-100" : "lg:-translate-y-20 lg:opacity-0 pointer-events-none lg:absolute"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-1.5 group">
            <Brain className="h-4.5 w-4.5 text-amber-500 mr-1 animate-pulse" />
            <span className="text-lg font-light tracking-[0.2em] text-white">AiX</span>
            <span className="text-lg font-light tracking-[0.2em] text-amber-500">OS</span>
          </Link>

          {/* Sistem Desk Dropdown Toggle & Language Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Desktop Desk Toggle */}
            <button
              onClick={() => setShowDeskDropdown(!showDeskDropdown)}
              className={`hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all text-xs font-semibold uppercase tracking-wider ${
                showDeskDropdown
                  ? "bg-amber-500/20 border-amber-500/35 text-amber-400"
                  : "border-zinc-800 text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Sistem Desk</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${showDeskDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Notification Center */}
            <NotificationPopover />

            {/* Global Language Toggle */}
            <button
              onClick={() => setLanguage(language === "ro" ? "en" : "ro")}
              className="flex items-center justify-center border border-zinc-850 bg-zinc-950/60 rounded-xl px-2.5 py-1.5 text-[9px] font-bold text-amber-400 hover:text-white uppercase font-mono transition-all duration-200"
            >
              {language === "ro" ? "EN" : "RO"}
            </button>

            {/* Mobile Menu Toggle Button (visible at all times next to toggle and alerts) */}
            <button
              onClick={() => setOpen(!open)}
              className="xl:hidden flex items-center justify-center w-10 h-10 text-zinc-400 hover:text-white bg-zinc-900/60 rounded-xl transition-all"
              aria-label="Meniu"
            >
              <LayoutGrid className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* ─── SCROLLED OVERLAY SYSTEM DESK DROP-DOWN ───────────────────── */}
        {showDeskDropdown && scrolled && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-6xl rounded-b-3xl border-x border-b border-zinc-900 bg-[#080808]/97 backdrop-blur-2xl p-6 sm:p-8 grid grid-cols-6 gap-6 text-left shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 z-[400]"
            onMouseLeave={() => setShowDeskDropdown(false)}
          >
            {navigationCategories.map((cat) => {
              const Icon = cat.icon;
              const title = language === "ro" ? cat.title : cat.titleEn;
              return (
                <div key={cat.id} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <Icon className={`h-4.5 w-4.5 ${cat.color}`} />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 font-mono">
                      {title}
                    </h4>
                  </div>
                  <ul className="space-y-2.5">
                    {cat.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className="text-xs text-zinc-500 hover:text-amber-400 hover:pl-0.5 transition-all block font-medium"
                        >
                          {language === "ro" ? item.label : item.labelEn}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────
          MOBILE FULL SCREEN SYSTEM ACCORDION DRAWER
          ───────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={`xl:hidden fixed inset-0 z-[400] overflow-hidden transition-all duration-300 ease-out ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-[340px] flex flex-col bg-[#080808] border-l border-zinc-900 shadow-2xl transition-transform duration-300 ease-out overflow-hidden ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 68px)" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-850 flex-shrink-0 bg-[#080808] z-10">
            <Link href="/" className="flex items-center gap-1.5" onClick={closeMenu}>
              <Brain className="h-4.5 w-4.5 text-amber-500 mr-1 animate-pulse" />
              <span className="text-lg font-light tracking-[0.2em] text-white">AiX</span>
              <span className="text-lg font-light tracking-[0.2em] text-amber-500">OS</span>
            </Link>

            <button
              onClick={closeMenu}
              className="flex items-center justify-center w-10 h-10 text-zinc-500 hover:text-white bg-zinc-900/60 rounded-xl transition-all"
              aria-label="Închide meniu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mobile Categories - identical structures to desktop categories */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 overscroll-contain">
            <Link
              href="/"
              onClick={closeMenu}
              className={`flex items-center gap-3 px-3 py-3.5 rounded-xl text-[12.5px] font-semibold transition-all active:scale-98 ${
                pathname === "/" ? "bg-amber-500/10 text-amber-400" : "text-zinc-300 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <Home className="h-4.5 w-4.5 flex-shrink-0" />
              {t("nav.home")}
            </Link>

            <div className="pt-2 pb-1">
              <p className="px-3 text-[9.5px] uppercase tracking-[0.2em] text-zinc-550 font-bold">
                {language === "ro" ? "Categorii Decizionale" : "Decision Categories"}
              </p>
            </div>

            {navigationCategories.map((category) => {
              const isExpanded = expandedCategory === category.id;
              const Icon = category.icon;
              const title = language === "ro" ? category.title : category.titleEn;

              return (
                <div key={category.id} className="mb-1">
                  <button
                    type="button"
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    className={`w-full flex items-center justify-between px-3 py-3.5 rounded-xl text-[12.5px] font-semibold transition-all active:scale-98 ${
                      isExpanded
                        ? "bg-zinc-900/80 text-white"
                        : "text-zinc-350 hover:text-white hover:bg-zinc-900/45"
                    }`}
                    aria-expanded={isExpanded}
                  >
                    <span className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 flex-shrink-0 transition-colors ${isExpanded ? category.color : "text-zinc-500"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {title}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 flex-shrink-0 transition-transform duration-350 ${
                        isExpanded ? "rotate-180 text-amber-400" : "text-zinc-650"
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-355 ease-out ${
                      isExpanded ? "max-h-[1400px] opacity-100 mt-1" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-5 pl-4 border-l border-zinc-900 space-y-2 py-2 text-left">
                      {category.items.map((sub) => {
                        const SubIcon = sub.icon;
                        const label = language === "ro" ? sub.label : sub.labelEn;
                        const desc = language === "ro" ? sub.desc : sub.descEn;
                        return (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            onClick={closeMenu}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-900/40 border border-transparent"
                          >
                            <div className="mt-0.5 p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-600">
                              <SubIcon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-zinc-200 leading-tight">{label}</p>
                              <p className="text-[10px] text-zinc-550 leading-normal mt-0.5 line-clamp-1">{desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

export function Footer() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <footer className="border-t border-zinc-900 bg-[#050505] mt-auto pb-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        
        {/* Minimized bottom indicators */}
        <div className="space-y-1">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} AiX OS &bull; {language === "ro" ? "Sistem Decizional de Intelligence Imobiliar" : "Decision Intelligence System"}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1 text-[10px] text-zinc-600 font-mono font-medium">
            <span>Status: Online</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>&bull;</span>
            <span>Version: v5.1.0-prod</span>
            <span>&bull;</span>
            <span>
              Powered by{" "}
              <a href="https://cristianvaduva.com" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-amber-400 underline transition-colors">
                CristianVaduva.com
              </a>
            </span>
          </div>
        </div>

        {/* Minimized social paths & language switches */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Language Switch */}
          <div className="flex items-center gap-0.5 border border-zinc-850 bg-zinc-950/60 rounded-full p-0.5">
            <button
              onClick={() => setLanguage("ro")}
              className={`px-2.5 py-1 text-[9px] font-bold rounded-full transition-all ${
                language === "ro" ? "bg-amber-500/20 text-amber-400" : "text-zinc-550 hover:text-zinc-300"
              }`}
            >
              RO
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 text-[9px] font-bold rounded-full transition-all ${
                language === "en" ? "bg-amber-500/20 text-amber-400" : "text-zinc-300"
              }`}
            >
              EN
            </button>
          </div>

          {/* Legal paths */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-zinc-550">
            <a href="https://cristianvaduva.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">CristianVaduva.com</a>
            <a href="https://aixluxury.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">AiXLuxury.com</a>
            <Link href="/sitemap" className="hover:text-amber-400 transition-colors">Sitemap</Link>
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <Link href="/cookie-policy" className="hover:text-amber-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
export default Header;
