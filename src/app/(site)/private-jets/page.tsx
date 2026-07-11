"use client";

import { useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/ui";
import {
  Plane,
  Calendar,
  Users,
  Search,
  Navigation,
  MapPin,
  ArrowRight,
  ChevronRight,
  Shield,
  Ticket,
  Coffee,
  Sparkles,
} from "lucide-react";

// Mock fleet data
const FLEET = [
  {
    id: "light",
    name: "Phenom 300E",
    class: "Light Jet",
    pax: 6,
    range: "3,723 km",
    speed: "833 km/h",
    hourlyRate: "€4,200",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=600&q=80",
    description: "Cel mai popular și de încredere avion privat ușor din lume, perfect pentru zboruri europene rapide.",
  },
  {
    id: "midsize",
    name: "Challenger 350",
    class: "Super-Midsize Jet",
    pax: 9,
    range: "5,926 km",
    speed: "850 km/h",
    hourlyRate: "€6,800",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
    description: "Cabină spațioasă cu podea plată și performanțe remarcabile pe piste scurte. Ideal pentru zboruri continentale.",
  },
  {
    id: "heavy",
    name: "Gulfstream G650ER",
    class: "Ultra-Long-Range Jet",
    pax: 16,
    range: "13,890 km",
    speed: "956 km/h",
    hourlyRate: "€11,500",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=600&q=80",
    description: "Reperul suprem al aviației private globale. Zboruri transoceanice non-stop în condiții de lux absolut.",
  },
];

// Mock flight numbers data for lookup
const MOCK_FLIGHTS: Record<
  string,
  {
    flightNum: string;
    aircraft: string;
    origin: string;
    destination: string;
    status: string;
    departureTime: string;
    arrivalTime: string;
    progress: number;
    altitude: string;
    speed: string;
    duration: string;
  }
> = {
  AJX902: {
    flightNum: "AJX902",
    aircraft: "Gulfstream G650ER (N650AX)",
    origin: "Bucharest Baneasa (BBU)",
    destination: "Nice Cote d'Azur (NCE)",
    status: "În Zbor",
    departureTime: "10:15 EET",
    arrivalTime: "11:55 CET",
    progress: 68,
    altitude: "41,000 ft",
    speed: "910 km/h",
    duration: "2h 40m",
  },
  AJX110: {
    flightNum: "AJX110",
    aircraft: "Challenger 350 (D-CHAL)",
    origin: "London Farnborough (FAB)",
    destination: "Bucharest Baneasa (BBU)",
    status: "Programat (La Timp)",
    departureTime: "14:30 GMT",
    arrivalTime: "19:40 EET",
    progress: 0,
    altitude: "N/A",
    speed: "N/A",
    duration: "3h 10m",
  },
  AJX770: {
    flightNum: "AJX770",
    aircraft: "Phenom 300E (YR-JSX)",
    origin: "Bucharest Baneasa (BBU)",
    destination: "Dubai Al Maktoum (DWC)",
    status: "Întârziat (Condiții Meteo)",
    departureTime: "16:00 EET (Nou: 16:45)",
    arrivalTime: "22:15 GST",
    progress: 0,
    altitude: "N/A",
    speed: "N/A",
    duration: "5h 15m",
  },
};

// Mock PNR lookup
const MOCK_PNRS: Record<
  string,
  {
    pnr: string;
    client: string;
    route: string;
    aircraft: string;
    catering: string;
    date: string;
    status: string;
    loungeAccess: string;
    upgradeEligible: boolean;
  }
> = {
  AIX79K: {
    pnr: "AIX79K",
    client: "Cristian V.",
    route: "București (BBU) ➔ Monaco (NCE)",
    aircraft: "Phenom 300E",
    catering: "Michelin 3-Star VIP Menu (Seafood & Dom Pérignon)",
    date: "14 Octombrie 2026",
    status: "Confirmat & Plătit",
    loungeAccess: "Băneasa Private Jet Terminal VIP Lounge",
    upgradeEligible: true,
  },
  VIP992: {
    pnr: "VIP992",
    client: "A. Popescu",
    route: "București (BBU) ➔ Dubai (DWC)",
    aircraft: "Gulfstream G650ER",
    catering: "Custom Organic Menu (Halal & Vegan Options)",
    date: "28 Octombrie 2026",
    status: "În Așteptare Autorizare Terminal",
    loungeAccess: "Elite Executive Lounge",
    upgradeEligible: false,
  },
};

export default function PrivateJetsPage() {
  // Booking Form State
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("1-4");
  const [jetClass, setJetClass] = useState("light");

  // Contact details & loading/success states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [botfield, setBotfield] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Flight Tracker State
  const [trackQuery, setTrackQuery] = useState("");
  const [trackedFlight, setTrackedFlight] = useState<typeof MOCK_FLIGHTS[keyof typeof MOCK_FLIGHTS] | null>(null);
  const [trackError, setTrackError] = useState("");

  // PNR Lookup State
  const [pnrQuery, setPnrQuery] = useState("");
  const [pnrResult, setPnrResult] = useState<typeof MOCK_PNRS[keyof typeof MOCK_PNRS] | null>(null);
  const [pnrError, setPnrError] = useState("");

  // Handle Flight Track Action
  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError("");
    setTrackedFlight(null);

    const query = trackQuery.trim().toUpperCase();
    if (!query) return;

    if (MOCK_FLIGHTS[query]) {
      setTrackedFlight(MOCK_FLIGHTS[query]);
    } else {
      setTrackError("Cod zbor invalid. Încercați cu AJX902, AJX110 sau AJX770.");
    }
  };

  // Handle PNR Lookup Action
  const handlePnrLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setPnrError("");
    setPnrResult(null);

    const query = pnrQuery.trim().toUpperCase();
    if (!query) return;

    if (MOCK_PNRS[query]) {
      setPnrResult(MOCK_PNRS[query]);
    } else {
      setPnrError("PNR invalid sau negăsit. Încercați cu AIX79K sau VIP992.");
    }
  };

  // POST request details to unified contact API
  const handleRequestBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date || !name || !phone) {
      setSubmitError("Vă rugăm să completați numele, telefonul, plecarea, sosirea și data.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "Private Jets & Luxury Booking",
          name,
          phone,
          email: email || undefined,
          message: `Charter request details:\nFrom: ${from}\nTo: ${to}\nDate: ${date}\nPassengers: ${pax}\nJet Class: ${jetClass.toUpperCase()}`,
          source: "private-jets-page",
          page: "/private-jets",
          botfield: botfield || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to submit lead");
      }
      setSubmitted(true);

      // Optionally redirect/open WhatsApp as secondary confirmation channel
      const message = `Bună ziua, doresc o ofertă pentru un zbor privat charter:\n\n` +
        `Nume: ${name}\n` +
        `Telefon: ${phone}\n` +
        `De la: ${from}\n` +
        `La: ${to}\n` +
        `Data: ${date}\n` +
        `Număr pasageri: ${pax}\n` +
        `Clasa de aeronavă dorită: ${jetClass.toUpperCase()}\n\n` +
        `Vă rog să mă contactați cu opțiunile disponibile.`;

      const url = `https://wa.me/436509536345?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to request booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge="Luxury Mobility"
        title="Aviație Privată & Charter"
        subtitle="Zboruri la cerere către destinații globale cu flota parteneră AiX. Confort, confidențialitate și eficiență maximă de la terminale dedicate VIP."
      />

      {/* Main Grid: Booking Widget + Fleet Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Flight Booking Request Form */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl shadow-zinc-200/50/40">
          <div className="space-y-1.5 border-b border-zinc-200 pb-4">
            <h2 className="text-xl font-light text-zinc-900 flex items-center gap-2">
              <Plane className="h-5 w-5 text-amber-500" />
              Planifică Zborul
            </h2>
            <p className="text-xs text-zinc-400">
              Completează datele pentru a trimite o solicitare de cotație instantă concierge-ului nostru.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center space-y-4 animate-in fade-in duration-300">
              <Shield className="h-8 w-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-semibold text-zinc-900">Solicitare Trimisă!</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Detalii trimise către sistemul central AiX. Am deschis și fereastra de WhatsApp pentru confirmare directă.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-amber-500 hover:text-amber-400 uppercase tracking-widest"
              >
                Planifică un alt zbor
              </button>
            </div>
          ) : (
            <form onSubmit={handleRequestBooking} className="space-y-4">
              {/* Honeypot Spam Protection */}
              <input
                type="text"
                name="botfield"
                value={botfield}
                onChange={(e) => setBotfield(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {submitError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-red-400 text-xs">
                  {submitError}
                </div>
              )}

              {/* Passenger Personal Details */}
              <div className="space-y-3.5 border-b border-zinc-200 pb-4">
                <p className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Detalii Pasager</p>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nume Complet"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Telefon / WhatsApp"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail (opțional)"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Plecare (Origine)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="București (BBU)"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9 pr-4 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Sosire (Destinație)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Nice (NCE)"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9 pr-4 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Data Zborului</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9 pr-4 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Pasageri</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <select
                      value={pax}
                      onChange={(e) => setPax(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-9 pr-4 text-xs text-zinc-900 focus:border-amber-500 focus:outline-none transition-colors appearance-none"
                    >
                      <option value="1-4">1-4 Pasageri</option>
                      <option value="5-8">5-8 Pasageri</option>
                      <option value="9-12">9-12 Pasageri</option>
                      <option value="13+">13+ Pasageri</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Clasa de Jet Preferată</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "light", label: "Light" },
                    { id: "midsize", label: "Midsize" },
                    { id: "heavy", label: "Heavy / Long" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setJetClass(option.id)}
                      className={`py-2 px-3 text-[11px] font-medium tracking-wide uppercase rounded-xl border transition-all duration-300 ${
                        jetClass === option.id
                          ? "border-amber-500 bg-amber-500/10 text-amber-400"
                          : "border-zinc-200 bg-zinc-50/30 text-zinc-400 hover:border-zinc-300 hover:text-zinc-900"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-amber-500 text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isSubmitting ? "Se trimite solicitarea..." : "Solicită Zbor & Deschide WhatsApp"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-zinc-200/80 flex items-center gap-3 text-zinc-400">
            <Shield className="h-5 w-5 text-amber-500/70 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed">
              Toate zborurile sunt operate de operatori autorizați AOC, conform celor mai stricte reglementări internaționale EASA / FAA.
            </p>
          </div>
        </div>

        {/* Fleet Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-light text-zinc-900">Opțiuni Flotă Recomandate</h2>
            <p className="text-xs text-zinc-400">Pregătită pentru deplasări rapide de afaceri sau vacanțe la standarde ultra-luxury.</p>
          </div>

          <div className="space-y-4">
            {FLEET.map((jet) => (
              <div
                key={jet.id}
                className="group relative rounded-2xl border border-zinc-200 bg-zinc-50/20 p-5 flex flex-col md:flex-row gap-5 hover:border-zinc-300 transition-all duration-300 overflow-hidden"
              >
                {/* Visual Glow */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/5 blur-3xl rounded-full pointer-events-none transition-opacity group-hover:bg-amber-500/10" />

                {/* Jet Image */}
                <div className="relative w-full md:w-48 h-32 md:h-auto rounded-xl overflow-hidden flex-shrink-0 border border-zinc-200 bg-white">
	                  <Image
	                    src={jet.image}
	                    alt={jet.name}
	                    fill
	                    sizes="(max-width: 768px) 100vw, 192px"
	                    className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
	                  />
                  <div className="absolute top-2 left-2 rounded-md bg-[#0c0c0c]/80 border border-zinc-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-400">
                    {jet.class}
                  </div>
                </div>

                {/* Jet Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-semibold text-zinc-900">{jet.name}</h3>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Estimare Tarif</p>
                        <p className="text-xs font-semibold text-amber-400">{jet.hourlyRate} / oră</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{jet.description}</p>
                  </div>

                  {/* Jet Specs Row */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-zinc-200/80 text-[10px]">
                    <div>
                      <p className="text-zinc-400 uppercase tracking-wider">Pasageri</p>
                      <p className="font-medium text-zinc-900">{jet.pax} Locuri</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 uppercase tracking-wider">Autonomie</p>
                      <p className="font-medium text-zinc-900">{jet.range}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 uppercase tracking-wider">Viteză de croazieră</p>
                      <p className="font-medium text-zinc-900">{jet.speed}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] text-zinc-400">Servicii VIP Premium Incluse</span>
                    <a
                      href={`https://wa.me/436509536345?text=${encodeURIComponent(`Bună ziua, doresc o ofertă de charter pentru aeronava ${jet.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-500 font-semibold flex items-center gap-1 hover:text-amber-400 transition-colors"
                    >
                      Solicită Oferta Curentă
                      <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Interactive Widgets Grid: Flight Tracker & PNR Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Widget 1: Flight Tracker Lookup */}
        <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-lg font-light text-zinc-900 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-amber-500" />
              Flight Status Lookup
            </h3>
            <p className="text-xs text-zinc-400">
              Introduceți codul zborului privat pentru a vedea date GPS în timp real sau programul.
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. AJX902, AJX110"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/30 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="rounded-xl bg-zinc-100 hover:bg-zinc-700 border border-zinc-300 text-zinc-900 px-5 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Search className="h-4 w-4" />
              Caută
            </button>
          </form>

          {trackError && <p className="text-xs text-red-400">{trackError}</p>}

          {/* Track Result Display */}
          {trackedFlight ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-5 space-y-4 animate-in">
              <div className="flex justify-between items-center border-b border-zinc-200/80 pb-3">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Aeronava</p>
                  <p className="text-xs font-semibold text-zinc-900">{trackedFlight.aircraft}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider ${
                    trackedFlight.status === "În Zbor"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {trackedFlight.status}
                  </span>
                </div>
              </div>

              {/* Progress Tracker Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-zinc-900">{trackedFlight.origin}</p>
                    <p className="text-[10px] text-zinc-400">Plecare: {trackedFlight.departureTime}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 text-right">{trackedFlight.destination}</p>
                    <p className="text-[10px] text-zinc-400 text-right">Sosire: {trackedFlight.arrivalTime}</p>
                  </div>
                </div>

                {trackedFlight.progress > 0 && (
                  <div className="space-y-1">
                    <div className="w-full bg-zinc-100 rounded-full h-1.5 relative overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${trackedFlight.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400">
                      <span>Progres Zbor: {trackedFlight.progress}%</span>
                      <span>Timp Estimator: {trackedFlight.duration}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic stats */}
              {trackedFlight.progress > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-200/80 text-[10px]">
                  <div>
                    <span className="text-zinc-400 uppercase tracking-wider block">Altitudine</span>
                    <span className="font-medium text-zinc-900">{trackedFlight.altitude}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 uppercase tracking-wider block">Viteză Sol (Ground)</span>
                    <span className="font-medium text-zinc-900">{trackedFlight.speed}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200/40 bg-zinc-50/5 p-8 text-center text-zinc-400 text-xs">
              Introduceți codul unui zbor partener pentru urmărire geografică simulată.
            </div>
          )}
        </div>

        {/* Widget 2: PNR Ticket Check */}
        <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-lg font-light text-zinc-900 flex items-center gap-2">
              <Ticket className="h-5 w-5 text-amber-500" />
              Verifică Rezervare (PNR)
            </h3>
            <p className="text-xs text-zinc-400">
              Interogați baza de date securizată AiX pentru detalii VIP lounge, catering și upgrade status.
            </p>
          </div>

          <form onSubmit={handlePnrLookup} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. AIX79K, VIP992"
              value={pnrQuery}
              onChange={(e) => setPnrQuery(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/30 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="rounded-xl bg-zinc-100 hover:bg-zinc-700 border border-zinc-300 text-zinc-900 px-5 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Search className="h-4 w-4" />
              Verifică
            </button>
          </form>

          {pnrError && <p className="text-xs text-red-400">{pnrError}</p>}

          {/* PNR Result Display */}
          {pnrResult ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-5 space-y-4 animate-in">
              <div className="flex justify-between items-center border-b border-zinc-200/80 pb-3">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Client Elitist</p>
                  <p className="text-xs font-semibold text-zinc-900">{pnrResult.client}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {pnrResult.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-200/50">
                  <span className="text-zinc-400">Ruta:</span>
                  <span className="font-medium text-zinc-900">{pnrResult.route}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/50">
                  <span className="text-zinc-400">Data Plecării:</span>
                  <span className="font-medium text-zinc-900">{pnrResult.date}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/50">
                  <span className="text-zinc-400">Tip Aeronava:</span>
                  <span className="font-medium text-zinc-900">{pnrResult.aircraft}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/50">
                  <span className="text-zinc-400">VIP Terminal Lounge:</span>
                  <span className="font-medium text-zinc-900 text-right">{pnrResult.loungeAccess}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Catering Preferențial:</span>
                  <span className="font-medium text-amber-400 flex items-center gap-1">
                    <Coffee className="h-3 w-3" />
                    {pnrResult.catering}
                  </span>
                </div>
              </div>

              {pnrResult.upgradeEligible && (
                <div className="mt-2 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span className="text-[11px] text-amber-400 font-medium">Eligibil pentru upgrade cabină (gratuit)</span>
                  </div>
                  <a
                    href="https://wa.me/436509536345?text=Doresc%20sa%20solicit%20upgrade-ul%20pentru%20rezervarea%20PNR%20AIX79K"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-amber-500 text-black px-3 py-1 text-[10px] font-semibold uppercase hover:bg-amber-400 transition-all"
                  >
                    Aplică
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200/40 bg-zinc-50/5 p-8 text-center text-zinc-400 text-xs">
              Introduceți PNR-ul rezervării dvs. primit de la departamentul comercial pentru check-in digital.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Features Banner */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/20 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-light text-zinc-900 text-center">Standardele Aviației Exclusive AiX</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Timp Minim de Alertare",
              desc: "Aeronavele pot decola în doar 2 ore de la confirmarea fermă a contractului și efectuarea plății securizate.",
            },
            {
              title: "Eficiență Terminale VIP",
              desc: "Acces direct la zbor prin terminale private FBO, reducând timpul de check-in la doar 15 minute.",
            },
            {
              title: "Siguranță & Confidențialitate",
              desc: "Echipaje premium cu mii de ore de zbor și protocoale stricte de discreție absolută pentru fiecare pasager.",
            },
          ].map((feature, idx) => (
            <div key={idx} className="space-y-2 text-center md:text-left">
              <h4 className="text-sm font-semibold text-zinc-900">{feature.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
