"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Shield,
  FileText,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Send,
  Sparkles,
  BookOpen,
  CheckCircle,
  FileSearch,
  UserCheck,
  Percent,
  FileCheck,
  Building,
  Key,
  Info,
} from "lucide-react";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";

// ─── Legal Topics ────────────────────────────────────────────────────────────
const LEGAL_TOPICS = [
  {
    id: "buying",
    icon: UserCheck,
    title: "Achiziția unei Proprietăți",
    desc: "Cadrul legal general pentru cumpărarea de active rezidențiale sau comerciale în România.",
    content: `Cumpărarea unei proprietăți imobiliare în România implică transferul dreptului de proprietate prin act autentic încheiat în fața unui notar public. 

Aspecte esențiale:
• Cetățenii UE pot dobândi terenuri în aceleași condiții ca cetățenii români. Cetățenii non-UE pot achiziționa construcții, însă achiziția terenului de sub clădire este supusă unor acorduri bilaterale internaționale stricte.
• Înțelegerile precontractuale (Promisiunea bilaterală sau Antecontractul) stabilesc avansul, prețul final, termenul de semnare și penalitățile, fiind recomandată înscrierea (notarea) acestora în Cartea Funciară pentru a preveni vânzarea dublă.`,
  },
  {
    id: "selling",
    icon: Key,
    title: "Vânzarea unei Proprietăți",
    desc: "Reglementări legale, obligațiile vânzătorului și pregătirea dosarului de tranzacție.",
    content: `Vânzătorul are obligația legală de a preda bunul, de a garanta contra evicțiunii (pierderea proprietății în favoarea unui terț) și contra viciilor ascunse ale construcției.

Pentru realizarea tranzacției, vânzătorul trebuie să pună la dispoziție dosarul cadastral complet, certificatul de performanță energetică și adeverințele de utilități la zi. Impozitul pe transferul proprietății este datorat de vânzător și se achită direct la notar în momentul autentificării.`,
  },
  {
    id: "due-diligence",
    icon: FileSearch,
    title: "Due Diligence Juridic",
    desc: "Verificarea istoricului de proprietate, a actelor de proveniență și scanarea riscurilor.",
    content: `Due diligence-ul reprezintă auditul juridic prealabil achiziției. Se analizează lanțul istoric al proprietarilor (minimum 30 de ani) pentru a exclude riscul unor retrocedări în baza Legilor Fondului Funciar (Legea 10/2001) sau litigii de succesiune nerezolvate.

Se verifică corelația dintre destinația imobilului din acte și compartimentarea reală. Orice discrepanță nedeclarată poate duce la imposibilitatea obținerii unei ipoteci bancare sau amenzi pentru modificări neautorizate.`,
  },
  {
    id: "notary",
    icon: FileCheck,
    title: "Procesul Notarial",
    desc: "Rolul notarului public, autentificarea actelor și securizarea transferului de fonduri.",
    content: `În România, autentificarea notarială este obligatorie ad validitatem pentru transferul drepturilor imobiliare. Notarul verifică identitatea părților, capacitatea de exercițiu, actele de proprietate și extrasul de Carte Funciară de autentificare.

Blocarea cărții funciare: Notarul obține un extras de autentificare care blochează cartea funciară pentru 5 zile lucrătoare, împiedicând orice alte înscrieri pe durata finalizării tranzacției. Plata prețului se face de regulă prin virament bancar după semnarea actului autentic.`,
  },
  {
    id: "taxes",
    icon: Percent,
    title: "Taxes & Notary Fees",
    desc: "Calculul onorariilor notariale, taxa ANCPI și impozitul pe venit din transferul imobiliar.",
    content: `Tranzacțiile imobiliare implică costuri administrative clar reglementate de lege:
• Onorariul Notarial: Se calculează regresiv pe tranșe valorice stabilite prin Ordin al Ministrului Justiției. Este suportat, de regulă, de către cumpărător.
• Taxa ANCPI (Intabularea): Reprezintă 0.15% din valoarea proprietății pentru persoane fizice și 0.5% pentru persoane juridice.
• Impozit pe venit imobiliar: Vânzătorul datorează statului un impozit de 1% (pentru proprietăți deținute peste 3 ani) sau 3% (pentru proprietăți deținute sub 3 ani) din suma ce depășește plafonul scutit, dacă este aplicabil conform Codului Fiscal actualizat.`,
  },
  {
    id: "land-registry",
    icon: Building,
    title: "Cartea Funciară (ANCPI)",
    desc: "Funcționarea publicității imobiliare și interpretarea extrasului de informare.",
    content: `Sistemul de publicitate imobiliară din România este gestionat de Agenția Națională de Cadastru și Publicitate Imobiliară (ANCPI). Dreptul de proprietate se dobândește opozabil terților doar prin intabulare în Cartea Funciară.

Extrasul de Carte Funciară conține trei secțiuni:
1. Partea I (Descrierea imobilului): Date despre suprafață, compartimentare, destinație.
2. Partea II (Proprietari): Numele titularului actual, modul de dobândire (vânzare, succesiune, etc.).
3. Partea III (Sarcini): Ipoteci, interdicții de înstrăinare, privilegii sau procese în curs.`,
  },
];

