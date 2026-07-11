/**
 * Unified Design System Tokens - AiX OS™ 2026
 * Applied globally to navbar, cards, modals, popups, and dropdowns.
 * Ensures consistent glassmorphic, transparent visual premium style.
 */

export const designSystem = {
  // Glassmorphic backgrounds (Light Theme)
  glass: "backdrop-blur-xl border border-zinc-200 bg-white/70 shadow-xl shadow-zinc-200/50/5",
  glassSolid: "backdrop-blur-2xl border border-zinc-200 bg-zinc-50/90 shadow-xl shadow-zinc-200/50/5",
  glassTransparent: "backdrop-blur-md border border-zinc-200/50 bg-white/40",

  // Hover transitions & glows
  glassHover: "hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 hover:translate-y-[-2px]",
  glowTop: "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500/40 via-amber-300/20 to-transparent",
  glowPulse: "absolute inset-0 rounded-full bg-amber-500/10 animate-pulse pointer-events-none",

  // Badges & status metrics
  badgeElite: "border-amber-500/30 text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-semibold",
  badgePremium: "border-sky-500/30 text-sky-600 bg-sky-500/10 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-semibold",
  badgeActive: "border-zinc-300 text-zinc-600 bg-zinc-100/80 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-semibold",

  // Typography helpers
  titleLarge: "font-display text-3xl md:text-4xl font-light text-zinc-900 tracking-tight",
  titleMedium: "text-lg font-light text-zinc-900 tracking-wide",
  textMuted: "text-xs text-zinc-400 leading-relaxed",
  tickerText: "text-[9px] font-mono uppercase tracking-widest text-zinc-600",

  // Spacing & borders
  cardSpacing: "p-5 sm:p-6 space-y-4",
  borderMuted: "border-zinc-200",
  divider: "border-t border-zinc-200/60",
};
