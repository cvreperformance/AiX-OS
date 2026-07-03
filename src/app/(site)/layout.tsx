import { Header, Footer } from "@/components/layout";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { ConsultationPopup } from "@/components/layout/ConsultationPopup";
import { MarketAlertBanner } from "@/components/layout/MarketAlertBanner";
import { StickyBottomCTA } from "@/components/layout/StickyBottomCTA";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col">
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
  );
}
