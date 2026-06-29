"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/config";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#080808]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-light tracking-[0.15em] text-white group-hover:text-amber-400 transition-colors">
            AiX
          </span>
          <span className="text-xl font-light tracking-[0.15em] text-amber-500/80">
            OS
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-sm text-amber-400 hover:bg-amber-500/20 transition-all"
          >
            Admin
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-zinc-400 hover:text-white"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-zinc-800 bg-[#080808] px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800/50"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="block px-3 py-3 text-sm text-amber-400"
          >
            Admin Panel
          </Link>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#060606] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-light tracking-[0.15em] text-white">
                AiX
              </span>
              <span className="text-2xl font-light tracking-[0.15em] text-amber-500/80">
                OS
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              {siteConfig.tagline}
              <br />
              Turning Information Into Investment Decisions.
            </p>
            <p className="text-xs text-zinc-600">
              Powered by AiX OS Market Pulse
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
              Platformă
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/anunturi", label: "Proprietăți" },
                { href: "/stiri", label: "Market Pulse" },
                { href: "/oportunitati", label: "Oportunități" },
                { href: "/ai", label: "AI Advisor" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
              Ecosistem
            </h4>
            <ul className="space-y-2">
              {[
                { href: siteConfig.links.cristianvaduva, label: "CristianVaduva.com", external: true },
                { href: siteConfig.links.aixluxury, label: "AiXLuxury.com", external: true },
                { href: "/contact", label: "Contact" },
                { href: "/despre", label: "Despre" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} AiX OS. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Information is infinite. Intelligence is rare.
          </p>
        </div>
      </div>
    </footer>
  );
}
