"use client";

import Link from "next/link";
import { useState, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
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
import { AuthNavLinks } from "./AuthNavLinks";
import { AccountMenuSection } from "./AccountMenuSection";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  const [open, setOpen] = useState(false);
  const [gestureDragging, setGestureDragging] = useState(false);
  const [gestureProgress, setGestureProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showDeskDropdown, setShowDeskDropdown] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const gestureProgressRef = useRef(0);
  const gestureStartYRef = useRef(0);
  const gestureMovedRef = useRef(false);
  const gestureModeRef = useRef<"open" | "close" | null>(null);
  const gesturePointerIdRef = useRef<number | null>(null);
  const gestureRafRef = useRef<number | null>(null);

  const openMenu = () => {
    setOpen(true);
    setGestureProgress(1);
    gestureProgressRef.current = 1;
  };

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
      setGestureDragging(false);
      setGestureProgress(0);
      gestureProgressRef.current = 0;
      gestureModeRef.current = null;
      setShowDeskDropdown(false);
      setExpandedCategory(null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const closeMenu = () => {
    setOpen(false);
    setGestureDragging(false);
    setGestureProgress(0);
    gestureProgressRef.current = 0;
    gestureModeRef.current = null;
    setExpandedCategory(null);
  };

  const scheduleGestureProgress = (next: number) => {
    gestureProgressRef.current = Math.max(0, Math.min(1, next));
    if (gestureRafRef.current != null) return;
    gestureRafRef.current = window.requestAnimationFrame(() => {
      gestureRafRef.current = null;
      setGestureProgress(gestureProgressRef.current);
    });
  };

  useEffect(() => {
    return () => {
      if (gestureRafRef.current != null) {
        window.cancelAnimationFrame(gestureRafRef.current);
      }
    };
  }, []);

  const beginGesture = (
    mode: "open" | "close",
    e: ReactPointerEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    gestureModeRef.current = mode;
    gesturePointerIdRef.current = e.pointerId;
    gestureStartYRef.current = e.clientY;
    gestureMovedRef.current = false;
    setGestureDragging(true);
    if (mode === "open") {
      setOpen(true);
      scheduleGestureProgress(0);
    } else {
      setOpen(true);
      scheduleGestureProgress(1);
    }
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const updateGesture = (e: ReactPointerEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (gesturePointerIdRef.current !== e.pointerId) return;
    updateGestureFromClientY(e.clientY);
  };

  const updateGestureFromClientY = (clientY: number) => {
    if (!gestureDragging || !gestureModeRef.current) return;
    const deltaY = gestureStartYRef.current - clientY;
    if (Math.abs(deltaY) > 3) gestureMovedRef.current = true;
    const maxDrag = 220;
    const nextProgress =
      gestureModeRef.current === "open"
        ? Math.max(0, Math.min(1, deltaY / maxDrag))
        : Math.max(0, Math.min(1, 1 - Math.max(0, clientY - gestureStartYRef.current) / maxDrag));
    scheduleGestureProgress(nextProgress);
  };

  const finishGesture = () => {
    if (!gestureModeRef.current) return;
    const shouldOpen = gestureMovedRef.current
      ? gestureProgressRef.current > 0.5
      : gestureModeRef.current === "open";
    if (shouldOpen) {
      setOpen(true);
      scheduleGestureProgress(1);
    } else {
      setOpen(false);
      scheduleGestureProgress(0);
    }
    setGestureDragging(false);
    gestureModeRef.current = null;
    gesturePointerIdRef.current = null;
    gestureMovedRef.current = false;
  };

  useEffect(() => {
    if (!gestureDragging || gesturePointerIdRef.current == null) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerId !== gesturePointerIdRef.current) return;
      updateGestureFromClientY(event.clientY);
    };

    const handleEnd = (event: PointerEvent) => {
      if (event.pointerId !== gesturePointerIdRef.current) return;
      finishGesture();
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
    };
  }, [gestureDragging]);

  const menuProgress = gestureDragging ? gestureProgress : open ? 1 : 0;
  const menuVisible = open || gestureDragging || gestureProgress > 0;

  return (
    <>
      {/* ─── PRIMARY GLASS PANEL SERVICE HUB (TOP NAV REPLACEMENT) ───────── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 lg:pt-6">
        {/* Full Flat Grid Header - Visible on desktop at the top */}
        <div className={`hidden lg:block rounded-3xl border border-zinc-900 bg-[#080808]/75 backdrop-blur-xl p-6 sm:p-7 shadow-2xl relative transition-all duration-300 ${
          scrolled ? "opacity-0 -translate-y-4 pointer-events-none absolute" : "opacity-100 translate-y-0"
        }`}>
          {/* Top Brand & Actions line */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-5 mb-5 gap-4">
          <Link href="/" className="flex flex-col items-start group">
            <div className="flex items-center gap-1.5 min-h-8">
              <Brain className="h-5 w-5 text-amber-500 mr-1 animate-pulse" />
              <span className="text-xl font-light tracking-[0.2em] text-white group-hover:text-amber-400 transition-colors">AiX</span>
              <span className="text-xl font-light tracking-[0.2em] text-amber-500 flex items-start">
                OS<sup className="text-sm mt-0.5 ml-0.5">&trade;</sup>
              </span>
            </div>
            <span className="text-xs text-zinc-500 group-hover:text-amber-400/80 transition-colors tracking-wide ml-7">
              Powered by CristianVaduva.com
            </span>
          </Link>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Center */}
              <NotificationPopover />

              {/* Language Switcher */}
              <div className="flex items-center gap-0.5 border border-zinc-850 bg-zinc-950/60 rounded-full p-0.5 mr-1 font-mono">
                <button
                  onClick={() => setLanguage("ro")}
                  className={`min-h-10 min-w-10 px-3 py-2 text-[10px] font-bold rounded-full transition-all ${
                    language === "ro" ? "bg-amber-500/20 text-amber-400" : "text-zinc-550 hover:text-zinc-300"
                  }`}
                >
                  RO
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`min-h-10 min-w-10 px-3 py-2 text-[10px] font-bold rounded-full transition-all ${
                    language === "en" ? "bg-amber-500/20 text-amber-400" : "text-zinc-550 hover:text-zinc-300"
                  }`}
                >
                  EN
                </button>
              </div>

              <AuthNavLinks />
            </div>
          </div>

          {/* 5-Column Navigation Grid (Flat layout - discoverable in under 5 seconds) */}
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
            <AccountMenuSection language={language} />
          </div>
        </div>
      </div>

      {/* ─── STICKY HEADER TRIGGER (SHOWS ONLY ON SCROLL) ───────────────── */}
      <header
        className={`sticky top-0 z-[300] border-b border-zinc-900 bg-[#080808]/90 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          scrolled ? "translate-y-0 opacity-100" : "lg:-translate-y-20 lg:opacity-0 pointer-events-none lg:absolute"
        }`}
      >
        <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
          <Link href="/" className="flex flex-col items-start group">
            <div className="flex items-center gap-1.5 min-h-8">
              <Brain className="h-4.5 w-4.5 text-amber-500 mr-1 animate-pulse" />
              <span className="text-lg font-light tracking-[0.2em] text-white">AiX</span>
              <span className="text-lg font-light tracking-[0.2em] text-amber-500 flex items-start">
                OS<sup className="text-xs mt-0.5 ml-0.5">&trade;</sup>
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 group-hover:text-amber-400/80 transition-colors tracking-wide ml-6">
              Powered by CristianVaduva.com
            </span>
          </Link>

          {/* Sistem Desk Dropdown Toggle & Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop Desk Toggle */}
            <button
              onClick={() => setShowDeskDropdown(!showDeskDropdown)}
              className={`hidden lg:flex items-center gap-1.5 px-4 py-2 min-h-12 rounded-xl border transition-all text-xs font-semibold uppercase tracking-wider ${
                showDeskDropdown
                  ? "bg-amber-500/20 border-amber-500/35 text-amber-400"
                  : "border-zinc-800 text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>{language === "ro" ? "Sistem Desk" : "System Desk"}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${showDeskDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Notification Center */}
            <NotificationPopover />

            {/* Auth Nav Links (Sticky Header) */}
            <AuthNavLinks />

            {/* Global Language Toggle */}
            <button
              onClick={() => setLanguage(language === "ro" ? "en" : "ro")}
              className="flex min-h-12 min-w-12 items-center justify-center border border-zinc-850 bg-zinc-950/60 rounded-xl px-3 py-2 text-[10px] font-bold text-amber-400 hover:text-white uppercase font-mono transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/35"
            >
              {language === "ro" ? "EN" : "RO"}
            </button>

            {/* Mobile Menu Toggle Button (visible at all times next to toggle and alerts) */}
            <button
              onClick={open ? closeMenu : openMenu}
              className="xl:hidden flex items-center justify-center h-12 w-12 rounded-xl border border-zinc-850 bg-[#0f0f0f]/95 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all duration-150 select-none touch-manipulation shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/35"
              aria-label={language === "ro" ? "Meniu" : "Menu"}
            >
              <Brain className="h-5 w-5 text-pink-500 fill-pink-500/10 drop-shadow-[0_0_6px_rgba(236,72,153,0.35)] shrink-0 animate-pulse" />
              <span className="sr-only">{language === "ro" ? "Meniu" : "Menu"}</span>
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
        className={`xl:hidden fixed inset-x-0 bottom-0 z-[390] flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))] transition-all duration-200 ${
          menuVisible && !gestureDragging ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
        aria-hidden={menuVisible}
      >
        <button
          type="button"
          onPointerDown={(e) => beginGesture("open", e)}
          onPointerMove={updateGesture}
          onPointerUp={finishGesture}
          onPointerCancel={finishGesture}
          onClick={(e) => {
            e.preventDefault();
            if (!gestureDragging) openMenu();
          }}
          className="group flex w-full max-w-[280px] items-center gap-3 rounded-[22px] border border-zinc-800 bg-[#0a0a0a]/86 px-4 py-3 text-left shadow-2xl backdrop-blur-2xl touch-none select-none"
          style={{ touchAction: "none" }}
          aria-label={language === "ro" ? "Glisează pentru a deschide meniul" : "Slide to open menu"}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-[0_0_24px_rgba(201,169,98,0.12)]">
            <Brain className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400/90">
              {language === "ro" ? "Glisează pentru meniu" : "Slide to open menu"}
            </span>
            <span className="block text-[11px] text-zinc-500 leading-tight mt-0.5">
              {language === "ro"
                ? "Ridică pentru hub-ul complet de servicii"
                : "Lift to reveal the full service hub"}
            </span>
          </span>
          <ArrowRight className="h-4.5 w-4.5 shrink-0 text-zinc-600 transition-transform duration-200 group-active:translate-y-0.5" />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`xl:hidden fixed inset-0 z-[400] overflow-hidden transition-all duration-300 ease-out ${
          menuVisible ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuVisible}
      >
        <div
          className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
            menuVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
          style={{ opacity: menuProgress * 0.75 }}
        />

        <div
          className={`absolute inset-x-0 bottom-0 flex max-h-[82dvh] flex-col overflow-hidden rounded-t-[28px] border-t border-zinc-900 bg-[#080808] shadow-2xl transition-transform duration-300 ease-out ${
            menuVisible ? "translate-y-0" : "translate-y-full"
          }`}
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 68px)",
            transform: `translateY(${(1 - menuProgress) * 100}%)`,
            transitionProperty: gestureDragging ? "none" : "transform",
          }}
        >
          <div
            className="flex items-center justify-center px-5 pt-3 pb-2 flex-shrink-0 bg-[#080808] z-10"
            onPointerDown={(e) => beginGesture("close", e)}
            onPointerMove={updateGesture}
            onPointerUp={finishGesture}
            onPointerCancel={finishGesture}
            style={{ touchAction: "none" }}
          >
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-950/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-zinc-500"
              aria-label={language === "ro" ? "Glisează pentru a închide" : "Slide to close"}
            >
              <span className="h-1.5 w-10 rounded-full bg-zinc-700/80" />
              <Brain className="h-3.5 w-3.5 text-amber-400" />
              <span>{language === "ro" ? "Glisează pentru a închide" : "Slide to close"}</span>
            </button>
          </div>

          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-850 flex-shrink-0 bg-[#080808] z-10">
            <Link href="/" className="flex flex-col items-start group" onClick={closeMenu}>
              <div className="flex items-center gap-1.5 min-h-8">
                <Brain className="h-4.5 w-4.5 text-amber-500 mr-1 animate-pulse" />
                <span className="text-lg font-light tracking-[0.2em] text-white">AiX</span>
                <span className="text-lg font-light tracking-[0.2em] text-amber-500 flex items-start">
                  OS<sup className="text-xs mt-0.5 ml-0.5">&trade;</sup>
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 group-hover:text-amber-400/80 transition-colors tracking-wide ml-6">
                Powered by CristianVaduva.com
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="sm:hidden block">
                <AuthNavLinks />
              </div>
              <button
                onClick={closeMenu}
                className="flex items-center justify-center w-12 h-12 text-zinc-500 hover:text-white bg-zinc-900/60 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/35"
                aria-label={language === "ro" ? "Închide meniu" : "Close menu"}
              >
                <X size={18} />
              </button>
            </div>
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

            <div className="mt-2 mb-4 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
              <AccountMenuSection language={language} />
            </div>
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
            &copy; {new Date().getFullYear()} AiX OS&trade; &bull; {language === "ro" ? "Sistem Decizional de Intelligence Imobiliar" : "Decision Intelligence System"}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1 text-[10px] text-zinc-600 font-mono font-medium">
            <span>Status: {language === "ro" ? "Activ" : "Online"}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>&bull;</span>
            <span>{language === "ro" ? "Versiune" : "Version"}: v5.2.0-prod</span>
            <span>&bull;</span>
            <span>
              {language === "ro" ? "Creat de" : "Powered by"}{" "}
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
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              {language === "ro" ? "Politică de Confidențialitate" : "Privacy Policy"}
            </Link>
            <Link href="/cookie-policy" className="hover:text-amber-400 transition-colors">
              {language === "ro" ? "Politică de Cookie" : "Cookie Policy"}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
export default Header;
