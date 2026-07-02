"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  Home,
  DollarSign,
  Percent,
  Building2,
  Shield,
  FileText,
  Scale,
  BarChart3,
  Wallet,
} from "lucide-react";

type CalcId =
  | "mortgage"
  | "roi"
  | "rental"
  | "cashflow"
  | "compound"
  | "appreciation"
  | "inflation"
  | "insurance"
  | "notary"
  | "transfer"
  | "monthly"
  | "comparison";

interface CalcMeta {
  id: CalcId;
  label: string;
  icon: React.ElementType;
  desc: string;
  color: string;
}

const CALCULATORS: CalcMeta[] = [
  { id: "mortgage", label: "Ipotecă", icon: Home, desc: "Rata lunară, dobândă totală, cost total credit", color: "text-amber-400" },
  { id: "roi", label: "ROI Imobiliar", icon: TrendingUp, desc: "Return on investment, cash-on-cash, cap rate", color: "text-emerald-400" },
  { id: "rental", label: "Yield Chirie", icon: Percent, desc: "Randament brut și net din chirii", color: "text-blue-400" },
  { id: "cashflow", label: "Cash Flow", icon: DollarSign, desc: "Flux de numerar lunar și anual", color: "text-purple-400" },
  { id: "compound", label: "Dobândă Compusă", icon: BarChart3, desc: "Creșterea capitalului prin reinvestire", color: "text-cyan-400" },
  { id: "appreciation", label: "Apreciere", icon: Building2, desc: "Valoarea viitoare a proprietății", color: "text-orange-400" },
  { id: "inflation", label: "Inflație", icon: Scale, desc: "Puterea de cumpărare în timp", color: "text-red-400" },
  { id: "insurance", label: "Asigurare", icon: Shield, desc: "Prima estimată pentru asigurare locuință", color: "text-teal-400" },
  { id: "notary", label: "Taxe Notariale", icon: FileText, desc: "Onorariu notar pentru tranzacție", color: "text-yellow-400" },
  { id: "transfer", label: "Taxă Transfer", icon: Wallet, desc: "Taxa de transfer proprietate în România", color: "text-pink-400" },
  { id: "monthly", label: "Cost Lunar", icon: Calculator, desc: "Toate costurile lunare de deținere", color: "text-violet-400" },
  { id: "comparison", label: "Comparare", icon: BarChart3, desc: "Imobiliar vs depozit vs bursă", color: "text-amber-400" },
];

function InputField({ label, value, onChange, suffix, prefix, step = "1", min = "0" }: {
  label: string; value: string; onChange: (v: string) => void; suffix?: string; prefix?: string; step?: string; min?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs uppercase tracking-wider text-zinc-500">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">{prefix}</span>}
        <input
          type="number" value={value} min={min} step={step}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 text-sm text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-colors ${prefix ? "pl-8 pr-3" : "px-3"} ${suffix ? "pr-12" : ""}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-zinc-800 last:border-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-amber-400" : "text-white"}`}>{value}</span>
    </div>
  );
}

function fmt(n: number, currency = "EUR"): string {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}
function fmtPct(n: number): string {
  if (!isFinite(n)) return "—";
  return n.toFixed(2) + "%";
}

function MortgageCalc() {
  const [price, setPrice] = useState("300000");
  const [down, setDown] = useState("30");
  const [rate, setRate] = useState("6.9");
  const [years, setYears] = useState("25");
  const principal = Number(price) * (1 - Number(down) / 100);
  const r = Number(rate) / 100 / 12;
  const n = Number(years) * 12;
  const monthly = r > 0 ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : principal / n;
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - principal;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Prețul proprietății (EUR)" value={price} onChange={setPrice} prefix="€" />
        <InputField label="Avans (%)" value={down} onChange={setDown} suffix="%" step="1" />
        <InputField label="Dobândă anuală (%)" value={rate} onChange={setRate} suffix="%" step="0.1" />
        <InputField label="Durata (ani)" value={years} onChange={setYears} suffix="ani" />
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Rezultate</p>
        <ResultRow label="Suma finanțată" value={fmt(principal)} />
        <ResultRow label="Avans" value={fmt(Number(price) * Number(down) / 100)} />
        <ResultRow label="Rată lunară" value={fmt(monthly)} highlight />
        <ResultRow label="Total dobânzi" value={fmt(totalInterest)} />
        <ResultRow label="Total de plătit" value={fmt(totalPaid)} />
      </div>
    </div>
  );
}