// ─── Document Checklists ──────────────────────────────────────────────────────
const CHECKLISTS = {
  purchase: {
    title: "Documente Necunoscute & Pași Cumpărător",
    items: [
      "Extras de Carte Funciară de informare recent (maximum 3 zile)",
      "Titlul de proprietate al vânzătorului (contract vânzare, donație, etc.)",
      "Certificat de atestare fiscală (ANAF și Taxe Locale)",
      "Certificat de performanță energetică",
      "Adeverință de la asociația de proprietari (dacă e apartament)",
      "Ultimul extras de cont pentru dovada provenienței fondurilor (dacă se cere)",
      "Verificarea schiței cadastrale și releveului fizic",
    ],
  },
  sale: {
    title: "Dosar de Vânzare Complet",
    items: [
      "Actul de dobândire original (intabulat)",
      "Încheierea de intabulare în Cartea Funciară",
      "Documentația cadastrală (schița, releveul)",
      "Certificat fiscal pe zero (valabil 30 de zile)",
      "Certificat energetic clasă A/B",
      "Facturi de utilități achitate la zi",
      "Actele de identitate valabile",
    ],
  },
  rental: {
    title: "Checklist Contract Închiriere (Legea 287/2009)",
    items: [
      "Proces-verbal de predare-primire detaliat (inventar bunuri și foto)",
      "Înregistrarea obligatorie a contractului la ANAF (în 30 de zile)",
      "Stabilirea clauzei de garanție (maximum 3 luni de chirie)",
      "Condițiile exacte de denunțare unilaterală (preaviz 60 de zile)",
      "Definirea clară a cheltuielilor de întreținere și reparații",
      "Clauza de indexare anuală a chiriei în acord cu inflația EUR",
    ],
  },
  due_diligence: {
    title: "Audit Juridic & Scanare Riscuri",
    items: [
      "Verificare litigii active pe rolul instanțelor (portal.just.ro)",
      "Analiza istoricului de proprietate (risc retrocedare Legea 10)",
      "Scanare interdicții de grevare sau înstrăinare active",
      "Verificarea urbanismului și PUG-ului (pentru terenuri/dezvoltări)",
      "Verificarea dreptului de preemțiune al co-proprietarilor sau statului",
      "Cross-check certificat fiscal vânzător — lipsa executărilor silite",
    ],
  },
};

// ─── Suggested AI Questions & Answers ────────────────────────────────────────
interface AIResponse {
  summary: string;
  legalInfo: string;
  steps: string[];
  whenConsult: string;
}

