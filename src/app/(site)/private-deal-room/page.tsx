"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import {
  Lock,
  Unlock,
  Key,
  Shield,
  FileText,
  TrendingUp,
  Users,
  CheckCircle,
  Download,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";

export default function PrivateDealRoomPage() {
  const { language } = useLanguage();
  const [passcode, setPasscode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"asset" | "vault" | "negotiation">("asset");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "2030") {
      setAuthorized(true);
      setErrorMsg("");
    } else {
      setErrorMsg(
        language === "ro"
          ? "Cheie de decriptare incorectă. Contactează managerul de portofoliu."
          : "Invalid decryption key. Please contact your private portfolio manager."
      );
    }
  };

  const bypassCode = () => {
    setPasscode("2030");
    setAuthorized(true);
    setErrorMsg("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-12 animate-in text-left">
      <PageHeader
        badge="HNWI Encrypted Portal"
        title="Private Deal Room"
        subtitle={
          language === "ro"
            ? "Acces securizat dedicat investitorilor, cumpărătorilor și vânzătorilor calificați din portofoliul off-market."
            : "Encrypted deal terminal reserved for verified HNWI buyers, sellers, and active transactions."
        }
      />

      {/* ─── LOCKED STATE (PASSCODE GATED) ────────────────────────────────── */}
      {!authorized ? (
        <div className="max-w-md mx-auto p-8 rounded-3xl border border-amber-500/25 bg-white/85 backdrop-blur-2xl text-center space-y-6 relative overflow-hidden">
          {/* Glowing background */}
          <div className="absolute inset-0 bg-amber-500/[0.01] blur-3xl pointer-events-none rounded-full" />
          
          <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20 animate-pulse">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-zinc-900">
              {language === "ro" ? "Portal Criptat Securizat" : "Access Key Decryption"}
            </h3>
            <p className="text-xs text-zinc-450 leading-relaxed max-w-sm mx-auto">
              {language === "ro"
                ? "Introdu cheia de criptare de securitate atribuită tranzacției tale pentru a accesa registrul privat de documente."
                : "Enter the specific authorization passcode assigned to your asset transaction to decrypt the deal vault."}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">
                {language === "ro" ? "Cod Acces Cameră" : "Room Passcode Key"}
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/40 px-3.5 py-3 text-center text-sm text-zinc-900 placeholder-zinc-600 focus:border-amber-500/40 focus:outline-none transition-colors font-mono tracking-widest"
              />
            </div>

            {errorMsg && <p className="text-[10.5px] text-rose-400 font-mono italic">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black py-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/10"
            >
              <Key className="h-4 w-4" />
              <span>{language === "ro" ? "Decriptează Cameră" : "Decrypt Vault"}</span>
            </button>
          </form>

          {/* Bypass demo info */}
          <div className="pt-4 border-t border-zinc-200 flex justify-between items-center text-[10px] text-zinc-400">
            <span>Demo Passcode: <span className="font-mono text-amber-500">2030</span></span>
            <button onClick={bypassCode} className="text-amber-500 hover:underline cursor-pointer font-bold">
              Bypass Key &rarr;
            </button>
          </div>
        </div>
      ) : (
        
        /* ─── UNLOCKED HNWI TERMINAL ─────────────────────────────────────── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Info Panel */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Active Transaction Status Card */}
            <div className={`p-6 rounded-3xl ${designSystem.glass} space-y-4`}>
              <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                <Shield className="h-4.5 w-4.5 text-emerald-400" />
                <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider font-mono">Deal Coordinates</h3>
              </div>

              <div className="space-y-3.5 text-xs text-zinc-400">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-550 font-mono">Asset Identifier</p>
                  <p className="text-zinc-900 font-semibold mt-0.5">Off-Market Villa Aviatorilor</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-550 font-mono">Target Deal Value</p>
                  <p className="text-amber-400 font-mono font-bold text-base mt-0.5">12.500.000 €</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-550 font-mono">Negotiation Stage</p>
                  <p className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Pending Final Signatures
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200">
                <button
                  onClick={() => setAuthorized(false)}
                  className="w-full py-2 rounded-lg bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-400 hover:text-zinc-900 text-[10px] font-mono uppercase font-bold text-center block transition-all cursor-pointer"
                >
                  Lock Session
                </button>
              </div>
            </div>

            {/* AI Advisor Due Diligence Notes */}
            <div className={`p-6 rounded-3xl ${designSystem.glass} space-y-3.5 text-xs text-zinc-450 leading-relaxed`}>
              <h4 className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 font-mono">AiX Advisor Notes</h4>
              <p className="italic">
                &ldquo;Our structural audit certifies the foundations conform to Class 1 seismic codes. Tax allocation modeling advises completing transaction via Romanian SPV to reduce transfer tax friction by 1.8%.&rdquo;
              </p>
            </div>

          </div>

          {/* Content Pane */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Navigation Tabs */}
            <div className="flex gap-2 bg-white/60 p-1.5 border border-zinc-200 rounded-2xl">
              {[
                { key: "asset" as const, label: language === "ro" ? "Dosar Activ" : "Asset Ledger", icon: FileText },
                { key: "vault" as const, label: language === "ro" ? "Seif Acte" : "Document Vault", icon: Shield },
                { key: "negotiation" as const, label: language === "ro" ? "Negocieri" : "Negotiations", icon: TrendingUp }
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveSubTab(tab.key)}
                    className={`flex-1 text-center py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeSubTab === tab.key
                        ? "bg-amber-500 text-black shadow-md"
                        : "text-zinc-400 hover:text-zinc-600"
                    }`}
                  >
                    <TabIcon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB PANEL: ASSET LEDGER */}
            {activeSubTab === "asset" && (
              <div className={`p-6 rounded-3xl ${designSystem.glass} space-y-6`}>
                <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-200 pb-3 uppercase tracking-wider font-mono">Confidential Ledger Data</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-400">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">Plot Coordinates</p>
                    <p className="text-zinc-200">1,240 sqm premium land parcel, Aviatorilor Boulevard core corridor</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">Gross Built Area</p>
                    <p className="text-zinc-200">850 sqm internal usable layout with custom smart automation integrations</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">Zoning Permission</p>
                    <p className="text-zinc-200">Fully compliant with historical conservation guidelines. P + 2 building height allowed.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">Estimated Annual Yield</p>
                    <p className="text-zinc-200 font-mono">5.20% net ROI under luxury ambassador leasing scenarios</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-white/40 text-[11px] leading-relaxed text-zinc-400">
                  This transaction is handled exclusively. Sharing screenshots, links, or physical coordinates of this layout constitutes a direct NDA violation.
                </div>
              </div>
            )}

            {/* TAB PANEL: DOCUMENT VAULT */}
            {activeSubTab === "vault" && (
              <div className={`p-6 rounded-3xl ${designSystem.glass} space-y-4`}>
                <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-200 pb-3 uppercase tracking-wider font-mono">Secured Documents Checklist</h3>
                
                <div className="space-y-3">
                  {[
                    { name: "ANCPI Land Registry Certificate (Extras CF)", status: "VERIFIED BY AGENT", size: "2.4 MB" },
                    { name: "Sovereign Tax Clearance Audits (Certificat Fiscal)", status: "OK", size: "1.1 MB" },
                    { name: "Notarial Purchase Pre-Agreement Draft v2", status: "PENDING LEGAL REVIEW", size: "8.6 MB" },
                    { name: "Soil Diagnostic & Seismic Stability Certifications", status: "VERIFIED BY AGENT", size: "12.2 MB" }
                  ].map((doc, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-zinc-200 bg-white/30 hover:bg-zinc-100/10 transition-colors text-xs">
                      <div className="space-y-1 text-left">
                        <p className="font-semibold text-zinc-200">{doc.name}</p>
                        <div className="flex gap-2 text-[9px] font-mono text-zinc-550">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">{doc.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="p-2 rounded-lg bg-zinc-50 text-zinc-400 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300 cursor-pointer">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-zinc-50 text-zinc-400 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300 cursor-pointer">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB PANEL: NEGOTIATIONS */}
            {activeSubTab === "negotiation" && (
              <div className={`p-6 rounded-3xl ${designSystem.glass} space-y-6`}>
                <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-200 pb-3 uppercase tracking-wider font-mono">Negotiation Timeline Status</h3>
                
                <div className="relative border-l border-zinc-200 ml-4 pl-6 space-y-8 text-xs text-zinc-400 text-left">
                  
                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">Seller Counter-Offer Received</p>
                      <p className="text-[10px] text-zinc-550 font-mono mt-0.5">July 10, 2026 • 15:42</p>
                      <p className="mt-1 leading-relaxed text-zinc-450">
                        The vendor counter-proposed a final price of <span className="text-amber-400 font-bold">12.100.000 €</span>. Included clauses for progressive notarial releases and early handover escrow structures.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-200">Buyer Initial Offer Submitted</p>
                      <p className="text-[10px] text-zinc-550 font-mono mt-0.5">July 08, 2026 • 11:20</p>
                      <p className="mt-1 leading-relaxed text-zinc-450">
                        Formal acquisition intent placed at <span className="text-zinc-600 font-bold">11.800.000 €</span> with standard bank escrow arrangements and 30-day compliance audits clauses.
                      </p>
                    </div>
                  </div>

                  {/* Step 1 */}
                  <div className="relative text-zinc-400">
                    <div className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-750" />
                    </div>
                    <div>
                      <p className="font-semibold">NDA Finalized & Vault Synced</p>
                      <p className="text-[10px] text-zinc-650 font-mono mt-0.5">July 05, 2026 • 09:00</p>
                    </div>
                  </div>

                </div>

                <div className="border-t border-zinc-200 pt-4 flex flex-wrap gap-3 justify-end">
                  <button className="px-5 py-2 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-zinc-50 text-xs text-zinc-600 cursor-pointer">
                    Counter-Offer
                  </button>
                  <button className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold cursor-pointer">
                    Accept 12.1M € Offer
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