function ROICalc() {
  const [purchasePrice, setPurchasePrice] = useState("200000");
  const [costs, setCosts] = useState("10000");
  const [rent, setRent] = useState("900");
  const [expenses, setExpenses] = useState("200");
  const [appreciation, setAppreciation] = useState("5");
  const [years, setYears] = useState("5");
  const totalInvested = Number(purchasePrice) + Number(costs);
  const annualNOI = (Number(rent) - Number(expenses)) * 12;
  const capRate = (annualNOI / totalInvested) * 100;
  const futureValue = totalInvested * Math.pow(1 + Number(appreciation) / 100, Number(years));
  const appreciation_gain = futureValue - totalInvested;
  const totalReturn = annualNOI * Number(years) + appreciation_gain;
  const totalROI = (totalReturn / totalInvested) * 100;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Preț achiziție (EUR)" value={purchasePrice} onChange={setPurchasePrice} prefix="€" />
        <InputField label="Costuri adiționale" value={costs} onChange={setCosts} prefix="€" />
        <InputField label="Chirie lunară (EUR)" value={rent} onChange={setRent} prefix="€" />
        <InputField label="Cheltuieli lunare" value={expenses} onChange={setExpenses} prefix="€" />
        <InputField label="Apreciere anuală (%)" value={appreciation} onChange={setAppreciation} suffix="%" step="0.5" />
        <InputField label="Orizont (ani)" value={years} onChange={setYears} suffix="ani" />
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Rezultate</p>
        <ResultRow label="Total investit" value={fmt(totalInvested)} />
        <ResultRow label="NOI anual" value={fmt(annualNOI)} />
        <ResultRow label="Cap Rate" value={fmtPct(capRate)} highlight />
        <ResultRow label={`Valoare la ${years} ani`} value={fmt(futureValue)} />
        <ResultRow label={`ROI total la ${years} ani`} value={fmtPct(totalROI)} highlight />
      </div>
    </div>
  );
}

function RentalYieldCalc() {
  const [price, setPrice] = useState("150000");
  const [rent, setRent] = useState("700");
  const [costs, setCosts] = useState("100");
  const [tax, setTax] = useState("10");
  const grossYield = (Number(rent) * 12 / Number(price)) * 100;
  const netRent = Number(rent) - Number(costs) - (Number(rent) * Number(tax) / 100);
  const netYield = (netRent * 12 / Number(price)) * 100;
  const paybackYears = netRent > 0 ? Number(price) / (netRent * 12) : Infinity;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Prețul proprietății (EUR)" value={price} onChange={setPrice} prefix="€" />
        <InputField label="Chirie lunară brută (EUR)" value={rent} onChange={setRent} prefix="€" />
        <InputField label="Cheltuieli lunare" value={costs} onChange={setCosts} prefix="€" />
        <InputField label="Impozit pe venit (%)" value={tax} onChange={setTax} suffix="%" />
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Rezultate</p>
        <ResultRow label="Chirie anuală brută" value={fmt(Number(rent) * 12)} />
        <ResultRow label="Yield brut" value={fmtPct(grossYield)} highlight />
        <ResultRow label="Chirie netă lunară" value={fmt(netRent)} />
        <ResultRow label="Yield net" value={fmtPct(netYield)} highlight />
        <ResultRow label="Payback period" value={isFinite(paybackYears) ? `${paybackYears.toFixed(1)} ani` : "—"} />
      </div>
    </div>
  );
}