const AI_KNOWLEDGE: Record<string, AIResponse> = {
  "Ce documente trebuie să verific la o proprietate veche?": {
    summary: "Pentru un imobil vechi (construit înainte de 2000), investigarea istoricului actelor și conformitatea releveului sunt primordiale pentru a evita litigii și probleme de creditare.",
    legalInfo: "Trebuie solicitat titlul de proprietate original (adesea contracte de vânzare din perioada comunistă, decizii de împroprietărire sau contracte de construire ICRAL), extrasul de CF de informare actualizat la zi și certificatul fiscal. Un istoric curat presupune că nu există cereri active de retrocedare în baza Legii 10/2001 sau revendicări nesoluționate.",
    steps: [
      "Verificați dacă suprafața reală a proprietății coincide cu cea din schița cadastrală.",
      "Cereți vânzătorului un extras de informare direct de la ANCPI (online).",
      "Verificați dacă imobilul este înscris în listele de risc seismic (clasa I sau II).",
    ],
    whenConsult: "Consultați de urgență un avocat dacă imobilul provine dintr-o donație (poate fi atacată de moștenitorii rezervatari) sau dintr-o succesiune recentă cu moștenitori neimplicați direct în tranzacție.",
  },
  "Care sunt taxele notariale pentru o achiziție de 200.000€?": {
    summary: "Taxele aferente unei achiziții de 200.000€ sunt reglementate strict prin tarifele minime legale de stat, dar pot diferi ușor în funcție de complexitatea tranzacției.",
    legalInfo: "Suportate de cumpărător, taxele aproximative includ: (1) Onorariul notarial minim: ~1.200 - 1.400 EUR (+TVA unde e cazul); (2) Taxa de intabulare ANCPI: 0.15% din preț, adică 300 EUR; (3) Taxa bancară de transfer și extrasul de autentificare: ~50 EUR. Impozitul pe transfer imobiliar (dacă e cazul) revine vânzătorului.",
    steps: [
      "Solicitați un deviz detaliat scris din partea cabinetului notarial înainte de semnare.",
      "Asigurați-vă că fondurile pentru taxe sunt depuse în contul notarial prin transfer bancar.",
      "Solicitați intabularea imediată în regim normal sau de urgență după semnare.",
    ],
    whenConsult: "Apelați la un avocat dacă tranzacția implică contractarea unei ipoteci cu clauze speciale, ipoteci de rang secund sau structuri de plată în tranșe.",
  },
  "Cum funcționează verificarea cărții funciare?": {
    summary: "Verificarea Cărții Funciare reprezintă cel mai important filtru juridic. Extrasul de informare indică situația reală a proprietății la momentul eliberării.",
    legalInfo: "Drepturile de proprietate neintabulate nu sunt opozabile terților. Extrasul de informare prezintă în Partea a II-a proprietarii actuali și titlurile lor de proprietate, iar în Partea a III-a (Sarcini) indică prezența ipotecilor bancare, privilegiilor fiscale, proceselor active, urmării silite sau promisiunilor notate.",
    steps: [
      "Descărcați extrasul direct de pe site-ul oficial ANCPI pentru doar 20 RON.",
      "Verificați ca CNP-ul vânzătorului să corespundă cu cel înscris în Partea a II-a.",
      "Asigurați-vă că Partea a III-a este liberă de sarcini sau că sarcinile pot fi radiate la tranzacție.",
    ],
    whenConsult: "Consiliați-vă cu un expert juridic dacă în Partea a III-a există înscrise sechestre asigurătorii în favoarea ANAF, procese de grănițuire sau partaje active.",
  },
  "Ce clauze sunt obligatorii într-un contract de închiriere?": {
    summary: "Pentru siguranță maximă, contractul de închiriere trebuie redactat conform Codului Civil român și înregistrat oficial la ANAF.",
    legalInfo: "Elementele obligatorii includ: identificarea exactă a părților și a imobilului, cuantumul chiriei și termenele de plată, valoarea și condițiile de returnare a garanției, modul de repartizare a costurilor de reparații și întreținere, și clauzele de reziliere unilaterală (preaviz obligatoriu de 60 de zile conform legii).",
    steps: [
      "Înregistrați contractul la ANAF în termen de maximum 30 de zile de la semnare.",
      "Redactați un proces-verbal de predare-primire detaliat, cu starea utilităților și citirile contoarelor.",
      "Introduceți o clauză clară de indexare anuală raportată la indicele inflației europene (HICP).",
    ],
    whenConsult: "Apelați la consultanță juridică dacă închirierea se face pe o perioadă lungă (peste 5 ani) sau dacă este vorba despre spații comerciale/industriale cu amenajări speciale.",
  },
};

