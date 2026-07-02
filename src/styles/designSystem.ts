/**
 * Unified Design System Tokens - AiX OS 2026
 * Applied globally to navbar, cards, modals, popups, and dropdowns.
 * Ensures consistent glassmorphic, transparent visual premium style.
 */

export const designSystem = {
  // Glassmorphic backgrounds
  glass: "backdrop-blur-xl border border-zinc-800 bg-[#080808]/65 shadow-2xl shadow-black/80",
  glassSolid: "backdrop-blur-2xl border border-zinc-800 bg-[#0c0c0c]/90 shadow-2xl shadow-black/95",
  glassTransparent: "backdrop-blur-md border border-zinc-900/50 bg-zinc-950/20",

  // Hover transitions & glows
  glassHover: "hover:border-amber-500/35 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 hover:translate-y-[-2px]",
  glowTop: "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500/35 via-amber-300/10 to-transparent",
  glowPulse: "absolute inset-0 rounded-full bg-amber-500/10 animate-pulse pointer-events-none",

  // Badges & status metrics
  badgeElite: "border-amber-500/30 text-amber-400 bg-amber-500/5 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-semibold",
  badgePremium: "border-sky-500/30 text-sky-400 bg-sky-500/5 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-semibold",
  badgeActive: "border-zinc-800 text-zinc-400 bg-zinc-900/30 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-semibold",

  // Typography helpers
  titleLarge: "font-display text-3xl md:text-4xl font-light text-white tracking-tight",
  titleMedium: "text-lg font-light text-white tracking-wide",
  textMuted: "text-xs text-zinc-400 leading-relaxed",
  tickerText: "text-[9px] font-mono uppercase tracking-widest text-zinc-550",

  // Spacing & borders
  cardSpacing: "p-5 sm:p-6 space-y-4",
  borderMuted: "border-zinc-850",
  divider: "border-t border-zinc-900/60",
};