function CashflowCalc() {
  const [rent, setRent] = useState("900");
  const [mortgage, setMortgage] = useState("650");
  const [tax, setTax] = useState("80");
  const [insurance, setInsurance] = useState("30");
  const [management, setManagement] = useState("50");
  const [maintenance, setMaintenance] = useState("50");
  const monthlyIncome = Number(rent);
  const monthlyExpenses = Number(mortgage) + Number(tax) + Number(insurance) + Number(management) + Number(maintenance);
  const monthlyCF = monthlyIncome - monthlyExpenses;
  const annualCF = monthlyCF * 12;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Chirie lunară (EUR)" value={rent} onChange={setRent} prefix="€" />
        <InputField label="Rată ipotecă" value={mortgage} onChange={setMortgage} prefix="€" />
        <InputField label="Taxe și impozite" value={tax} onChange={setTax} prefix="€" />
        <InputField label="Asigurare" value={insurance} onChange={setInsurance} prefix="€" />
        <InputField label="Administrare" value={management} onChange={setManagement} prefix="€" />
        <InputField label="Întreținere" value={maintenance} onChange={setMaintenance} prefix="€" />
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Rezultate</p>
        <ResultRow label="Venit lunar" value={fmt(monthlyIncome)} />
        <ResultRow label="Cheltuieli lunare" value={fmt(monthlyExpenses)} />
        <ResultRow label="Cash Flow lunar" value={fmt(monthlyCF)} highlight={monthlyCF > 0} />
        <ResultRow label="Cash Flow anual" value={fmt(annualCF)} highlight={annualCF > 0} />
        <div className={`mt-4 rounded-xl p-3 text-center ${monthlyCF >= 0 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
          <p className={`text-sm font-medium ${monthlyCF >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {monthlyCF >= 0 ? "✓ Cash flow pozitiv" : "✗ Cash flow negativ"}
          </p>
        </div>
      </div>
    </div>
  );
}

function CompoundCalc() {
  const [principal, setPrincipal] = useState("50000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [monthly, setMonthly] = useState("500");
  const p = Number(principal); const r = Number(rate) / 100; const n = Number(years); const m = Number(monthly);
  const futureValue = p * Math.pow(1 + r, n) + m * 12 * ((Math.pow(1 + r, n) - 1) / r);
  const totalContributions = p + m * 12 * n;
  const interestEarned = futureValue - totalContributions;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Capital inițial (EUR)" value={principal} onChange={setPrincipal} prefix="€" />
        <InputField label="Randament anual (%)" value={rate} onChange={setRate} suffix="%" step="0.5" />
        <InputField label="Durata (ani)" value={years} onChange={setYears} suffix="ani" />
        <InputField label="Contribuție lunară (EUR)" value={monthly} onChange={setMonthly} prefix="€" />
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Rezultate</p>
        <ResultRow label="Capital inițial" value={fmt(p)} />
        <ResultRow label="Contribuții totale" value={fmt(totalContributions)} />
        <ResultRow label="Dobânzi acumulate" value={fmt(interestEarned)} />
        <ResultRow label={`Valoare la ${years} ani`} value={fmt(futureValue)} highlight />
        <ResultRow label="Multiplicator" value={`${(futureValue / p).toFixed(2)}×`} />
      </div>
    </div>
  );
}

function AppreciationCalc() {
  const [price, setPrice] = useState("200000");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("10");
  const p = Number(price); const r = Number(rate) / 100; const n = Number(years);
  const futureValue = p * Math.pow(1 + r, n);
  const gain = futureValue - p;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Valoarea actuală (EUR)" value={price} onChange={setPrice} prefix="€" />
        <InputField label="Apreciere anuală (%)" value={rate} onChange={setRate} suffix="%" step="0.5" />
        <InputField label="Orizont (ani)" value={years} onChange={setYears} suffix="ani" />
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Proiecție</p>
        <ResultRow label="Valoare actuală" value={fmt(p)} />
        {[3, 5, n].filter((y, i, a) => a.indexOf(y) === i && y > 0).sort((a, b) => a - b).map((y) => (
          <ResultRow key={y} label={`Valoare la ${y} ani`} value={fmt(p * Math.pow(1 + r, y))} highlight={y === n} />
        ))}
        <ResultRow label="Câștig total" value={fmt(gain)} />
        <ResultRow label="ROI total" value={fmtPct((gain / p) * 100)} highlight />
      </div>
    </div>
  );
}