export default function LawPage() {
  const [activeTopic, setActiveTopic] = useState("buying");
  const [activeChecklist, setActiveChecklist] = useState<keyof typeof CHECKLISTS>("purchase");
  
  // AI Assistant Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; response?: AIResponse }>>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Lead contact form states
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadBotfield, setLeadBotfield] = useState("");
  const [leadDetails, setLeadDetails] = useState("");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState("");

  const handleRequestLawConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    setLeadLoading(true);
    setLeadError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "RO Law Consultation",
          name: leadName,
          phone: leadPhone,
          email: leadEmail || undefined,
          message: leadDetails,
          source: "law-consult-form",
          page: "/law",
          botfield: leadBotfield || undefined,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to submit lead");
      }
      setLeadSuccess(true);
    } catch (err: any) {
      setLeadError(err.message || "Failed to request consultation.");
    } finally {
      setLeadLoading(false);
    }
  };

  useEffect(() => {
    if (chatMessages.length > 0 || isTyping) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  // Handle send message
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setChatMessages((prev) => [...prev, { sender: "user", text }]);
    setInputVal("");
    setIsTyping(true);

    // Simulate system response after 1s
    setTimeout(() => {
      setIsTyping(false);
      const answer = AI_KNOWLEDGE[text];

      if (answer) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Am identificat informațiile legale relevante în baza de date AiX OS™:",
            response: answer,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Interfața AI Legal Assistant este pregătită pentru integrare. Pentru moment, folosiți întrebările sugerate mai jos pentru a accesa ghidurile juridice structurate.",
          },
        ]);
      }
    }, 800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-20 animate-in">
      
      {/* Educational disclaimer on top */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-3">
        <Info className="h-5 w-5 text-amber-400 shrink-0" />
        <p className="text-xs text-zinc-600">
          <strong>Declinare de responsabilitate:</strong> Acest material are scop pur educațional și informativ și nu constituie consultanță juridică. Pentru asistență juridică personalizată, vă rugăm să consultați un avocat înregistrat în Barou.
        </p>
      </div>

      <PageHeader
        badge="Legal & Compliance Desk"
        title="RO Law in Real Estate"
        subtitle="Cadrul legal, procedurile notariale, taxarea proprietăților și due diligence juridic complet pentru tranzacții sigure în România."
      />

      {/* Grid: Topics & Document Checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Topics list (1/3) */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-zinc-550 font-semibold mb-2">Ghiduri Juridice</h3>
          {LEGAL_TOPICS.map((topic) => {
            const Icon = topic.icon;
            const active = activeTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                  active
                    ? "border-amber-500/40 bg-zinc-50/60 text-zinc-900"
                    : "border-zinc-200 bg-white/40 text-zinc-400 hover:border-zinc-300"
                }`}
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-xl border shrink-0 ${active ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-zinc-50/50 border-zinc-200 text-zinc-400"}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900 leading-tight">{topic.title}</h4>
                    <p className="text-[10.5px] text-zinc-400 leading-tight mt-1">{topic.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Middle Column: Active Topic Content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} relative overflow-hidden min-h-[350px] flex flex-col justify-between`}>
            <div className={designSystem.glowTop} />
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <BookOpen className="h-4 w-4" />
                <span className="text-[10px] uppercase tracking-widest font-mono font-semibold">Informații Detaliate</span>
              </div>
              
              <h2 className="text-lg font-semibold text-zinc-900">
                {LEGAL_TOPICS.find((t) => t.id === activeTopic)?.title}
              </h2>
              
              <div className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">
                {LEGAL_TOPICS.find((t) => t.id === activeTopic)?.content}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200/60 mt-8 flex justify-between items-center">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-contact-popup"))}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                Consultă un specialist legal
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <span className="text-[9.5px] font-mono text-zinc-600">AiX OS™ Legal Compliance</span>
            </div>
          </div>
        </div>

      </div>

      {/* Checklists Tabs Section */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Proceduri & Dosare</span>
          <h2 className="text-2xl font-light text-zinc-900 mt-1">Checklist-uri Documente Imobiliare</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="space-y-2 lg:border-r lg:border-zinc-200 lg:pr-6">
            {[
              { id: "purchase", label: "Cumpărător" },
              { id: "sale", label: "Vânzător" },
              { id: "rental", label: "Închiriere" },
              { id: "due_diligence", label: "Due Diligence" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChecklist(tab.id as keyof typeof CHECKLISTS)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeChecklist === tab.id
                    ? "bg-zinc-50 text-amber-400 border border-zinc-200"
                    : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Checklist Content */}
          <div className="lg:col-span-3">
            <div className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} space-y-6`}>
              <h3 className="text-sm font-semibold text-zinc-900">
                {CHECKLISTS[activeChecklist].title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHECKLISTS[activeChecklist].items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200 bg-white/40">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-zinc-600 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* AI Legal Assistant Interface */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 pb-5">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Interactive Assistant</span>
          <h2 className="text-2xl font-light text-zinc-900 mt-1">AI Legal Assistant</h2>
          <p className="text-xs text-zinc-400 mt-1">Sistem securizat de analiză a documentelor imobiliare și recomandări procedurale conform codului civil român.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Suggested Questions (1/3) */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-zinc-550 font-semibold mb-2">Întrebări Frecvente</h4>
            {Object.keys(AI_KNOWLEDGE).map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="w-full text-left p-3.5 rounded-2xl border border-zinc-200 bg-white/40 hover:border-zinc-300 hover:bg-zinc-100/20 text-xs text-zinc-600 hover:text-zinc-900 transition-all leading-relaxed"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Conversation & Structured Output Window (2/3) */}
          <div className="lg:col-span-2 flex flex-col h-[550px] rounded-3xl border border-zinc-200 bg-white/90 overflow-hidden relative shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500/40 via-amber-300/10 to-transparent z-10" />

            {/* Chat header */}
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-white/60">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Scale className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-900">AiX Legal Advisor</h4>
                  <p className="text-[9px] text-emerald-400 font-mono uppercase tracking-widest">Active & Online</p>
                </div>
              </div>
              <span className="text-[9px] text-zinc-600 font-mono">BETA v1.2</span>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-650">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-900">Cum vă pot ajuta astăzi?</p>
                    <p className="text-[11px] text-zinc-400 max-w-sm">
                      Selectați una dintre întrebările frecvente din stânga sau puneți o întrebare legală proprie legată de tranzacțiile din România.
                    </p>
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col space-y-2 ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-amber-500 text-black font-medium"
                          : "bg-zinc-50 border border-zinc-200 text-zinc-200"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Render Structured Legal Answer Layout if present */}
                    {msg.response && (
                      <div className="w-full max-w-[95%] rounded-2xl border border-zinc-200 bg-white/80 p-5 mt-2 space-y-4 animate-in fade-in duration-300">
                        
                        {/* 1. Summary */}
                        <div className="space-y-1">
                          <h5 className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-semibold">1. Rezumat Explicație</h5>
                          <p className="text-xs text-zinc-600 leading-relaxed font-light">{msg.response.summary}</p>
                        </div>

                        {/* 2. Relevant Legal Info */}
                        <div className="space-y-1">
                          <h5 className="text-[10px] uppercase tracking-widest font-mono text-zinc-400 font-semibold">2. Cadru Legal Relevant</h5>
                          <p className="text-xs text-zinc-400 leading-relaxed">{msg.response.legalInfo}</p>
                        </div>

                        {/* 3. Steps */}
                        <div className="space-y-1">
                          <h5 className="text-[10px] uppercase tracking-widest font-mono text-zinc-400 font-semibold">3. Pași Următori Recomandați</h5>
                          <ul className="space-y-1.5 pt-1">
                            {msg.response.steps.map((st, sidx) => (
                              <li key={sidx} className="flex items-start gap-2 text-xs text-zinc-450">
                                <span className="text-amber-500 font-mono shrink-0">[{sidx + 1}]</span>
                                <span className="leading-normal">{st}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 4. When to consult */}
                        <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-3 flex items-start gap-2.5">
                          <AlertTriangle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <h6 className="text-[10px] uppercase tracking-wider font-mono text-red-400 font-bold">Când să apelați la un avocat?</h6>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">{msg.response.whenConsult}</p>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs pl-2">
                  <Sparkles className="h-3.5 w-3.5 animate-spin text-amber-500" />
                  <span>Se procesează consultarea...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-zinc-200 bg-white/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputVal);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Scrieți o întrebare legală (ex: Cum intabulez proprietatea?)..."
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="rounded-xl bg-amber-500 text-black px-4 py-2.5 hover:bg-amber-400 transition-all flex items-center justify-center disabled:opacity-40 disabled:hover:bg-amber-500 shrink-0 active:scale-95"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Lawyer Consultation Card */}
      <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6 text-left">
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-semibold">Specialist Representation</span>
            <h2 className="text-3xl md:text-4xl font-light text-zinc-900 leading-tight">
              Solicită Consultanță Juridică Avocat
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
              Aveți o speță complexă? Completează formularul alăturat pentru a primi asistență de la un avocat partener specializat în drept imobiliar și fiscal.
            </p>
          </div>
          <div className="md:col-span-5 bg-white/45 p-6 rounded-3xl border border-zinc-200">
            {leadSuccess ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center space-y-2 animate-in fade-in duration-300">
                <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-zinc-900">Solicitare Trimisă cu Succes!</h4>
                <p className="text-xs text-zinc-400">Avocatul partener vă va contacta în cel mai scurt timp.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestLawConsult} className="space-y-4">
                {/* Honeypot Spam Protection */}
                <input
                  type="text"
                  name="botfield"
                  value={leadBotfield}
                  onChange={(e) => setLeadBotfield(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                {leadError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-red-400 text-xs">
                    {leadError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Nume"
                    className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none"
                  />
                  <input
                    required
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="Telefon"
                    className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none"
                  />
                </div>
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="E-mail (opțional)"
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none"
                />
                <textarea
                  required
                  value={leadDetails}
                  onChange={(e) => setLeadDetails(e.target.value)}
                  placeholder="Descrieți speța juridică pe scurt..."
                  rows={3}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-650 focus:border-amber-500/50 focus:outline-none resize-none"
                />
                <p className="text-[10px] text-zinc-500 leading-normal text-left">
                  Prin trimiterea acestui formular, confirmați că ați citit și sunteți de acord cu{" "}
                  <Link href="/privacy" className="text-amber-500 hover:underline font-semibold">
                    Politica de Confidențialitate & Notificarea GDPR AiX OS™
                  </Link>{" "}
                  și vă exprimați acordul pentru a fi contactat în legătură cu solicitarea dvs.
                </p>
                <button
                  type="submit"
                  disabled={leadLoading}
                  className="w-full rounded-full bg-amber-500/90 text-black py-3 text-xs font-semibold uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Solicită Consultanță
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Educational disclaimer on bottom */}
      <div className="rounded-2xl border border-zinc-200 bg-white/40 p-4 text-center">
        <p className="text-[10px] text-zinc-600 leading-normal uppercase tracking-wider">
          Declinare legală obligatorie: Acest material are scop exclusiv educațional și informativ și nu constituie sfat juridic, fiscal sau consultanță imobiliară.
        </p>
      </div>

    </div>
  );
}
