"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronDown,
  Home,
  Building2,
  Sparkles,
  Users,
  TrendingUp,
  Newspaper,
  Activity,
  Award,
  Globe,
  Sliders,
  HelpCircle,
  Send,
  Map,
  Coins,
  Brain,
  BookOpen,
} from "lucide-react";
import { siteConfig, footerLinks } from "@/lib/config";
import { brandContent } from "@/lib/content/brand";
import { designSystem } from "@/styles/designSystem";
import { MegaMenu, PILLAR_MENUS } from "./MegaMenu";

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      // iOS-safe scroll lock: use position fixed to prevent background scroll
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-zinc-800 bg-[#080808]/90 backdrop-blur-xl shadow-2xl shadow-black/40"
          : "border-zinc-800/40 bg-[#080808]/60 backdrop-blur-md"
      }`}
      onMouseLeave={() => setActivePillar(null)}
    >
      <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 group flex-shrink-0" aria-label="AiX OS - Acasă">
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

        {/* Mobile Menu Trigger Button — 44px min touch target */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="xl:hidden flex items-center justify-center min-w-[44px] min-h-[44px] text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-xl transition-colors"
          aria-label={open ? "Închide meniu" : "Deschide meniu"}
          aria-expanded={open}
          style={{ touchAction: "manipulation" }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Modern Slide-out Mobile Menu Drawer — z-[300] above popup z-[250] */}
      {open && (
        <div className="fixed inset-0 z-[300] xl:hidden flex justify-end">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setOpen(false)}
          />

          {/* Sliding Drawer Container */}
          <div className="relative w-full max-w-sm h-full bg-[#080808] border-l border-zinc-800 flex flex-col p-6 shadow-2xl z-10 transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
              <Link href="/" className="flex items-center gap-1.5" onClick={() => setOpen(false)}>
                <span className="text-xl font-light tracking-[0.2em] text-white">AiX</span>
                <span className="text-xl font-light tracking-[0.2em] text-amber-500">OS</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900/80 rounded-full transition-all"
                aria-label="Închide meniu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Links Area */}
            <nav className="flex-1 overflow-y-auto py-6 space-y-2 pr-1">
              <p className="px-3 pb-1 text-[10px] uppercase tracking-widest text-zinc-600">Navigație Platformă</p>

              {/* Direct Links */}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                  pathname === "/" ? "bg-amber-500/10 text-amber-400" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              {/* Pillars Accordion */}
              <div className="pt-2 space-y-1">
                <p className="px-3 pb-2 text-[9px] uppercase tracking-widest text-zinc-650 font-semibold font-mono">Piloni Principali</p>
                {[
                  { key: "properties", label: "Properties", icon: Building2 },
                  { key: "markets", label: "Markets", icon: Activity },
                  { key: "ai", label: "AI & Tools", icon: Brain },
                  { key: "luxury", label: "Luxury Hub", icon: Sparkles },
                  { key: "services", label: "Services", icon: Sliders },
                ].map((p) => {
                  const isExpanded = expandedPillar === p.key;
                  const subItems = PILLAR_MENUS[p.key];
                  return (
                    <div key={p.key} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setExpandedPillar(isExpanded ? null : p.key)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-250 ${
                          isExpanded ? "bg-zinc-900/50 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                        }`}
                      >
                        <span className="flex items-center gap-3.5">
                          <p.icon className={`h-4 w-4 ${isExpanded ? "text-amber-500" : "text-zinc-500"}`} />
                          {p.label}
                        </span>
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180 text-amber-400" : "text-zinc-650"}`} />
                      </button>
                      {isExpanded && subItems && (
                        <div className="pl-4 ml-3 border-l border-zinc-900 space-y-1.5 animate-in fade-in slide-in-from-top-1.5 duration-200">
                          {subItems.map((sub) => {
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => {
                                  setOpen(false);
                                  setExpandedPillar(null);
                                }}
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/25 transition-all"
                              >
                                <SubIcon className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                                <span>{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Auxiliary links */}
              <div className="pt-4 border-t border-zinc-900 space-y-1">
                <Link
                  href="/despre"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                    pathname === "/despre" ? "bg-amber-500/10 text-amber-400" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                    pathname === "/contact" ? "bg-amber-500/10 text-amber-400" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  <Send className="h-4 w-4" />
                  Contact
                </Link>
              </div>
            </nav>

            {/* Quick Actions Footer */}
            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${brandContent.contact.phoneRORaw}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 py-3 text-xs text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
                >
                  <Phone className="h-4 w-4 text-amber-400" />
                  Sună
                </a>
                <a
                  href={brandContent.contact.whatsappText}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600/10 border border-emerald-500/30 py-3 text-xs text-emerald-400 hover:bg-emerald-600/20 transition-all font-semibold"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("open-contact-popup"));
                }}
                className="block w-full py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-black bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors duration-300"
              >
                Solicită Consultanță
              </button>
            </div>
          </div>
        </div>
      )}
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