function InflationCalc() {
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");
  const p = Number(amount); const r = Number(rate) / 100; const n = Number(years);
  const purchasingPower = p / Math.pow(1 + r, n);
  const lostValue = p - purchasingPower;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Suma actuală (EUR)" value={amount} onChange={setAmount} prefix="€" />
        <InputField label="Rată inflație anuală (%)" value={rate} onChange={setRate} suffix="%" step="0.5" />
        <InputField label="Orizont (ani)" value={years} onChange={setYears} suffix="ani" />
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Putere de cumpărare</p>
        <ResultRow label="Suma nominală" value={fmt(p)} />
        <ResultRow label={`Valoare reală la ${years} ani`} value={fmt(purchasingPower)} highlight />
        <ResultRow label="Valoare pierdută" value={fmt(lostValue)} />
        <ResultRow label="Devalorizare" value={fmtPct((lostValue / p) * 100)} />
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400/80">
          💡 Capitalul tău trebuie să genereze minim {fmtPct(Number(rate))} anual pentru a-și păstra valoarea.
        </div>
      </div>
    </div>
  );
}

function InsuranceCalc() {
  const [value, setValue] = useState("200000");
  const [sqm, setSqm] = useState("100");
  const [type, setType] = useState<"apartment" | "house">("apartment");
  const v = Number(value); const s = Number(sqm);
  const baseRate = type === "apartment" ? 0.0015 : 0.002;
  const annual = v * baseRate + s * 0.5;
  const monthly = annual / 12;
  const pat = Math.max(20, Math.min(200, v * 0.0001));
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Valoarea proprietății (EUR)" value={value} onChange={setValue} prefix="€" />
        <InputField label="Suprafața (m²)" value={sqm} onChange={setSqm} suffix="m²" />
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-zinc-500">Tipul proprietății</label>
          <div className="flex gap-3">
            {(["apartment", "house"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)}
                className={`flex-1 rounded-xl border py-2.5 text-sm transition-all ${type === t ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-zinc-700 bg-zinc-900 text-zinc-400"}`}>
                {t === "apartment" ? "Apartament" : "Casă/Vilă"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Estimare prime</p>
        <ResultRow label="Asigurare anuală" value={fmt(annual)} highlight />
        <ResultRow label="Asigurare lunară" value={fmt(monthly)} />
        <ResultRow label="PAD obligatoriu anual" value={`€${pat.toFixed(0)}`} />
        <ResultRow label="Total anual estimat" value={fmt(annual + pat)} />
        <Link href="/insurance" className="block mt-4 text-xs text-amber-500/80 hover:text-amber-400">
          → Vezi oferte complete de asigurare
        </Link>
      </div>
    </div>
  );
}

function NotaryCalc() {
  const [price, setPrice] = useState("200000");
  const p = Number(price);
  let notaryFee = 0;
  if (p <= 50000) notaryFee = 500;
  else if (p <= 100000) notaryFee = 500 + (p - 50000) * 0.007;
  else if (p <= 300000) notaryFee = 850 + (p - 100000) * 0.005;
  else notaryFee = 1850 + (p - 300000) * 0.003;
  notaryFee = Math.max(notaryFee, 300);
  const vat = notaryFee * 0.19;
  const total = notaryFee + vat;
  const land_registry = 0.005 * p + 50;
  const cadastral = 120;
  const grandTotal = total + land_registry + cadastral;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Valoarea proprietății (EUR)" value={price} onChange={setPrice} prefix="€" />
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
          Tarifele notariale sunt orientative și bazate pe grila UNNPR. Onorariul real poate varia.
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Taxe estimate</p>
        <ResultRow label="Onorariu notar (fără TVA)" value={fmt(notaryFee)} />
        <ResultRow label="TVA 19%" value={fmt(vat)} />
        <ResultRow label="Onorariu cu TVA" value={fmt(total)} />
        <ResultRow label="Taxă Carte Funciară" value={fmt(land_registry)} />
        <ResultRow label="Taxă cadastrală" value={fmt(cadastral)} />
        <ResultRow label="Total estimat" value={fmt(grandTotal)} highlight />
        <ResultRow label="Procent din preț" value={fmtPct((grandTotal / p) * 100)} />
      </div>
    </div>
  );
}

