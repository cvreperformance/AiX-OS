"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Star,
  Users,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Proprietăți", icon: Building2 },
  { href: "/admin/news", label: "Market Pulse", icon: Newspaper },
  { href: "/admin/opportunities", label: "Oportunități", icon: Star },
  { href: "/admin/developers", label: "Dezvoltatori", icon: Building2 },
  { href: "/admin/agencies", label: "Agenții", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-200 bg-zinc-50/50 min-h-screen p-4 flex flex-col">
      <Link href="/" className="flex items-center gap-2 px-3 py-4 mb-4">
        <span className="text-lg font-light tracking-[0.15em] text-zinc-900">AiX</span>
        <span className="text-lg font-light tracking-[0.15em] text-amber-500/80">OS</span>
        <span className="text-xs text-zinc-600 ml-1">Admin</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {adminLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:text-zinc-600 transition-colors mt-4"
      >
        <LogOut className="h-4 w-4" />
        Înapoi la site
      </Link>
    </aside>
  );
}
