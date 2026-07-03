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
  Building2,
  Sparkles,
  Users,
  Newspaper,
  Activity,
  Sliders,
  Send,
  Brain,
} from "lucide-react";
import { siteConfig, footerLinks } from "@/lib/config";
import { brandContent } from "@/lib/content/brand";
import { MegaMenu } from "./MegaMenu";

const TOP_LINKS = [
  { href: "/", label: "Home" },
  { key: "properties", label: "Properties", isPillar: true },
  { key: "markets", label: "Markets", isPillar: true },
  { key: "ai", label: "AI", isPillar: true },
  { key: "luxury", label: "Luxury", isPillar: true },
  { key: "services", label: "Services", isPillar: true },
  { href: "/despre", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll lock: toggle overflow-hidden on html element (no position:fixed hacks)
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
      setExpandedPillar(null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const closeMenu = () => {
    setOpen(false);
    setExpandedPillar(null);
  };

  const MOBILE_PILLARS = [
    {
      key: "properties",
      label: "Properties",
      icon: Building2,
      color: "text-blue-400",
      items: [
        { href: "/proprietati", label: "Properties", desc: "Catalog complet" },
        { href: "/dezvoltatori", label: "Developers", desc: "Dezvoltatori premium" },
        { href: "/agentii", label: "Agencies", desc: "Agenții partenere" },
        { href: "/oportunitati", label: "Opportunities", desc: "Off-market deals" },
        { href: "/map", label: "Map GIS", desc: "Hartă interactivă" },
        { href: "/aix-score", label: "AiX Score", desc: "Rating activ" },
      ],
    },
    {
      key: "markets",
      label: "Markets",
      icon: Activity,
      color: "text-emerald-400",
      items: [
        { href: "/market", label: "Market Pulse", desc: "Dashboard macro" },
        { href: "/market#stocks", label: "Stocks", desc: "S&P 500, Nasdaq" },
        { href: "/market#crypto", label: "Crypto", desc: "BTC, ETH, SOL live" },
        { href: "/market#commodities", label: "Commodities", desc: "Aur, Petrol" },
        { href: "/wealth", label: "Wealth", desc: "Averi globale" },
        { href: "/stiri", label: "News", desc: "Analize piață" },
        { href: "/books", label: "Books Library", desc: "Cărți recomandate AiX" },
      ],
    },
    {
      key: "ai",
      label: "AI Tools",
      icon: Brain,
      color: "text-violet-400",
      items: [
        { href: "/money-advisor", label: "Money Advisor", desc: "Consilier AI" },
        { href: "/anti-teapa", label: "AntiȚeapă AI", desc: "Risc cadastral" },
        { href: "/valuation", label: "AI Valuation", desc: "Evaluare instant" },
        { href: "/buyer", label: "Buyer AI", desc: "Asistență achiziție" },
        { href: "/seller", label: "Seller AI", desc: "Strategie vânzare" },
        { href: "/insurance", label: "Insurance AI", desc: "Brokeraj asigurare" },
        { href: "/cybersecurity", label: "Cybersecurity", desc: "Securitate & Anti-fraudă" },
        { href: "/ai", label: "Technology Hub", desc: "AI & Automatizare" },
      ],
    },
    {
      key: "luxury",
      label: "Luxury Hub",
      icon: Sparkles,
      color: "text-amber-400",
      items: [
        { href: "/private-jets", label: "Private Jets", desc: "Charter aerian" },
        { href: "/cars", label: "Luxury Cars", desc: "Supercars VIP" },
        { href: "/yachts", label: "Yachts", desc: "Charter mediteran" },
        { href: "/concierge", label: "Concierge", desc: "Lifestyle management" },
        { href: "/network", label: "Private Network", desc: "UHNW ecosystem" },
      ],
    },
    {
      key: "services",
      label: "Services",
      icon: Sliders,
      color: "text-rose-400",
      items: [
        { href: "/buyer", label: "Buyer Representation", desc: "Reprezentare cumpărător" },
        { href: "/seller", label: "Seller Representation", desc: "Strategie vânzare" },
        { href: "/insurance", label: "Insurance Desk", desc: "Asigurări premium" },
        { href: "/investments", label: "Investments", desc: "Portofoliu global" },
        { href: "/network", label: "Private Network", desc: "Rețea UHNW" },
        { href: "/cybersecurity", label: "Cybersecurity", desc: "Protecție anti-fraudă" },
        { href: "/calculators", label: "Calculators", desc: "ROI, ipotecă, yield" },
      ],
    },
  ];

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
          {TOP_LINKS.map((link) => {
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
                    className={`flex items-center gap-1 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg hover:bg-zinc-900/45 ${
                      isHovered ? "text-amber-400" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isHovered ? "rotate-180" : ""}`} />
                  </button>
                  {isHovered && (
                    <MegaMenu pillar={link.key} onClose={() => setActivePillar(null)} />
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
          <a
            href={brandContent.contact.whatsappText}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 transition-all duration-300 flex items-center gap-1.5 shadow-sm"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        {/* Mobile: search hint + hamburger */}
        <div className="xl:hidden flex items-center gap-2">
          {/* Hamburger Toggle — 44×44 minimum touch target */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center justify-center w-11 h-11 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-all duration-200 relative z-10"
            aria-label={open ? "Închide meniu" : "Deschide meniu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            style={{ touchAction: "manipulation" }}
          >
            {/* Animated bars */}
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
          Always in DOM, animated via transform
          ───────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={`xl:hidden fixed inset-0 z-[400] overflow-hidden transition-all duration-300 ease-out ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        {/* Drawer panel — slides in from right */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-[320px] sm:max-w-sm flex flex-col bg-[#0a0a0a] border-l border-zinc-800/80 shadow-2xl transition-transform duration-300 ease-out overflow-hidden ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {/* ── Drawer Header ── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 flex-shrink-0">
            <Link href="/" className="flex items-center gap-1.5" onClick={closeMenu}>
              <span className="text-lg font-light tracking-[0.2em] text-white">AiX</span>
              <span className="text-lg font-light tracking-[0.2em] text-amber-500">OS</span>
            </Link>
            <button
              onClick={closeMenu}
              className="flex items-center justify-center w-9 h-9 text-zinc-500 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-all"
              aria-label="Închide meniu"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Quick Actions ── */}
          <div className="px-4 pt-4 pb-3 flex-shrink-0">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600 font-semibold mb-2.5 px-1">Acces Rapid</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/proprietati", label: "Properties", icon: Building2, color: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
                { href: "/market", label: "Markets", icon: Activity, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
                { href: "/money-advisor", label: "AI Advisor", icon: Brain, color: "text-violet-400 border-violet-500/20 bg-violet-500/5" },
                { href: "/contact", label: "Contact", icon: Send, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
              ].map((qa) => {
                const Icon = qa.icon;
                return (
                  <Link
                    key={qa.href}
                    href={qa.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${qa.color}`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {qa.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="mx-4 border-t border-zinc-800/60 flex-shrink-0" />

          {/* ── Scrollable Nav Area ── */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 overscroll-contain">
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600 font-semibold mb-2 px-2">Navigație</p>

            {/* Home link */}
            <Link
              href="/"
              onClick={closeMenu}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all active:scale-98 ${
                pathname === "/"
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <Home className="h-4 w-4 flex-shrink-0" />
              Home
            </Link>

            {/* Accordion Pillars */}
            {MOBILE_PILLARS.map((pillar) => {
              const isExpanded = expandedPillar === pillar.key;
              const Icon = pillar.icon;
              return (
                <div key={pillar.key}>
                  <button
                    type="button"
                    onClick={() => setExpandedPillar(isExpanded ? null : pillar.key)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all active:scale-98 ${
                      isExpanded
                        ? "bg-zinc-900/60 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                    }`}
                    aria-expanded={isExpanded}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${isExpanded ? pillar.color : "text-zinc-600"}`} />
                      {pillar.label}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-amber-400" : "text-zinc-700"
                      }`}
                    />
                  </button>

                  {/* Sub-items — animated height */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-3 pl-4 border-l border-zinc-800/60 space-y-0.5 pt-1 pb-2">
                      {pillar.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={closeMenu}
                          className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-all active:scale-98 group ${
                            pathname === sub.href || pathname.startsWith(sub.href + "/")
                              ? "bg-amber-500/8 text-amber-400"
                              : "text-zinc-500 hover:text-white hover:bg-zinc-900/30"
                          }`}
                        >
                          <span className="flex flex-col gap-0">
                            <span className="text-xs font-medium leading-tight">{sub.label}</span>
                            <span className="text-[10px] text-zinc-700 group-hover:text-zinc-500 leading-tight">{sub.desc}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Separator + Aux links */}
            <div className="pt-2 mt-2 border-t border-zinc-800/40 space-y-0.5">
              {[
                { href: "/despre", label: "About", icon: Users },
                { href: "/contact", label: "Contact", icon: Send },
                { href: "/stiri", label: "News & Analize", icon: Newspaper },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all active:scale-98 ${
                      pathname === link.href
                        ? "bg-amber-500/10 text-amber-400"
                        : "text-zinc-500 hover:text-white hover:bg-zinc-900/40"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ── Footer Actions ── */}
          <div className="px-4 pb-4 pt-3 border-t border-zinc-800/60 space-y-2.5 flex-shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${brandContent.contact.phoneRORaw}`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
              >
                <Phone className="h-4 w-4 text-amber-400" />
                Sună
              </a>
              <a
                href={brandContent.contact.whatsappText}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/20 transition-all active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                window.dispatchEvent(new CustomEvent("open-contact-popup"));
              }}
              className="w-full py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-black bg-amber-500 hover:bg-amber-400 rounded-xl transition-all active:scale-98 shadow-lg shadow-amber-500/20"
            >
              Solicită Consultanță Gratuită
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#060606] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-light tracking-[0.15em] text-white">AiX</span>
              <span className="text-2xl font-light tracking-[0.15em] text-amber-500/80">OS</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {siteConfig.tagline}
              <br />
              <span className="text-zinc-500">Monaco · Dubai · București · Europa</span>
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
                WhatsApp
              </a>
              <a
                href={`tel:${brandContent.contact.phoneRORaw}`}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {brandContent.contact.phoneRO}
              </a>
              <a
                href={brandContent.contact.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                Telegram
              </a>
            </div>
            {/* Social icons row */}
            <div className="flex gap-3 flex-wrap">
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
                  className="text-xs text-zinc-600 hover:text-amber-400 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Platformă</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-zinc-400 hover:text-amber-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Servicii</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-zinc-400 hover:text-amber-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Ecosistem</h4>
            <ul className="space-y-2">
              {footerLinks.ecosystem.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={"external" in l && l.external ? "_blank" : undefined}
                    rel={"external" in l && l.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <p className="text-xs text-zinc-600 uppercase tracking-widest">Parteneri</p>
              <a
                href={brandContent.urls.personal}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-amber-500/70 hover:text-amber-400 transition-colors"
              >
                CristianVaduva.com ↗
              </a>
              <a
                href={brandContent.urls.luxury}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-amber-500/70 hover:text-amber-400 transition-colors"
              >
                AiXLuxury.com ↗
              </a>
              <a
                href={brandContent.urls.linktree}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-zinc-600 hover:text-amber-400 transition-colors"
              >
                Linktree ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} AiX OS — Powered by CristianVaduva.com · AiXLuxury.com
            </p>
            <p className="text-xs text-zinc-700 mt-0.5">
              {brandContent.about.short}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/despre" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Despre</Link>
            <Link href="/contact" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Contact</Link>
            <Link href="/privacy" className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors">Politica de Confidențialitate</Link>
            <Link href="/cookie-policy" className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors">Politica de Cookie-uri</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
