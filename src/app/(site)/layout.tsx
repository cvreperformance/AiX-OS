import { Header, Footer } from "@/components/layout";
import { ConsultationPopup } from "@/components/layout/ConsultationPopup";
import { MarketAlertBanner } from "@/components/layout/MarketAlertBanner";
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

      {/* Consultation popup (shown after 15s on desktop) */}
      <ConsultationPopup />
      </div>
    </LanguageProvider>
  );
}
