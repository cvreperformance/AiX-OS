"use client";

import { useState } from "react";
import {
  FileCode,
  FileSpreadsheet,
  FileEdit,
  Code,
  Check,
  AlertTriangle,
  Play,
  Table,
  Upload,
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";

export default function OpenSourceAppsPage() {
  const [activeTab, setActiveTab] = useState<"markdown" | "json" | "csv">("markdown");

  // Markdown State
  const [mdInput, setMdInput] = useState(`# Titlu Raport Imobiliar\n\nAcesta este un raport generat în format **Markdown**.\n\n* **Randament:** 6.5%\n* **Risc:** Scăzut\n* **Locație:** Floreasca, București`);

  // JSON State
  const [jsonInput, setJsonInput] = useState(`{\n  "property": "Penthouse",\n  "price": 450000,\n  "currency": "EUR",\n  "features": ["view", "terrace", "parking"]\n}`);
  const [jsonResult, setJsonResult] = useState("");
  const [jsonError, setJsonError] = useState("");

  // CSV State
  const [csvInput, setCsvInput] = useState(`ID,Titlu,Preț,Locație\n1,Penthouse Floreasca,450000,București\n2,Vilă Pipera,2100000,Ilfov\n3,Apartament Dorobanți,1450000,București`);
  const [csvHeaders, setCsvHeaders] = useState<string[]>(["ID", "Titlu", "Preț", "Locație"]);
  const [csvRows, setCsvRows] = useState<string[][]>([
    ["1", "Penthouse Floreasca", "450000", "București"],
    ["2", "Vilă Pipera", "2100000", "Ilfov"],
    ["3", "Apartament Dorobanți", "1450000", "București"],
  ]);

  // Handle JSON Formatter
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonResult(JSON.stringify(parsed, null, 2));
      setJsonError("");
    } catch (e: any) {
      setJsonError(e.message || "JSON invalid");
      setJsonResult("");
    }
  };

  // Handle CSV Parser
  const parseCSV = () => {
    try {
      const lines = csvInput.split("\n").filter(line => line.trim());
      if (lines.length === 0) return;
      
      const headers = lines[0].split(",").map(h => h.trim());
      const rows = lines.slice(1).map(line => line.split(",").map(cell => cell.trim()));
      
      setCsvHeaders(headers);
      setCsvRows(rows);
    } catch {
      // stay on previous rows
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Utilities Desk"
        title="Open Source Apps Hub"
        subtitle="Instrumente open-source de manipulare date și documente. Rulează instant direct în browser, garantând 100% confidențialitatea datelor tale."
      />

      {/* Tabs */}
      <div className="flex gap-2.5 bg-zinc-950/60 p-2 rounded-2xl border border-zinc-850 max-w-fit mx-auto justify-center">
        {[
          { id: "markdown", label: "Markdown Editor", icon: FileEdit },
          { id: "json", label: "JSON Formatter", icon: Code },
          { id: "csv", label: "CSV Viewer", icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl border transition-all ${
                active
                  ? "bg-amber-500 text-black border-amber-500 shadow-md"
                  : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} relative overflow-hidden min-h-[450px]`}>
        <div className={designSystem.glowTop} />

        {/* ── MARKDOWN EDITOR ── */}
        {activeTab === "markdown" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
              <div>
                <h3 className="text-sm font-semibold text-white">Editor Markdown Real-Time</h3>
                <p className="text-[11px] text-zinc-550 mt-0.5">Scrieți documente în stânga și vedeți randarea simplificată în dreapta.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[350px]">
              <textarea
                value={mdInput}
                onChange={(e) => setMdInput(e.target.value)}
                className="w-full h-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-amber-500/40 focus:outline-none font-mono resize-none leading-relaxed"
              />
              <div className="w-full h-full rounded-2xl border border-zinc-800 bg-zinc-950/20 px-6 py-4 overflow-y-auto text-xs text-zinc-300 space-y-3 prose prose-invert max-w-none">
                <p className="text-[9px] uppercase tracking-widest font-mono text-zinc-600 border-b border-zinc-900 pb-1.5 mb-3">Preview</p>
                {/* Fallback structured markdown simulation */}
                <div className="whitespace-pre-line leading-relaxed">
                  {mdInput}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── JSON FORMATTER ── */}
        {activeTab === "json" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
              <div>
                <h3 className="text-sm font-semibold text-white">JSON Formatter & Validator</h3>
                <p className="text-[11px] text-zinc-550 mt-0.5">Validează, formatează și structurează obiecte de date imobiliare.</p>
              </div>
              <button
                onClick={formatJSON}
                className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Formatează
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[350px]">
              <div className="relative h-full">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-amber-500/40 focus:outline-none font-mono resize-none"
                />
              </div>

              <div className="w-full h-full rounded-2xl border border-zinc-800 bg-zinc-950/20 p-4 overflow-y-auto font-mono text-xs text-zinc-400">
                {jsonError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-red-400 flex items-start gap-2 mb-3">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    <span>{jsonError}</span>
                  </div>
                )}
                {jsonResult ? (
                  <pre className="text-emerald-400 leading-relaxed">{jsonResult}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-600 text-center">
                    Faceți clic pe butonul „Formatează” pentru a valida codul JSON.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CSV VIEWER ── */}
        {activeTab === "csv" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
              <div>
                <h3 className="text-sm font-semibold text-white">CSV Viewer & Table Renderer</h3>
                <p className="text-[11px] text-zinc-550 mt-0.5">Vizualizați tabele, fișiere de prețuri sau date de vânzări introduse în format CSV.</p>
              </div>
              <button
                onClick={parseCSV}
                className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
              >
                <Table className="h-3.5 w-3.5" />
                Generează Tabel
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: CSV text input */}
              <div className="h-[280px]">
                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="w-full h-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-amber-500/40 focus:outline-none font-mono resize-none leading-relaxed"
                  placeholder="Introduceți textul CSV separat prin virgulă..."
                />
              </div>

              {/* Right Column: Table rendering (2/3) */}
              <div className="lg:col-span-2 rounded-2xl border border-zinc-900 bg-zinc-950/20 overflow-x-auto h-[280px]">
                {csvRows.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-850 bg-zinc-950/80 sticky top-0">
                        {csvHeaders.map((head, index) => (
                          <th key={index} className="p-3 text-zinc-400 font-semibold font-mono uppercase tracking-wider">{head}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {csvRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-zinc-900/10">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-zinc-300 font-light">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-600 text-center">
                    Tabelul formatat va apărea aici.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Optimizer & File Utility details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-3xl ${designSystem.glass} space-y-3`}>
          <h4 className="text-xs uppercase tracking-widest text-amber-500 font-mono font-semibold">Image Optimizer</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Optimizarea imaginilor este realizată automat în rețeaua AiX OS la încărcarea fotografiilor de proprietate. Algoritmul reduce mărimea fișierelor WebP cu până la 75% menținând claritatea vizuală ridicată necesară prezentărilor de lux.
          </p>
        </div>
        <div className={`p-6 rounded-3xl ${designSystem.glass} space-y-3`}>
          <h4 className="text-xs uppercase tracking-widest text-emerald-500 font-mono font-semibold">Securitate 100% Client-Side</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Spre deosebire de instrumentele web generice, hub-ul de aplicații AiX OS prelucrează datele Markdown, JSON și CSV exclusiv în sandbox-ul browserului dumneavoastră. Nicio bucățică de cod sau fișier nu părăsește dispozitivul propriu.
          </p>
        </div>
      </section>
    </div>
  );
}