function TransferTaxCalc() {
  const [price, setPrice] = useState("200000");
  const [isNew, setIsNew] = useState(false);
  const p = Number(price);
  const transferTax = p * 0.03;
  const vatNew = isNew ? (p <= 120000 ? p * 0.05 : p * 0.19) : 0;
  const total = transferTax + vatNew;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Prețul tranzacției (EUR)" value={price} onChange={setPrice} prefix="€" />
        <div className="flex items-center gap-3">
          <input type="checkbox" id="isNew" checked={isNew} onChange={(e) => setIsNew(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-700 bg-zinc-900" />
          <label htmlFor="isNew" className="text-sm text-zinc-300">Proprietate nouă (developer) — aplică TVA</label>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Taxe estimate</p>
        <ResultRow label="Impozit transfer (3%)" value={fmt(transferTax)} />
        {isNew && <ResultRow label={`TVA (${p <= 120000 ? "5%" : "19%"})`} value={fmt(vatNew)} />}
        <ResultRow label="Total taxe" value={fmt(total)} highlight />
        <ResultRow label="Procent din preț" value={fmtPct((total / p) * 100)} />
      </div>
    </div>
  );
}

function MonthlyOwnershipCalc() {
  const [price, setPrice] = useState("250000");
  const [mortgage, setMortgage] = useState("1100");
  const [tax, setTax] = useState("80");
  const [insurance, setInsurance] = useState("50");
  const [utilities, setUtilities] = useState("200");
  const [maintenance, setMaintenance] = useState("100");
  const [parking, setParking] = useState("50");
  const monthly = Number(mortgage) + Number(tax) + Number(insurance) + Number(utilities) + Number(maintenance) + Number(parking);
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <InputField label="Prețul proprietății (EUR)" value={price} onChange={setPrice} prefix="€" />
        <InputField label="Rată ipotecă" value={mortgage} onChange={setMortgage} prefix="€" />
        <InputField label="Impozit local lunar" value={tax} onChange={setTax} prefix="€" />
        <InputField label="Asigurare" value={insurance} onChange={setInsurance} prefix="€" />
        <InputField label="Utilități" value={utilities} onChange={setUtilities} prefix="€" />
        <InputField label="Întreținere/fond" value={maintenance} onChange={setMaintenance} prefix="€" />
        <InputField label="Parcare" value={parking} onChange={setParking} prefix="€" />
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Cost lunar total</p>
        <ResultRow label="Total lunar" value={fmt(monthly)} highlight />
        <ResultRow label="Total anual" value={fmt(monthly * 12)} />
        <ResultRow label="% din valoarea proprietății/an" value={fmtPct((monthly * 12 / Number(price)) * 100)} />
      </div>
    </div>
  );
}

