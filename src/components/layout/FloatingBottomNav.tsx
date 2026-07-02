"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, Activity, Brain, MessageCircle } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/proprietati", label: "Properties", icon: Building2 },
  { href: "/market", label: "Markets", icon: Activity },
  { href: "/ai", label: "AI", icon: Brain },
];

export function FloatingBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[200] xl:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Mobile navigation"
    >
      {/* Glass bar */}
      <div className="border-t border-zinc-800/80 bg-[#090909]/95 backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-0">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-3 px-1 min-h-[56px] transition-colors duration-200 ${
                  active
                    ? "text-amber-400"
                    : "text-zinc-500 hover:text-zinc-300 active:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    active ? "scale-110" : ""
                  }`}
                  strokeWidth={active ? 2 : 1.5}
                />
                <span className={`text-[9px] font-semibold uppercase tracking-wider leading-none ${
                  active ? "text-amber-400" : "text-zinc-600"
                }`}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-amber-500 rounded-full" />
                )}
              </Link>
            );
          })}

          {/* Contact — special button */}
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-contact-popup"))
            }
            className="flex flex-col items-center justify-center gap-1 py-3 px-1 min-h-[56px] text-zinc-500 hover:text-zinc-300 active:text-amber-400 transition-colors duration-200"
            aria-label="Contact"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-[9px] font-semibold uppercase tracking-wider leading-none text-zinc-600">
              Contact
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
