/**
 * Unified Design System Tokens - AiX OS™ 2026
 * Applied globally to navbar, cards, modals, popups, and dropdowns.
 * Ensures consistent glassmorphic, transparent visual premium style.
 */

export const designSystem = {
  // Glassmorphic backgrounds (Dark Institutional Theme)
  glass: "backdrop-blur-xl border border-zinc-800/80 bg-zinc-950/80 shadow-2xl shadow-black/80",
  glassSolid: "backdrop-blur-2xl border border-zinc-800 bg-[#0B0B0D] shadow-2xl shadow-black/90",
  glassTransparent: "backdrop-blur-md border border-zinc-800/40 bg-zinc-950/40",

  // Hover transitions & glows
  glassHover: "hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:translate-y-[-2px]",
  glowTop: "absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-amber-500/50 via-amber-300/20 to-transparent",
  glowPulse: "absolute inset-0 rounded-full bg-amber-500/10 animate-pulse pointer-events-none",

  // Badges & status metrics
  badgeElite: "border border-amber-500/30 text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-semibold",
  badgePremium: "border border-zinc-800 text-zinc-300 bg-zinc-900 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-semibold",
  badgeActive: "border border-zinc-800 text-zinc-400 bg-zinc-950 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-semibold",

  // Typography helpers
  titleLarge: "font-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#F5F5F7] tracking-tight leading-none",
  titleMedium: "font-display text-xl md:text-2xl font-normal text-[#F5F5F7] tracking-tight",
  textMuted: "text-sm text-[#A1A1A6] leading-relaxed font-sans",
  tickerText: "text-[10px] font-mono uppercase tracking-widest text-[#A1A1A6]",

  // Spacing & borders
  cardSpacing: "p-6 sm:p-8 space-y-4",
  borderMuted: "border-zinc-800/80",
  divider: "border-t border-zinc-800/60",
};