function InvestmentComparisonCalc() {
  const [capital, setCapital] = useState("100000");
  const [years, setYears] = useState("10");
  const [reRate, setReRate] = useState("7");
  const [rentYield, setRentYield] = useState("5");
  const [depositRate, setDepositRate] = useState("4.5");
  const [stockRate, setStockRate] = useState("9");
  const p = Number(capital); const n = Number(years);
  const reValue = p * Math.pow(1 + Number(reRate) / 100, n);
  const rentIncome = p * (Number(rentYield) / 100) * n;
  const reTotalReturn = reValue - p + rentIncome;
  const depositValue = p * Math.pow(1 + Number(depositRate) / 100, n);
  const stockValue = p * Math.pow(1 + Number(stockRate) / 100, n);
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <InputField label="Capital inițial (EUR)" value={capital} onChange={setCapital} prefix="€" />
        <InputField label="Orizont (ani)" value={years} onChange={setYears} suffix="ani" />
        <InputField label="Apreciere imobiliar (%)" value={reRate} onChange={setReRate} suffix="%" step="0.5" />
        <InputField label="Yield chirie (%)" value={rentYield} onChange={setRentYield} suffix="%" step="0.5" />
        <InputField label="Dobândă depozit (%)" value={depositRate} onChange={setDepositRate} suffix="%" step="0.5" />
        <InputField label="Randament bursă (%)" value={stockRate} onChange={setStockRate} suffix="%" step="0.5" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Imobiliar", value: p + reTotalReturn, gain: reTotalReturn, color: "amber" },
          { label: "Depozit bancar", value: depositValue, gain: depositValue - p, color: "blue" },
          { label: "Bursă", value: stockValue, gain: stockValue - p, color: "emerald" },
        ].map((item) => (
          <div key={item.label}
            className={`rounded-2xl border p-5 space-y-3 ${item.color === "amber" ? "border-amber-500/30 bg-amber-500/5" : item.color === "blue" ? "border-blue-500/30 bg-blue-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}>
            <p className="text-sm font-medium text-zinc-300">{item.label}</p>
            <p className={`text-2xl font-light ${item.color === "amber" ? "text-amber-400" : item.color === "blue" ? "text-blue-400" : "text-emerald-400"}`}>
              {fmt(item.value)}
            </p>
            <p className="text-xs text-zinc-500">Câștig: {fmt(item.gain)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const CALC_COMPONENTS: Partial<Record<CalcId, React.ComponentType>> = {
  mortgage: MortgageCalc, roi: ROICalc, rental: RentalYieldCalc, cashflow: CashflowCalc,
  compound: CompoundCalc, appreciation: AppreciationCalc, inflation: InflationCalc,
  insurance: InsuranceCalc, notary: NotaryCalc, transfer: TransferTaxCalc,
  monthly: MonthlyOwnershipCalc, comparison: InvestmentComparisonCalc,
};

export default function CalculatorsClient() {
  const [active, setActive] = useState<CalcId>("mortgage");
  const ActiveCalc = CALC_COMPONENTS[active];
  const activeMeta = CALCULATORS.find((c) => c.id === active)!;
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-amber-500/80">AiX OS Financial Tools</span>
        <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">Calculatoare Imobiliare</h1>
        <p className="text-lg text-zinc-400 max-w-2xl">Instrumente profesionale pentru analiza investițiilor imobiliare, calcul ipotecă și planificare financiară.</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {CALCULATORS.map((calc) => {
          const Icon = calc.icon;
          return (
            <button key={calc.id} type="button" onClick={() => setActive(calc.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all ${active === calc.id ? "border-amber-500/40 bg-amber-500/10" : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"}`}>
              <Icon className={`h-5 w-5 ${active === calc.id ? "text-amber-400" : calc.color}`} />
              <span className={`text-xs leading-tight ${active === calc.id ? "text-amber-400" : "text-zinc-400"}`}>{calc.label}</span>
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-light text-white mb-1">{activeMeta.label}</h2>
          <p className="text-sm text-zinc-500">{activeMeta.desc}</p>
        </div>
        {ActiveCalc ? <ActiveCalc /> : <p className="text-zinc-500">Coming soon</p>}
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 flex gap-4">
        <Scale className="h-5 w-5 text-zinc-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-zinc-500">
          Calculatoarele oferă estimări orientative. Rezultatele nu constituie consultanță financiară sau fiscală.{" "}
          <Link href="/contact" className="text-amber-500/80 hover:text-amber-400 underline">Solicitați consultanță personalizată</Link>.
        </p>
      </div>
    </div>
  );
}
