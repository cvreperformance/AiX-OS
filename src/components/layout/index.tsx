"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Brain,
  Shield,
  BookOpen,
  TrendingUp,
  Search,
  Send,
  Building2,
  Wrench,
  Gem,
  Phone
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import NotificationPopover from "@/components/ui/NotificationPopover";
import { AuthNavLinks } from "./AuthNavLinks";
import { AccountMenuSection } from "./AccountMenuSection";
import { navigationCategories } from "@/config/navigation.config";

export function Header() {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[300] border-b transition-all duration-300 ${
          scrolled 
            ? "bg-black/90 backdrop-blur-xl border-zinc-800 shadow-2xl py-2" 
            : "bg-black/60 backdrop-blur-md border-zinc-800/50 py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-6">
          
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
            <Brain className="h-5 w-5 text-amber-500 mr-1 group-hover:animate-pulse" />
            <span className="text-xl font-light tracking-[0.2em] text-zinc-100 group-hover:text-white transition-colors">AiX</span>
            <span className="text-xl font-light tracking-[0.2em] text-amber-500 flex items-start group-hover:text-amber-400 transition-colors">
              OS<sup className="text-sm mt-0.5 ml-0.5">&trade;</sup>
            </span>
          </Link>

          <nav className="hidden lg:flex flex-1 justify-center items-center h-full">
            <ul className="flex items-center gap-1">
              {navigationCategories.map((nav) => {
                const isActive = activeDropdown === nav.id;
                return (
                  <li 
                    key={nav.id} 
                    className="relative px-2 py-4"
                    onMouseEnter={() => handleMouseEnter(nav.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-full ${
                      isActive ? "text-amber-400 bg-amber-500/10" : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                    }`}>
                      {language === "ro" ? nav.title : nav.titleEn}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`} />
                    </button>

                    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
                      isActive ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}>
                      <div className="w-64 rounded-2xl border border-zinc-800 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl p-2 overflow-hidden">
                        {nav.items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            className="block px-4 py-2.5 text-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-800/50 rounded-xl transition-colors"
                          >
                            {language === "ro" ? item.label : item.labelEn}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={() => setLanguage(language === "ro" ? "en" : "ro")}
              className="flex items-center justify-center border border-zinc-700 bg-zinc-900/60 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 hover:text-white uppercase font-mono transition-colors"
            >
              {language === "ro" ? "EN" : "RO"}
            </button>
            <NotificationPopover />
            <AuthNavLinks />
          </div>

          <button
            className="lg:hidden p-2 text-zinc-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-[250] bg-black/95 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="flex flex-col h-full pt-24 pb-6 px-4 overflow-y-auto">
          
          <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
            <button
              onClick={() => setLanguage(language === "ro" ? "en" : "ro")}
              className="flex items-center justify-center border border-zinc-700 bg-zinc-900/60 rounded-xl px-4 py-2 text-xs font-bold text-amber-400 uppercase font-mono"
            >
              Language: {language === "ro" ? "EN" : "RO"}
            </button>
            <div className="flex gap-4">
              <NotificationPopover />
              <AuthNavLinks />
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navigationCategories.map((nav) => {
              const isExpanded = mobileExpanded === nav.id;
              const Icon = nav.icon;
              return (
                <div key={nav.id} className="rounded-2xl border border-zinc-800/50 overflow-hidden bg-zinc-900/20">
                  <button
                    onClick={() => setMobileExpanded(isExpanded ? null : nav.id)}
                    className="w-full flex items-center justify-between p-4 text-zinc-300 hover:text-white hover:bg-zinc-800/30 transition-colors"
                  >
                    <span className="flex items-center gap-3 font-medium text-[15px]">
                      <Icon className="h-5 w-5 text-amber-500/80" />
                      {language === "ro" ? nav.title : nav.titleEn}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180 text-amber-400" : ""}`} />
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[1400px]" : "max-h-0"}`}>
                    <div className="p-2 pb-4 bg-zinc-900/40">
                      {nav.items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="block px-12 py-3 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {language === "ro" ? item.label : item.labelEn}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-zinc-800">
             <AccountMenuSection language={language} />
          </div>
        </div>
      </div>
    </>
  );
}

export function Footer() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <footer className="border-t border-zinc-200 bg-white mt-auto pb-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        
        <div className="space-y-1">
          <p className="text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} AiX OS&trade; &bull; {language === "ro" ? "Sistem Decizional de Intelligence Imobiliar" : "Decision Intelligence System"}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1 text-[10px] text-zinc-600 font-mono font-medium">
            <span>Status: {language === "ro" ? "Activ" : "Online"}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>&bull;</span>
            <span>
              {language === "ro" ? "Creat de" : "Powered by"}{" "}
              <a href="https://cristianvaduva.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-amber-400 underline transition-colors">
                CristianVaduva.com
              </a>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="flex items-center gap-0.5 border border-zinc-200 bg-white/60 rounded-full p-0.5">
            <button
              onClick={() => setLanguage("ro")}
              className={`px-2.5 py-1 text-[9px] font-bold rounded-full transition-all ${
                language === "ro" ? "bg-amber-500/20 text-amber-400" : "text-zinc-550 hover:text-zinc-600"
              }`}
            >
              RO
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 text-[9px] font-bold rounded-full transition-all ${
                language === "en" ? "bg-amber-500/20 text-amber-400" : "text-zinc-600"
              }`}
            >
              EN
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-zinc-550">
            <a href="https://t.me/capitalinvestcristianvaduva" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Send className="h-3 w-3" /> Telegram
            </a>
            <a href="https://cristianvaduva.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">CristianVaduva.com</a>
            <a href="https://aixluxury.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">AiXLuxury.com</a>
            <Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
            <Link href="/sitemap" className="hover:text-amber-400 transition-colors">Sitemap</Link>
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              {language === "ro" ? "Politică de Confidențialitate & Notă GDPR" : "Privacy Policy & GDPR Notice"}
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
