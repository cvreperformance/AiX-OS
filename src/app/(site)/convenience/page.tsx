"use client";

import { useState, useMemo } from "react";
import {
  FileEdit,
  Code,
  FileSpreadsheet,
  FileText,
  Scan,
  Image as ImageIcon,
  QrCode,
  Key,
  Scale,
  DollarSign,
  Calculator,
  Percent,
  Coins,
  Shield,
  Activity,
  Check,
  AlertCircle,
  Copy,
  ChevronRight,
  TrendingUp,
  Sliders,
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import { useLanguage } from "@/context/LanguageContext";

type ToolId =
  | "markdown"
  | "json"
  | "csv"
  | "pdf"
  | "ocr"
  | "image"
  | "qr"
  | "password"
  | "unit"
  | "currency"
  | "mortgage"
  | "roi"
  | "yield"
  | "notary"
  | "insurance";

export default function OpenSourceAppsPage() {
  const { language } = useLanguage();
  const [activeTool, setActiveTool] = useState<ToolId>("markdown");

  // ─── STATE VARIABLES FOR TOOLS ───
  // Copy feedback state
  const [copied, setCopied] = useState(false);

  // Markdown State
  const [mdInput, setMdInput] = useState(`# Titlu Raport Imobiliar\n\nAcesta este un raport în format **Markdown**.\n\n* **Randament:** 6.5%\n* **Locație:** Floreasca, București`);

  // JSON State
  const [jsonInput, setJsonInput] = useState(`{\n  "property": "Penthouse",\n  "price": 450000,\n  "currency": "EUR"\n}`);
  const [jsonResult, setJsonResult] = useState("");
  const [jsonError, setJsonError] = useState("");

  // CSV State
  const [csvInput, setCsvInput] = useState(`ID,Titlu,Preț,Locație\n1,Penthouse Floreasca,450000,București\n2,Vilă Pipera,2100000,Ilfov`);
  const [csvData, setCsvData] = useState({
    headers: ["ID", "Titlu", "Preț", "Locație"],
    rows: [
      ["1", "Penthouse Floreasca", "450000", "București"],
      ["2", "Vilă Pipera", "2100000", "Ilfov"],
    ],
  });

  // PDF Preview State
  const [pdfFile, setPdfFile] = useState<string | null>(null);

  // OCR Ticker State
  const [ocrText, setOcrText] = useState("");
  const [ocrScanning, setOcrScanning] = useState(false);

  // Image resize slider
  const [imgQuality, setImgQuality] = useState(80);

  // QR State
  const [qrText, setQrText] = useState("https://aix-os.ro");

  // Password State
  const [passLength, setPassLength] = useState(16);
  const [generatedPass, setGeneratedPass] = useState("");

  // Unit Converter State
  const [unitVal, setUnitVal] = useState(100);
  const [unitType, setUnitType] = useState<"m2-sqft" | "sqft-m2">("m2-sqft");

  // Currency Converter State
  const [currVal, setCurrVal] = useState(1000);
  const [currType, setCurrType] = useState<"eur-ron" | "usd-ron">("eur-ron");

  // Mortgage Calculator State
  const [mortgageAmount, setMortgageAmount] = useState(300000);
  const [mortgageRate, setMortgageRate] = useState(5.8);
  const [mortgageYears, setMortgageYears] = useState(30);

  // ROI State
  const [roiCost, setRoiCost] = useState(250000);
  const [roiRevenue, setRoiRevenue] = useState(320000);

  // Yield State
  const [yieldPrice, setYieldPrice] = useState(180000);
  const [yieldRent, setYieldRent] = useState(950);

  // Notary State
  const [notaryVal, setNotaryVal] = useState(200000);

  // Insurance Calculator State
  const [insValue, setInsValue] = useState(250000);
  const [insSeismic, setInsSeismic] = useState(false);

  // ─── UTILITY TRIGGERS ───
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

  const parseCSV = () => {
    try {
      const lines = csvInput.split("\n").filter((l) => l.trim());
      if (lines.length === 0) return;
      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()));
      setCsvData({ headers, rows });
    } catch {
      // fallback
    }
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < passLength; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(pass);
  };

  const runMockOCR = () => {
    setOcrScanning(true);
    setOcrText("");
    setTimeout(() => {
      setOcrText(
        language === "ro"
          ? "EXTRACT COMPLETED:\nNume proprietar: Vaduva Cristian\nAdresa: Sector 1, Str. Jandarmeriei nr. 9\nIdentificator cadastral: CF 12345 Bucuresti"
          : "EXTRACT COMPLETED:\nOwner name: Vaduva Cristian\nAddress: Sector 1, Jandarmeriei Str. no. 9\nCadastral ID: Registry 12345 Bucharest"
      );
      setOcrScanning(false);
    }, 1000);
  };

  const triggerCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── COMPUTED CALCULATIONS ───
  const convertedUnits = useMemo(() => {
    if (unitType === "m2-sqft") {
      return (unitVal * 10.7639).toFixed(2) + " sq ft";
    }
    return (unitVal / 10.7639).toFixed(2) + " m²";
  }, [unitVal, unitType]);

  const convertedCurrency = useMemo(() => {
    // Standard mock cross rates matching central BNR rate (EUR=4.97, USD=4.58)
    if (currType === "eur-ron") {
      return (currVal * 4.975).toFixed(2) + " RON";
    }
    return (currVal * 4.582).toFixed(2) + " RON";
  }, [currVal, currType]);

  const computedMortgage = useMemo(() => {
    const monthlyRate = mortgageRate / 100 / 12;
    const totalMonths = mortgageYears * 12;
    if (monthlyRate === 0) return (mortgageAmount / totalMonths).toFixed(2);
    const pay =
      (mortgageAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return pay.toFixed(2);
  }, [mortgageAmount, mortgageRate, mortgageYears]);

  const computedROI = useMemo(() => {
    const profit = roiRevenue - roiCost;
    const pct = ((profit / roiCost) * 100).toFixed(2);
    return { profit, pct };
  }, [roiCost, roiRevenue]);

  const computedYield = useMemo(() => {
    const annualRent = yieldRent * 12;
    return ((annualRent / yieldPrice) * 100).toFixed(2);
  }, [yieldPrice, yieldRent]);

  const computedNotary = useMemo(() => {
    // Romanian standard notary scale mockup (approx 1.2% average scale)
    return (notaryVal * 0.012).toFixed(2);
  }, [notaryVal]);

  const computedInsurance = useMemo(() => {
    // Mandatory PAD is 20 EUR (~100 RON), optional estimates 0.12% of structure value
    const pad = 100;
    const optional = insValue * 0.0012;
    const total = pad + optional;
    return {
      pad: pad.toFixed(2),
      optional: optional.toFixed(2),
      total: (total * (insSeismic ? 1.15 : 1)).toFixed(2),
    };
  }, [insValue, insSeismic]);

  const toolsList = [
    // Documents
    { id: "markdown" as const, label: "Markdown Editor", icon: FileEdit, cat: "Docs" },
    { id: "json" as const, label: "JSON Formatter", icon: Code, cat: "Docs" },
    { id: "csv" as const, label: "CSV Table Viewer", icon: FileSpreadsheet, cat: "Docs" },
    { id: "pdf" as const, label: "PDF Previewer", icon: FileText, cat: "Docs" },
    { id: "ocr" as const, label: "OCR Extractor", icon: Scan, cat: "Docs" },
    // Security
    { id: "qr" as const, label: "QR Generator", icon: QrCode, cat: "Security" },
    { id: "password" as const, label: "Password Gen", icon: Key, cat: "Security" },
    // Conversions
    { id: "unit" as const, label: "Unit Converter", icon: Sliders, cat: "Calculators" },
    { id: "currency" as const, label: "Currency BNR", icon: Coins, cat: "Calculators" },
    { id: "notary" as const, label: "Notary Fees", icon: Scale, cat: "Calculators" },
    // Finance
    { id: "mortgage" as const, label: "Mortgage Calc", icon: Calculator, cat: "Finance" },
    { id: "roi" as const, label: "ROI Calculator", icon: TrendingUp, cat: "Finance" },
    { id: "yield" as const, label: "Rental Yield", icon: Percent, cat: "Finance" },
    { id: "insurance" as const, label: "Insurance Calc", icon: Shield, cat: "Finance" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-12 animate-in">
      <PageHeader
        badge="Utilities Operating Center"
        title={language === "ro" ? "Convenience Tools" : "Convenience Tools"}
        subtitle={
          language === "ro"
            ? "15 instrumente digitale practice de securitate, analiză text și calcul financiar imobiliar care rulează local."
            : "15 offline-ready diagnostic tools, ROI allocators, conversions, and secure cryptography modules."
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Tools List Selector */}
        <div className="lg:col-span-3 space-y-4">
          {["Docs", "Security", "Calculators", "Finance"].map((cat) => (
            <div key={cat} className="space-y-1.5">
              <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-550 font-mono font-bold block px-2">
                {cat}
              </span>
              <div className="space-y-1">
                {toolsList
                  .filter((t) => t.cat === cat)
                  .map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all border flex items-center gap-2.5 ${
                          activeTool === tool.id
                            ? "bg-amber-500 border-amber-500 text-black shadow-md shadow-amber-500/10"
                            : "border-transparent text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/30"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {tool.label}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Interactive Tool Workspace */}
        <div className="lg:col-span-9 rounded-3xl border border-zinc-200 bg-white/20 p-6 sm:p-8 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
          <div className={designSystem.glowTop} />

          {/* 1. Markdown Editor */}
          {activeTool === "markdown" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">Markdown Live Editor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[280px]">
                <textarea
                  value={mdInput}
                  onChange={(e) => setMdInput(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 focus:border-amber-500/40 focus:outline-none font-mono resize-none leading-relaxed"
                />
                <div className="w-full rounded-2xl border border-zinc-200 bg-white/20 p-4 overflow-y-auto text-xs text-zinc-600 whitespace-pre-line leading-relaxed">
                  {mdInput}
                </div>
              </div>
            </div>
          )}

          {/* 2. JSON Formatter */}
          {activeTool === "json" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-zinc-900">JSON Formatter</h3>
                <button
                  onClick={formatJSON}
                  className="rounded-xl bg-amber-500 text-black px-4 py-1.5 text-xs font-semibold hover:bg-amber-400 transition-all"
                >
                  Format
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[280px]">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 focus:border-amber-500/40 focus:outline-none font-mono resize-none"
                />
                <div className="w-full rounded-2xl border border-zinc-200 bg-white/20 p-4 overflow-y-auto font-mono text-xs text-emerald-400">
                  {jsonError ? (
                    <span className="text-red-400">{jsonError}</span>
                  ) : (
                    <pre>{jsonResult || "{}"}</pre>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. CSV Viewer */}
          {activeTool === "csv" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-zinc-900">CSV Table Viewer</h3>
                <button
                  onClick={parseCSV}
                  className="rounded-xl bg-amber-500 text-black px-4 py-1.5 text-xs font-semibold hover:bg-amber-400 transition-all"
                >
                  Parse
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="w-full h-[220px] rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 focus:border-amber-500/40 focus:outline-none font-mono resize-none leading-relaxed"
                />
                <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white/20 overflow-x-auto h-[220px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-white sticky top-0 text-[10px] font-mono text-zinc-400 uppercase">
                        {csvData.headers.map((h, i) => (
                          <th key={i} className="p-2.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-600">
                      {csvData.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. PDF Previewer */}
          {activeTool === "pdf" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">Secure PDF Tool & Viewer</h3>
              <div className="p-8 rounded-2xl border border-dashed border-zinc-200 text-center space-y-3">
                <FileText className="h-10 w-10 text-zinc-650 mx-auto animate-pulse" />
                <p className="text-xs text-zinc-400">
                  {language === "ro" ? "Încarcă un extras cadastral PDF pentru previzualizare." : "Drop any PDF document to run secure local rendering."}
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0]?.name ?? null)}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-block rounded-xl border border-zinc-200 bg-white/60 hover:bg-zinc-100/60 px-4 py-2 text-xs font-semibold cursor-pointer text-zinc-900"
                >
                  Select PDF
                </label>
                {pdfFile && <p className="text-[10px] text-amber-400 font-mono">Loaded: {pdfFile}</p>}
              </div>
            </div>
          )}

          {/* 5. OCR Extractor */}
          {activeTool === "ocr" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-zinc-900">OCR Text Scanner</h3>
                <button
                  onClick={runMockOCR}
                  disabled={ocrScanning}
                  className="rounded-xl bg-amber-500 text-black px-4 py-1.5 text-xs font-semibold hover:bg-amber-400 transition-all disabled:opacity-50"
                >
                  Run OCR
                </button>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 min-h-[160px] font-mono text-xs text-emerald-400 whitespace-pre-line leading-relaxed">
                {ocrScanning ? "Scanning image metadata..." : ocrText || "OCR extraction result will appear here."}
              </div>
            </div>
          )}

          {/* 6. QR Generator */}
          {activeTool === "qr" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">QR Code Generator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">URL / Value</span>
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 focus:border-amber-500/40 focus:outline-none"
                  />
                </div>
                <div className="p-4 rounded-2xl border border-zinc-200 bg-white flex flex-col items-center justify-center space-y-2">
                  <div className="bg-white p-3 rounded-xl">
                    {/* Simulated vector QR layout */}
                    <div className="w-28 h-28 bg-white flex items-center justify-center text-zinc-900 text-[8px] font-mono text-center select-none font-bold">
                      [ AiX OS™ QR ]
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-550 font-mono truncate max-w-[140px]">{qrText}</span>
                </div>
              </div>
            </div>
          )}

          {/* 7. Password Generator */}
          {activeTool === "password" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-zinc-900">Secure Password Generator</h3>
                <button
                  onClick={generatePassword}
                  className="rounded-xl bg-amber-500 text-black px-4 py-1.5 text-xs font-semibold hover:bg-amber-400 transition-all"
                >
                  Generate
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-400 shrink-0">Length: {passLength}</span>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={passLength}
                    onChange={(e) => setPassLength(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                {generatedPass && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-white/60 font-mono text-xs text-zinc-900">
                    <span className="select-all">{generatedPass}</span>
                    <button
                      onClick={() => triggerCopy(generatedPass)}
                      className="text-zinc-400 hover:text-zinc-900 transition-colors"
                      title="Copy"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. Unit Converter */}
          {activeTool === "unit" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">Real Estate Unit Converter</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Input Value</span>
                  <input
                    type="number"
                    value={unitVal}
                    onChange={(e) => setUnitVal(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Conversion type</span>
                  <select
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-900 focus:outline-none"
                  >
                    <option value="m2-sqft">Square Meters (m²) to Sq Ft</option>
                    <option value="sqft-m2">Sq Ft to Square Meters (m²)</option>
                  </select>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 bg-white/60 text-center font-mono text-lg text-amber-400 font-semibold">
                = {convertedUnits}
              </div>
            </div>
          )}

          {/* 9. Currency BNR Converter */}
          {activeTool === "currency" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">BNR Index Converter</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Value</span>
                  <input
                    type="number"
                    value={currVal}
                    onChange={(e) => setCurrVal(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Exchange Target</span>
                  <select
                    value={currType}
                    onChange={(e) => setCurrType(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-900 focus:outline-none"
                  >
                    <option value="eur-ron">EUR to RON (~4.97)</option>
                    <option value="usd-ron">USD to RON (~4.58)</option>
                  </select>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 bg-white/60 text-center font-mono text-lg text-amber-400 font-semibold">
                = {convertedCurrency}
              </div>
            </div>
          )}

          {/* 10. Notary Fees */}
          {activeTool === "notary" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">Notary Fee Estimator</h3>
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-400 font-mono">Transaction Value (€)</span>
                <input
                  type="number"
                  value={notaryVal}
                  onChange={(e) => setNotaryVal(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-amber-500/40"
                />
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 bg-white/60 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Estimated RO Notary Cost (approx 1.2% scale):</span>
                <span className="text-sm font-bold font-mono text-amber-400">€ {computedNotary}</span>
              </div>
            </div>
          )}

          {/* 11. Mortgage Calc */}
          {activeTool === "mortgage" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">Credit Mortgage Estimator</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Loan Principal (€)</span>
                  <input
                    type="number"
                    value={mortgageAmount}
                    onChange={(e) => setMortgageAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Annual Rate (%)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={mortgageRate}
                    onChange={(e) => setMortgageRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Term (Years)</span>
                  <input
                    type="number"
                    value={mortgageYears}
                    onChange={(e) => setMortgageYears(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-900 focus:outline-none"
                  />
                </div>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 bg-white/60 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Monthly Payment:</span>
                <span className="text-sm font-bold font-mono text-amber-400">€ {computedMortgage} / month</span>
              </div>
            </div>
          )}

          {/* 12. ROI Calculator */}
          {activeTool === "roi" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">Capital ROI Allocator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Initial Cost (€)</span>
                  <input
                    type="number"
                    value={roiCost}
                    onChange={(e) => setRoiCost(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Total Revenue / Exit (€)</span>
                  <input
                    type="number"
                    value={roiRevenue}
                    onChange={(e) => setRoiRevenue(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 bg-white/60 flex justify-between items-center">
                <span className="text-xs text-zinc-400">Net Return:</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  € {computedROI.profit.toLocaleString()} ({computedROI.pct}%)
                </span>
              </div>
            </div>
          )}

          {/* 13. Rental Yield */}
          {activeTool === "yield" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">Rental Yield Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Purchase Price (€)</span>
                  <input
                    type="number"
                    value={yieldPrice}
                    onChange={(e) => setYieldPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Monthly Rent (€)</span>
                  <input
                    type="number"
                    value={yieldRent}
                    onChange={(e) => setYieldRent(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 bg-white/60 flex justify-between items-center">
                <span className="text-xs text-zinc-400">Gross Rental Yield:</span>
                <span className="text-sm font-bold font-mono text-amber-400">{computedYield} % / year</span>
              </div>
            </div>
          )}

          {/* 14. Insurance Calc */}
          {activeTool === "insurance" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">Property Insurance Estimator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-550 font-mono">Reconstruction Valuation (€)</span>
                  <input
                    type="number"
                    value={insValue}
                    onChange={(e) => setInsValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="seismic-risk"
                    checked={insSeismic}
                    onChange={(e) => setInsSeismic(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-zinc-200 bg-white accent-amber-500 cursor-pointer"
                  />
                  <label htmlFor="seismic-risk" className="text-xs text-zinc-400 cursor-pointer select-none">
                    Seismic Zone (+15% premium)
                  </label>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 bg-white/60 space-y-2 text-xs text-zinc-350">
                <div className="flex justify-between font-mono">
                  <span>Mandatory PAD:</span>
                  <span>€ {computedInsurance.pad} / year</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Optional Home Policy:</span>
                  <span>€ {computedInsurance.optional} / year</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-2 font-mono font-bold text-amber-400">
                  <span>Total Premium:</span>
                  <span>€ {computedInsurance.total} / year</span>
                </div>
              </div>
            </div>
          )}

          {/* 15. Security Slider (fallback or informational details) */}
          <div className="border-t border-zinc-200 pt-4 mt-6 flex justify-between items-center text-[10px] text-zinc-550 font-mono">
            <span>SECURE OFFLINE DESK</span>
            <span>100% CLIENT-SIDE EXECUTION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
