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
  LayoutGrid
} from "lucide-react";
import { siteConfig, footerLinks } from "@/lib/config";
import { brandContent } from "@/lib/content/brand";
import { SERVICES_DIRECTORY } from "@/lib/services";
import { MegaMenu } from "./MegaMenu";
import { useLanguage } from "@/context/LanguageContext";
import NotificationPopover from "@/components/ui/NotificationPopover";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  
  const dynamicLinks = [
    { href: "/", label: t("nav.home") },
    { key: "services", label: t("nav.services"), isPillar: true },
    { href: "/brain", label: "AiX Brain" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/compare", label: "Compare" },
    { href: "/document-intelligence", label: "Doc Audit" },
    { href: "/leads", label: "Leads" },
    { href: "/contact", label: t("nav.contact") },
  ];

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
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-bold">{t("nav.allServices")}</p>
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
            {SERVICES_DIRECTORY.map((category) => {
              const isExpanded = expandedCategory === category.id;
              const Icon = category.icon;
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
                      {category.title}
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
                        return (
                          <Link
                            key={sub.href}
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
                              <p className="text-xs font-semibold text-zinc-200 leading-tight">{sub.label}</p>
                              <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">{sub.desc}</p>
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
  const { language, t } = useLanguage();
  
  return (
    <footer className="border-t border-zinc-800 bg-[#060606] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 space-y-16">

        {/* Top: Brand + Contact */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 md:items-start">
          {/* Brand */}
          <div className="space-y-4 md:w-72 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-light tracking-[0.15em] text-white">AiX</span>
              <span className="text-2xl font-light tracking-[0.15em] text-amber-500/80">OS</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t("footer.tagline")}
              <br />
              <span className="text-zinc-500">{t("footer.locations")}</span>
            </p>
            {/* Contact quick links */}
            <div className="flex flex-wrap gap-3">
              <a
                href={brandContent.contact.whatsappText}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {t("nav.whatsapp")}
              </a>
              <a
                href={`tel:${brandContent.contact.phoneRORaw}`}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {brandContent.contact.phoneRO}
              </a>
            </div>
            {/* Social icons */}
            <div className="flex gap-3 flex-wrap pt-2">
              {[
                { label: "LinkedIn", href: "https://www.linkedin.com/in/cristianv%C4%83duva" },
                { label: "Instagram", href: "https://instagram.com/cristian_vaduva_cristianv" },
                { label: "Facebook", href: "https://www.facebook.com/CristianVaduvaCV" },
                { label: "YouTube", href: "https://youtube.com/@CristianVaduvaCV" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-zinc-600 hover:text-amber-400 transition-colors uppercase tracking-wider"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Platform & Ecosystem links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">
                {language === "ro" ? "Platformă" : "Platform"}
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.platform.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs font-medium text-zinc-400 hover:text-amber-400 transition-colors">
                      {language === "ro" ? l.label : (l.label === "Acasă" ? "Home" : l.label === "Proprietăți" ? "Properties" : l.label === "Oportunități" ? "Opportunities" : l.label)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" className="text-xs font-medium text-amber-500/70 hover:text-amber-400 transition-colors">
                    → {t("nav.allServices")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">
                {language === "ro" ? "Ecosistem" : "Ecosystem"}
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.ecosystem.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      target={"external" in l && l.external ? "_blank" : undefined}
                      rel={"external" in l && l.external ? "noopener noreferrer" : undefined}
                      className="text-xs font-medium text-zinc-400 hover:text-amber-400 transition-colors"
                    >
                      {language === "ro" ? l.label : (l.label === "Analize" ? "Market Insights" : l.label === "Despre" ? "About Us" : l.label === "Contact" ? "Contact" : l.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">{t("footer.strategic")}</p>
              <a
                href={brandContent.urls.personal}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs font-medium text-amber-500/70 hover:text-amber-400 transition-colors"
              >
                CristianVaduva.com ↗
              </a>
              <a
                href={brandContent.urls.luxury}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs font-medium text-amber-500/70 hover:text-amber-400 transition-colors"
              >
                AiXLuxury.com ↗
              </a>
            </div>
          </div>
        </div>

        {/* ALL SERVICES - Full Sitemap Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
              {language === "ro" ? "Toate Serviciile" : "All Services"}
            </h3>
            <Link href="/services" className="text-xs text-amber-500/70 hover:text-amber-400 transition-colors">
              {language === "ro" ? "Director complet →" : "Full Directory →"}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-8">
            {SERVICES_DIRECTORY.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${category.color}`} />
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold leading-none">
                      {language === "ro" ? category.title : (category.id === "ai" ? "AI" : category.id === "real-estate" ? "Real Estate" : category.id === "wealth" ? "Wealth" : category.id === "protection" ? "Protection" : "Resources")}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-[11px] text-zinc-500 hover:text-amber-400 transition-colors leading-snug block"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left space-y-1.5">
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} {language === "ro" ? "AiX OS — Ecosistem Digital de Tranzacții Imobiliare" : "AiX OS — Digital Real Estate Transaction Ecosystem"}
            </p>
            <p className="text-xs text-zinc-700 italic">
              {language === "ro" ? brandContent.about.short : "Secured, direct, discrete transaction execution system for de-risking high-value real estate investments."}
            </p>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-600/60 mt-4">
              {t("hero.powered")}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/despre" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">{t("nav.about")}</Link>
            <Link href="/services" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">{t("nav.allServices")}</Link>
            <Link href="/contact" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">{t("nav.contact")}</Link>
            <Link href="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="/cookie-policy" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
