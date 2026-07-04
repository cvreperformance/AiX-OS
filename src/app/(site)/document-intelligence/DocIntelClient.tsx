"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

interface AuditResult {
  fileName: string;
  fileSize: string;
  type: string;
  summaryRo: string;
  summaryEn: string;
  risks: {
    labelRo: string;
    labelEn: string;
    severity: "low" | "medium" | "high";
    descRo: string;
    descEn: string;
  }[];
}

export default function DocIntelClient() {
  const { language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audit, setAudit] = useState<AuditResult | null>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleStartAudit(dropped);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleStartAudit(selected);
  };

  const handleStartAudit = (selectedFile: File) => {
    setFile(selectedFile);
    setLoading(true);
    setProgress(0);
    setAudit(null);

    // Simulate OCR progress tick
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          // Set simulated audit reports
          setAudit({
            fileName: selectedFile.name,
            fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
            type: selectedFile.type || "application/pdf",
            summaryRo: "Promisiune bilaterală de vânzare-cumpărare având ca obiect un apartament situat în Floreasca. Documentul stabilește un avans de 25% și finalizarea tranzacției la notar în septembrie 2026.",
            summaryEn: "Bilateral promise of purchase and sale concerning a Floreasca residential unit. The deed specifies a 25% down payment with final notarization scheduled for September 2026.",
            risks: [
              {
                labelRo: "Ipotecă active nesalvată",
                labelEn: "Active Unresolved Bank Lien",
                severity: "high",
                descRo: "Documentul menționează că proprietatea este liberă de sarcini, însă extrasul cadastral arată o ipotecă activă înscrisă de o bancă comercială.",
                descEn: "Contract states asset is clear of liens, but cadastre index maps an active commercial bank mortgage.",
              },
              {
                labelRo: "Penalități disproporționate",
                labelEn: "Asymmetric Late Penalties",
                severity: "medium",
                descRo: "Penalitățile de întârziere pentru cumpărător sunt de 0.1% pe zi, în timp ce pentru vânzător sunt limitate la un cuantum fix redus.",
                descEn: "Late penalties for buyer run at 0.1% daily, whereas seller limits are capped at a low fixed threshold.",
              },
              {
                labelRo: "Plan cadastral lipsă",
                labelEn: "Missing Floor Plan Attachment",
                severity: "low",
                descRo: "Releveul tehnic nu este anexat contractului de promisiune, riscând discrepanțe de cotă de mp la finalizare.",
                descEn: "Technical map sheets are not attached to the promise contract, creating square footage layout risks.",
              },
            ],
          });
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10 animate-in">
      <PageHeader
        badge="Cognitive Document Layer"
        title={language === "ro" ? "Document Intelligence & OCR" : "Document Intelligence & OCR"}
        subtitle={
          language === "ro"
            ? "Încarcă promisiuni, contracte de vânzare sau extrase de CF. Robotul va scana textul și va extrage rezumatul și lista de riscuri juridice."
            : "Upload sales promises, title deeds, or cadastre records. Our model runs OCR analysis to compile risk checklists."
        }
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Upload column */}
        <div className="lg:col-span-5 space-y-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className={`p-10 rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-950/20 hover:border-amber-500/35 transition-all text-center space-y-4 flex flex-col items-center justify-center cursor-pointer min-h-[280px]`}
          >
            <UploadCloud className="h-12 w-12 text-zinc-650 animate-pulse" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-white">
                {language === "ro" ? "Trage fișierele aici sau alege manual" : "Drag & drop files here or click to select"}
              </p>
              <p className="text-[10px] text-zinc-550">
                {language === "ro" ? "Suportă PDF, Word sau imagini (Max 15MB)" : "Supports PDF, DOCX, PNG, JPG (Max 15MB)"}
              </p>
            </div>

            <label className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 text-black px-5 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all cursor-pointer">
              {language === "ro" ? "Alege Fișier" : "Browse File"}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Progress bar */}
          {loading && (
            <div className={`p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-3`}>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-zinc-450 font-medium">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-500" />
                  {language === "ro" ? "Procesare OCR & Audit..." : "OCR Parsing & Auditing..."}
                </span>
                <span className="font-mono text-white font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Audit Results column */}
        <div className="lg:col-span-7 space-y-6">
          {audit ? (
            <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} border border-zinc-800 space-y-6 shadow-2xl animate-in fade-in duration-200`}>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{audit.fileName}</h3>
                    <p className="text-[10px] text-zinc-550 font-mono">{audit.fileSize} · {audit.type}</p>
                  </div>
                </div>
                <span className={designSystem.badgeElite}>AI Scanned</span>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-zinc-550 font-mono font-semibold">
                  {language === "ro" ? "Rezumat Document" : "Document Summary"}
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/30 p-3.5 rounded-xl border border-zinc-900">
                  {language === "ro" ? audit.summaryRo : audit.summaryEn}
                </p>
              </div>

              {/* Risk Audit Checklist */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-550 font-mono font-semibold">
                  {language === "ro" ? "Verificare Riscuri Juridice" : "Contract Risk Audit"}
                </p>
                <div className="space-y-2">
                  {audit.risks.map((risk, index) => {
                    const isHigh = risk.severity === "high";
                    const isMed = risk.severity === "medium";

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border flex gap-3 ${
                          isHigh
                            ? "border-red-500/20 bg-red-500/[0.02]"
                            : isMed
                            ? "border-amber-500/20 bg-amber-500/[0.02]"
                            : "border-zinc-900 bg-zinc-950/20"
                        }`}
                      >
                        <AlertTriangle
                          className={`h-4 w-4 shrink-0 mt-0.5 ${
                            isHigh ? "text-red-400" : isMed ? "text-amber-400" : "text-zinc-500"
                          }`}
                        />
                        <div className="space-y-1">
                          <p
                            className={`text-xs font-semibold ${
                              isHigh ? "text-red-300" : isMed ? "text-amber-300" : "text-white"
                            }`}
                          >
                            {language === "ro" ? risk.labelRo : risk.labelEn}
                            <span className="text-[8.5px] uppercase tracking-widest font-mono font-bold ml-2">
                              ({risk.severity})
                            </span>
                          </p>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            {language === "ro" ? risk.descRo : risk.descEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-8 rounded-3xl ${designSystem.glass} border border-zinc-900 text-center space-y-4 py-16`}>
              <Sparkles className="h-8 w-8 text-zinc-700 mx-auto" />
              <p className="text-sm text-zinc-400">
                {language === "ro"
                  ? "Încarcă un contract pentru a începe analiza cognitivă."
                  : "Upload a document above to initiate risk audit checks."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
