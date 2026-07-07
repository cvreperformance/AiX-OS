"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { designSystem } from "@/styles/designSystem";
import { PageHeader } from "@/components/ui";
import { getWordOfDay } from "@/lib/wordOfDay";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Building,
  Key,
  TrendingUp,
  Scale,
  ShieldCheck,
  Cpu,
  Plane,
  Coins,
  Lock,
} from "lucide-react";

export default function LearningPage() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const wordOfDay = getWordOfDay();

  const guides = [
    {
      id: "buying",
      titleRo: "Achiziție Imobiliară (Buying Property)",
      titleEn: "Buying Property",
      icon: Key,
      color: "emerald",
      checklistRo: [
        "Setați un buget clar incluzând marje de reparații și taxe notariale.",
        "Obțineți pre-aprobarea de finanțare bancară înainte de a semna promisiuni.",
        "Verificați istoricul de publicitate imobiliară și extrasul de carte funciară (CF).",
        "Efectuați o inspecție tehnică detaliată a instalațiilor și a structurii clădirii."
      ],
      checklistEn: [
        "Set a clear budget including renovation margins and notary fees.",
        "Secure bank pre-approval before signing any promise of sale.",
        "Verify title registration history and fetch recent land registry records.",
        "Perform a thorough technical inspection of utilities and structural health."
      ],
      mistakesRo: "Graba în a da un avans masiv fără a verifica actele sau a vizita zona noaptea.",
      mistakesEn: "Rushing to wire a deposit without conducting registry searches first.",
      nextStepsRo: "Programează o discuție cu un broker de cumpărător pe AiX.",
      nextStepsEn: "Schedule a consult with a dedicated buyer broker on AiX.",
      resourcesRo: "ANAF Registrul TVA, ANCPI eTerra Portal",
      resourcesEn: "ANAF VAT Registry, ANCPI eTerra Land Registry",
    },
    {
      id: "selling",
      titleRo: "Vânzare Proprietate (Selling Property)",
      titleEn: "Selling Property",
      icon: Building,
      color: "sky",
      checklistRo: [
        "Eliberați spațiul de mobilă voluminoasă și obiecte decorative personale.",
        "Pregătiți releveul, cadastrul actualizat și certificatul de performanță energetică.",
        "Stabiliți prețul bazat pe tranzacții încheiate în zonă, nu pe oferte active.",
        "Colaborați exclusiv cu o singură agenție pentru a controla listările în piață."
      ],
      checklistEn: [
        "Declutter the property of heavy furniture and personal collectibles.",
        "Prepare floor plans, updated land registry map, and energy cert.",
        "Set listing price based on closed transactions, not speculative listings.",
        "Partner exclusively with a single agency to control market exposure."
      ],
      mistakesRo: "Supraevaluarea proprietății pe criterii emoționale, ducând la stagnare.",
      mistakesEn: "Overpricing the asset on emotional value, causing listing stagnation.",
      nextStepsRo: "Cere o analiză comparativă de piață gratuită prin Seller AI.",
      nextStepsEn: "Request a comparative market report using Seller AI.",
      resourcesRo: "Evaluare AI AiX, Ghidul Vânzătorului PDF",
      resourcesEn: "AiX AI Valuation, Seller Manual PDF",
    },
    {
      id: "investment",
      titleRo: "Investiții de Bază (Investment Basics)",
      titleEn: "Investment Basics",
      icon: TrendingUp,
      color: "violet",
      checklistRo: [
        "Înțelegeți diferența dintre randamentul brut (Gross Yield) și cel net (Net Yield).",
        "Diversificați capitalul între rezidențial, comercial și alte instrumente de portofoliu.",
        "Monitorizați evoluția inflației și a dobânzilor de referință (IRCC, ROBOR, EURIBOR).",
        "Calculați perioada de amortizare și costurile anuale cu impozite și reparații."
      ],
      checklistEn: [
        "Understand the difference between Gross Yield and net rental returns.",
        "Diversify capital between residential, commercial, and liquid assets.",
        "Monitor core macroeconomic metrics (inflation, IRCC, ROBOR, EURIBOR).",
        "Calculate recovery periods (ROI) and annual maintenance budgets."
      ],
      mistakesRo: "Ignorarea costurilor recurente precum fondul de mentenanță și taxele.",
      mistakesEn: "Neglecting ongoing maintenance expenses and real estate tax rates.",
      nextStepsRo: "Accesează calculatorul de ROI și ipotecă pe platformă.",
      nextStepsEn: "Access the ROI and mortgage calculators page.",
      resourcesRo: "Wealth Manager AiX, Indici Macro BNR",
      resourcesEn: "AiX Wealth Manager, BNR Macro Indices",
    },
    {
      id: "insurance",
      titleRo: "Biroul de Asigurări (Insurance)",
      titleEn: "Insurance",
      icon: ShieldCheck,
      color: "rose",
      checklistRo: [
        "Verificați diferența între asigurarea obligatorie PAD și cea facultativă.",
        "Asigurați clădirea la valoarea reală de reconstrucție, nu la valoarea comercială.",
        "Includeți clauze suplimentare pentru bunuri de valoare, artă și răspundere civilă.",
        "Reevaluați polița anual pentru a acoperi îmbunătățirile sau renovările făcute."
      ],
      checklistEn: [
        "Verify differences between mandatory (PAD) and optional home policies.",
        "Insure structural assets at reconstruction cost, not speculative value.",
        "Include custom riders for luxury assets, art, and personal liability.",
        "Re-evaluate policies annually to account for major home improvements."
      ],
      mistakesRo: "Sub-asigurarea bunurilor pentru a plăti o primă de asigurare mai mică.",
      mistakesEn: "Under-insuring premium properties to cut monthly policy premiums.",
      nextStepsRo: "Completează formularul de cotație la Insurance Desk.",
      nextStepsEn: "Fill in a quote request at the Insurance Desk.",
      resourcesRo: "Ghidul de Asigurări Imobiliare RO",
      resourcesEn: "RO Home Property Insurance Guide",
    },
    {
      id: "negotiation",
      titleRo: "Negociere de Contracte (Negotiation)",
      titleEn: "Contract Negotiation",
      icon: Scale,
      color: "amber",
      checklistRo: [
        "Stabiliți termene clare de eliberare și penalități pe zi de întârziere.",
        "Păstrați clauze de retragere securizate în cazul în care banca respinge creditul.",
        "Nu negociați doar prețul final, ci și avansul, mobilierul inclus și taxele.",
        "Securizați tranzacția prin cont de escrow dacă avansul este semnificativ."
      ],
      checklistEn: [
        "Establish clear move-out timelines and daily delay penalties.",
        "Maintain fallback exit clauses if bank financing gets rejected.",
        "Negotiate deposits, included inventory, and notary split splits.",
        "Utilize secure escrow accounts for large down-payments."
      ],
      mistakesRo: "Negocierea verbală fără a pune toate clauzele în scris la notar.",
      mistakesEn: "Agreeing verbally without legal translation in the notary deed.",
      nextStepsRo: "Solicită consultanță juridică precontractuală la RO Law Desk.",
      nextStepsEn: "Request a pre-contract legal review at the RO Law Desk.",
      resourcesRo: "Ghid juridic de negocieri AiX",
      resourcesEn: "AiX Legal Pre-contract Handbook",
    },
    {
      id: "taxes",
      titleRo: "Impozite & Taxe (Taxes)",
      titleEn: "Taxes & Fiscal Policy",
      icon: Coins,
      color: "orange",
      checklistRo: [
        "Calculați impozitul pe transferul proprietății datorat de vânzător.",
        "Înțelegeți cota de TVA aplicabilă (5%, 9% sau 19%) pentru imobilele noi.",
        "Înregistrați contractul de închiriere la ANAF în termen de 30 de zile.",
        "Verificați impozitele locale pe clădiri în funcție de destinație (nerezidențială)."
      ],
      checklistEn: [
        "Calculate transaction transfer taxes owed by the seller.",
        "Understand VAT brackets (9% or 19%) for new build properties.",
        "Register standard lease agreements with ANAF within 30 days.",
        "Verify local municipal property tax rates for non-residential assets."
      ],
      mistakesRo: "Ignorarea taxelor de intabulare și a onorariilor notariale mari.",
      mistakesEn: "Neglecting cadastral registration costs and notary billing fees.",
      nextStepsRo: "Verifică ghidul fiscal complet pe AiX OS™.",
      nextStepsEn: "Open the complete property tax instructions page.",
      resourcesRo: "Ministerul Finanțelor Publice, Ghid ANAF",
      resourcesEn: "Ministry of Public Finances, ANAF Fiscal Portal",
    },
    {
      id: "cybersecurity",
      titleRo: "Securitate Cibernetică (Cybersecurity)",
      titleEn: "Cybersecurity",
      icon: Lock,
      color: "blue",
      checklistRo: [
        "Folosiți parole unice complexe și manager de parole securizat.",
        "Activați autentificarea cu doi factori (2FA) pe e-mail și conturi bancare.",
        "Nu accesați link-uri din e-mailuri ce cer confirmări urgente de plăți.",
        "Verificați adresa IBAN telefonic înainte de a efectua plăți de avans."
      ],
      checklistEn: [
        "Generate complex unique credentials and store in a secure vault.",
        "Enable hardware multi-factor authentication (MFA) on corporate accounts.",
        "Avoid opening suspicious billing links requesting urgent wire transfers.",
        "Verify target IBAN bank accounts via voice call before initiating wires."
      ],
      mistakesRo: "Efectuarea de plăți mari pe baza unui IBAN primit pe e-mail nesecurizat.",
      mistakesEn: "Wiring high deposits based on IBAN details received via clear email.",
      nextStepsRo: "Parcurge ghidul Cyber Security Desk pe AiX.",
      nextStepsEn: "Read the full secure transaction instructions.",
      resourcesRo: "Cyber Security Desk, Yubico Hardware keys",
      resourcesEn: "Cyber Security Desk, Yubico hardware authentication",
    },
    {
      id: "technology",
      titleRo: "Tehnologie & Unelte (Technology)",
      titleEn: "Technology & Dev Tools",
      icon: Cpu,
      color: "indigo",
      checklistRo: [
        "Automatizați alertele de preț pe zonele imobiliare de interes.",
        "Utilizați platforme GIS pentru analiză topografică și urbanistică.",
        "Implementați fluxuri de lucru serverless pentru monitorizare anunțuri.",
        "Asigurați backup-uri criptate locale pentru toate actele de proprietate."
      ],
      checklistEn: [
        "Automate property price tracking alerts in targeted neighborhoods.",
        "Leverage GIS mapping systems to study land contours and layout plans.",
        "Deploy serverless search crawlers to scan listing aggregators.",
        "Create locally encrypted cold backup archives for title documents."
      ],
      mistakesRo: "Căutarea manuală ineficientă fără a folosi scripturi sau crawlere.",
      mistakesEn: "Searching listings manually instead of deploying search alerts.",
      nextStepsRo: "Vizitează Tech Hub-ul dedicat pe platformă.",
      nextStepsEn: "Explore developer tools on the AiX Tech Hub.",
      resourcesRo: "Technology Hub, Github Automation Pipelines",
      resourcesEn: "Technology Hub, Github workflows and scripts",
    },
    {
      id: "ai",
      titleRo: "Inteligență Artificială (AI)",
      titleEn: "Artificial Intelligence",
      icon: Cpu,
      color: "violet",
      checklistRo: [
        "Folosiți AI Advisor pentru a analiza contracte de sute de pagini.",
        "Evaluarea automată a chiriilor de referință prin modele predictive.",
        "Interogați modele lingvistice mari pe rapoarte macro economice BNR.",
        "Verificați istoricul cadastral automat prin algoritmi cadastrali."
      ],
      checklistEn: [
        "Query the AI Advisor to audit massive pre-contract documents.",
        "Assess baseline rent yields using predictive models.",
        "Interact with LLM structures to interpret BNR central bank feeds.",
        "Audit cadastral files using automated legal review models."
      ],
      mistakesRo: "Încrederea oarbă în răspunsurile AI fără validare umană.",
      mistakesEn: "Trusting AI advice blindly without direct verification.",
      nextStepsRo: "Deschide chat-ul cu Money Advisor AI.",
      nextStepsEn: "Initiate a chat session with the Money Advisor AI.",
      resourcesRo: "OpenAI, Anthropic APIs, AI Advisor Desk",
      resourcesEn: "OpenAI, Anthropic APIs, AI Advisor Desk",
    },
    {
      id: "legal",
      titleRo: "Due Diligence Juridic (Legal)",
      titleEn: "Legal Due Diligence",
      icon: Scale,
      color: "amber",
      checklistRo: [
        "Verificați lanțul istoric de proprietari pentru a exclude donații atacabile.",
        "Obțineți extrase de CF curate fără sarcini, ipoteci sau procese active.",
        "Validați autorizațiile de construire și procesele-verbale de recepție.",
        "Verificați drepturile de servitute și limitele de hotar ale terenului."
      ],
      checklistEn: [
        "Trace ownership history chain to exclude contested gift deeds.",
        "Ensure clear land registry deeds without active liens or disputes.",
        "Verify developer building permits and official completion protocols.",
        "Validate active easement rights and land boundaries."
      ],
      mistakesRo: "Semnarea promisiunii de vânzare fără audit cadastral preliminar.",
      mistakesEn: "Signing promises of sale without conducting a cadastre audit.",
      nextStepsRo: "Programează o sesiune juridică la RO Law Desk.",
      nextStepsEn: "Schedule a legal audit session at the RO Law Desk.",
      resourcesRo: "ANCPI, Portal Justiție, RO Law Desk",
      resourcesEn: "ANCPI, Justice Court Search, RO Law Desk",
    },
    {
      id: "travel",
      titleRo: "Mobilitate & Călătorii (Travel)",
      titleEn: "Travel & Mobility",
      icon: Plane,
      color: "sky",
      checklistRo: [
        "Verificați alertele de securitate MAE înainte de deplasări.",
        "Rezervați zborurile private prin brokeri licențiați cu rating de siguranță ARGUS.",
        "Verificați cerințele de viză și termenele de valabilitate ale pașaportului.",
        "Securizați asigurări medicale internaționale cu acoperire mare."
      ],
      checklistEn: [
        "Inspect active border safety warnings before departure.",
        "Book private jets with ARGUS gold/platinum safety-rated operators.",
        "Verify visa entry parameters and minimum passport validity margins.",
        "Secure premium international health policies with high limits."
      ],
      mistakesRo: "Ignorarea timpilor de rezervare sau a limitelor de bagaje VIP.",
      mistakesEn: "Neglecting FBO handling times or VIP baggage limitations.",
      nextStepsRo: "Explorează resursele din secțiunea Travel.",
      nextStepsEn: "Explore flight resources in the Travel module.",
      resourcesRo: "MAE Alerte Călătorie, Henley Passport Index",
      resourcesEn: "MAE Alerts Portal, Henley Passport rankings",
    },
    {
      id: "ro-real-estate",
      titleRo: "Imobiliare România (Romanian Real Estate)",
      titleEn: "Romanian Real Estate",
      icon: Building,
      color: "emerald",
      checklistRo: [
        "Verificați Planul Urbanistic Zonal (PUZ) și indicatorii CUT/POT ai imobilului.",
        "Obțineți certificatul de urbanism pentru a înțelege limitările de construcție.",
        "Efectuați due-diligence referitor la rețelele de utilități publice (gaze, electricitate).",
        "Validați istoricul titlurilor de proprietate de după 1990."
      ],
      checklistEn: [
        "Verify local Zoning Plans (PUZ) and density coefficients (CUT/POT).",
        "Fetch the Urbanism Certificate to understand construction constraints.",
        "Inspect availability and capacity of public grid utilities (gas, electricity).",
        "Audit history of title deeds trace compiled after 1990."
      ],
      mistakesRo: "Achiziționarea de terenuri promise ca 'intravilan' care sunt blocate agricol.",
      mistakesEn: "Buying land plots classified as agricultural without build approval.",
      nextStepsRo: "Programați o sesiune de audit cu specialiștii cadastrali ai AiX.",
      nextStepsEn: "Schedule a cadastral review session with AiX specialists.",
      resourcesRo: "Registrul eTerra ANCPI, Portal Cadastru RO",
      resourcesEn: "eTerra ANCPI Registry, RO Cadastration Portal",
    },
  ];

  const filteredGuides = activeCategory === "all"
    ? guides
    : guides.filter((g) => g.id === activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16 animate-in">
      <PageHeader
        badge={language === "ro" ? "Ghiduri Practice" : "Checklist Guides"}
        title={language === "ro" ? "Centrul de Învățare" : "Learning Center"}
        subtitle={language === "ro" 
          ? "Ghiduri practice și checklist-uri esențiale structurate pe capitole. Redu riscul și optimizează deciziile financiare în mai puțin de 5 minute."
          : "Actionable step-by-step checklists, recommended tools, and mistakes to avoid. Secure your property and financial transactions."}
      />

      <section
        id="word-of-the-day"
        className="rounded-3xl border border-amber-500/20 bg-[#080808]/70 p-6 sm:p-8 backdrop-blur-xl"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 max-w-2xl text-left">
            <p className="text-[10px] uppercase tracking-[0.24em] text-amber-400 font-bold">
              {language === "ro" ? "Word of the Day" : "Word of the Day"}
            </p>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-light text-white">
                {wordOfDay.word}
              </h2>
              {wordOfDay.pronunciation && (
                <p className="text-xs text-zinc-500 font-mono">
                  / {wordOfDay.pronunciation} /
                </p>
              )}
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">
              {language === "ro" ? wordOfDay.explanationRo : wordOfDay.explanationEn}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-850 bg-zinc-950/40 p-4 text-left lg:max-w-md">
            <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500 font-bold">
              {language === "ro" ? "Exemplu practic" : "Practical example"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white">
              {language === "ro" ? wordOfDay.exampleRo : wordOfDay.exampleEn}
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-900">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCategory === "all" ? "bg-amber-500 text-black" : "border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-950/20"
          }`}
        >
          {language === "ro" ? "Toate Ghidurile" : "All Guides"}
        </button>
        {guides.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveCategory(g.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === g.id ? "bg-amber-500 text-black" : "border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-950/20"
            }`}
          >
            {language === "ro" ? g.titleRo.split(" (")[0] : g.titleEn}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide, idx) => {
          const Icon = guide.icon;
          const colorClassMap: Record<string, string> = {
            emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
            sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
            amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
            rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
            orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
            blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
            indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
            violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
          };
          const badgeClass = colorClassMap[guide.color] || "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";

          return (
            <div key={idx} className={`p-6 sm:p-8 rounded-3xl ${designSystem.glass} border-t border-zinc-800 flex flex-col justify-between space-y-6`}>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shrink-0 ${badgeClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base font-semibold text-white leading-tight">
                      {language === "ro" ? guide.titleRo : guide.titleEn}
                    </h3>
                  </div>
                </div>

                {/* Checklist items */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono font-semibold">Checklist</p>
                  <ul className="space-y-2">
                    {(language === "ro" ? guide.checklistRo : guide.checklistEn).map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-amber-500/70 shrink-0 mt-0.5" />
                        <span className="text-xs text-zinc-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Warnings & Next Steps */}
              <div className="pt-4 border-t border-zinc-900 space-y-3">
                <div className="flex items-start gap-2 text-xs text-red-400">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    <strong className="font-semibold">{language === "ro" ? "Greșeală Frecventă: " : "Common Mistake: "}</strong>
                    {language === "ro" ? guide.mistakesRo : guide.mistakesEn}
                  </p>
                </div>

                <div className="flex items-start gap-2 text-xs text-zinc-400">
                  <ArrowRight className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="font-semibold text-white">{language === "ro" ? "Următorul Pas: " : "Next Step: "}</strong>
                    {language === "ro" ? guide.nextStepsRo : guide.nextStepsEn}
                  </p>
                </div>

                <div className="flex items-start gap-2 text-xs text-zinc-500">
                  <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    <strong className="font-semibold">{language === "ro" ? "Resurse Recomandate: " : "Recommended: "}</strong>
                    {language === "ro" ? guide.resourcesRo : guide.resourcesEn}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Recommended Reading CTA */}
      <section>
        <div className={`p-8 sm:p-10 rounded-3xl border border-amber-500/20 bg-[#080808]/70 backdrop-blur-xl text-center space-y-4 relative overflow-hidden`}>
          <div className="absolute -left-20 -top-20 w-44 h-44 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
          <BookOpen className="h-7 w-7 text-amber-500/40 mx-auto" />
          <div>
            <h2 className="text-xl sm:text-2xl font-light text-white">
              {language === "ro" ? "Vrei să aprofundezi studiul?" : "Expand Your Reading List"}
            </h2>
            <p className="text-xs text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
              {language === "ro"
                ? "Descoperă biblioteca noastră de cărți recomandate despre investiții, psihologia piețelor și negocieri de lux."
                : "Explore our curated books collection focusing on luxury markets, financial charts, and asset valuation strategy."}
            </p>
          </div>
          <a
            href="/books"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 text-black px-6 py-2.5 text-xs font-semibold hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 active:scale-95 mt-4"
          >
            {language === "ro" ? "Spre Biblioteca AiX" : "Go to AiX Library"}
          </a>
        </div>
      </section>
    </div>
  );
}
