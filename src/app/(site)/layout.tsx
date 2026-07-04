import { Header, Footer } from "@/components/layout";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { ConsultationPopup } from "@/components/layout/ConsultationPopup";
import { MarketAlertBanner } from "@/components/layout/MarketAlertBanner";
import { StickyBottomCTA } from "@/components/layout/StickyBottomCTA";
import { LanguageProvider } from "@/context/LanguageContext";
import { SystemBackgroundLayer } from "@/components/layout/SystemBackgroundLayer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="min-h-full flex flex-col relative">
        {/* Animated background data layer */}
        <SystemBackgroundLayer />
      {/* Rotating market alert banner */}
      <MarketAlertBanner />

      {/* Main navigation */}
      <Header />

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Floating contact button (bottom-right) */}
      <FloatingCTA />

      {/* Sticky bottom CTA bar (shown after scroll) */}
      <StickyBottomCTA />

      {/* Consultation popup (shown after 15s on desktop) */}
      <ConsultationPopup />
      </div>
    </LanguageProvider>
  );
}
