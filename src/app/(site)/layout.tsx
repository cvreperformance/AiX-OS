import { Header, Footer } from "@/components/layout";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { ConsultationPopup } from "@/components/layout/ConsultationPopup";
import { MarketAlertBanner } from "@/components/layout/MarketAlertBanner";
import { StickyBottomCTA } from "@/components/layout/StickyBottomCTA";
import { FloatingBottomNav } from "@/components/layout/FloatingBottomNav";

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

      {/* Page content with bottom padding on mobile for bottom nav */}
      <main className="flex-1 pb-16 xl:pb-0">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Floating contact button (bottom-right) */}
      <FloatingCTA />

      {/* Sticky bottom CTA bar (shown after 5s) - desktop only */}
      <div className="hidden xl:block">
        <StickyBottomCTA />
      </div>

      {/* Floating bottom navigation bar - mobile only */}
      <FloatingBottomNav />

      {/* Consultation popup (shown after 15s) */}
      <ConsultationPopup />
    </div>
  );
}
