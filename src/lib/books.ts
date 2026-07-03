/**
 * AiX OS — Curated Books Library
 * Real, well-known books. Add new books here — the UI picks them up automatically.
 *
 * Fields:
 *   id          – unique slug-like identifier
 *   title       – full book title
 *   author      – author name(s)
 *   category    – one of the CATEGORIES keys
 *   year        – publication year
 *   summary     – 1–2 sentence description (Romanian)
 *   whyRead     – AiX advisor recommendation note (Romanian)
 *   coverUrl    – canonical cover image (Open Library / publisher CDN)
 *   buyUrl      – official purchase / info page (Amazon, publisher, or Goodreads)
 *   aixScore    – AiX relevance score 1–10
 */

export type BookCategory =
  | "real-estate"
  | "investments"
  | "finance"
  | "wealth"
  | "business"
  | "ai"
  | "technology"
  | "cybersecurity"
  | "psychology"
  | "negotiation"
  | "luxury";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  year: number;
  summary: string;
  whyRead: string;
  coverUrl: string;
  buyUrl: string;
  aixScore: number;
}

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  "real-estate": "Real Estate",
  investments: "Investments",
  finance: "Finance",
  wealth: "Wealth",
  business: "Business",
  ai: "Artificial Intelligence",
  technology: "Technology",
  cybersecurity: "Cybersecurity",
  psychology: "Psychology",
  negotiation: "Negotiation",
  luxury: "Luxury & Lifestyle",
};

// Open Library covers: https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
// We use ISBN-based covers where available for reliability.

export const BOOKS: Book[] = [
  // ─── Real Estate ──────────────────────────────────────────────────────────
  {
    id: "millionaire-real-estate-investor",
    title: "The Millionaire Real Estate Investor",
    author: "Gary Keller",
    category: "real-estate",
    year: 2005,
    summary:
      "Un ghid ultra-structurat care demistifică miturile despre investițiile imobiliare și prezintă modelele financiare exacte pentru a construi un portofoliu de proprietăți masiv.",
    whyRead:
      "Recomandată de toți consilierii AiX pentru investitorii la început de drum. Metodologia Keller funcționează în orice piață.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780071466370-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0071446370",
    aixScore: 9.5,
  },
  {
    id: "real-estate-riches",
    title: "Real Estate Riches",
    author: "Dolf de Roos",
    category: "real-estate",
    year: 2004,
    summary:
      "Prezintă de ce investițiile imobiliare sunt unele dintre cele mai sigure căi spre independență financiară și cum să identifici proprietăți cu cashflow pozitiv garantat.",
    whyRead:
      "Perspectivă practică, directă și aplicabilă imediat. De Roos demonstrează că imobiliarele bat orice clasă de active pe termen lung.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780446692601-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0446692603",
    aixScore: 9.2,
  },
  {
    id: "buy-rehab-rent-refinance-repeat",
    title: "Buy, Rehab, Rent, Refinance, Repeat",
    author: "David Greene",
    category: "real-estate",
    year: 2019,
    summary:
      "Strategia BRRRR explicată pas cu pas: cum să construiești un portofoliu imobiliar aproape fără capital propriu blocat, prin refinanțare ciclică.",
    whyRead:
      "Modelul BRRRR este cel mai eficient multiplicator de capital în imobiliare. Esențială pentru oricine vizează 5+ proprietăți.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781947200081-L.jpg",
    buyUrl: "https://www.amazon.com/dp/1947200089",
    aixScore: 9.3,
  },
  {
    id: "long-distance-real-estate",
    title: "Long-Distance Real Estate Investing",
    author: "David Greene",
    category: "real-estate",
    year: 2017,
    summary:
      "Cum să investești în proprietăți din orice colț al lumii, construind echipe locale de încredere și gestionând totul de la distanță.",
    whyRead:
      "Esențială pentru investitorii AiX care operează cross-border între România, Dubai și Monaco.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780997584752-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0997584750",
    aixScore: 8.9,
  },

  // ─── Investments ──────────────────────────────────────────────────────────
  {
    id: "intelligent-investor",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    category: "investments",
    year: 1949,
    summary:
      "Biblia value investing. Explică principiile fundamentale de evaluare a activelor și construcție de portofoliu defensiv pe termen lung, în orice ciclu economic.",
    whyRead:
      "Warren Buffett o consideră cea mai bună carte despre investiții scrisă vreodată. Un must-read înainte de orice tranzacție.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0060555661",
    aixScore: 9.8,
  },
  {
    id: "principles",
    title: "Principles: Life and Work",
    author: "Ray Dalio",
    category: "investments",
    year: 2017,
    summary:
      "Fondatorul Bridgewater Associates (cel mai mare hedge fund din lume) detaliază principiile sale de management și investiții bazate pe meritocrație radicală și analiză macro.",
    whyRead:
      "Dalio oferă un cadru de gândire aplicabil direct în alocarea portofoliilor și gestionarea riscului sistemic.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781501124020-L.jpg",
    buyUrl: "https://www.amazon.com/dp/1501124021",
    aixScore: 9.4,
  },
  {
    id: "one-up-on-wall-street",
    title: "One Up On Wall Street",
    author: "Peter Lynch",
    category: "investments",
    year: 1989,
    summary:
      "Lynch demonstrează că investitorii individuali au avantaje pe care Wall Street nu le are și cum să identifici companii cu potențial imens înainte ca ele să fie descoperite de instituții.",
    whyRead:
      "Metodologia Lynch de stock-picking rămâne una din cele mai profitabile din istoria pieței.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780743200400-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0743200403",
    aixScore: 9.1,
  },

  // ─── Finance ──────────────────────────────────────────────────────────────
  {
    id: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    category: "finance",
    year: 1997,
    summary:
      "O introducere fundamentală în educația financiară: diferența dintre active și pasive, importanța fluxului de numerar pasiv și de ce școala nu te învață despre bani.",
    whyRead:
      "Cel mai bun punct de start pentru oricine nu a primit educație financiară formală. Schimbă perspectiva asupra muncii și capitalului.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg",
    buyUrl: "https://www.amazon.com/dp/1612680194",
    aixScore: 8.9,
  },
  {
    id: "the-total-money-makeover",
    title: "The Total Money Makeover",
    author: "Dave Ramsey",
    category: "finance",
    year: 2003,
    summary:
      "Un plan pragmatic în 7 pași pentru eliminarea datoriilor, construirea unui fond de urgență și accelerarea averii prin disciplină financiară strictă.",
    whyRead:
      "Ideal ca fundament de disciplină financiară înainte de a aborda investițiile complexe HNWI.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781595555274-L.jpg",
    buyUrl: "https://www.amazon.com/dp/1595555277",
    aixScore: 8.7,
  },

  // ─── Wealth ───────────────────────────────────────────────────────────────
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "wealth",
    year: 2020,
    summary:
      "Explorează relația psihologică complexă pe care oamenii o au cu banii, demonstrând că deciziile financiare bune depind mai mult de comportament decât de IQ sau expertiză.",
    whyRead:
      "Cartea care explică de ce oameni inteligenți iau decizii financiare proaste. Recomandată tuturor clienților AiX înainte de orice alocare majoră.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0857197681",
    aixScore: 9.6,
  },
  {
    id: "almanac-naval-ravikant",
    title: "The Almanac of Naval Ravikant",
    author: "Eric Jorgenson",
    category: "wealth",
    year: 2020,
    summary:
      "O culegere de idei și principii ale lui Naval Ravikant despre cum să construiești avere și fericire în era tehnologiei, folosind leverage-ul digital și capital.",
    whyRead:
      "Naval oferă un cadru mental unic pentru construcția de avere fără a sacrifica libertatea personală.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781544514222-L.jpg",
    buyUrl: "https://www.amazon.com/dp/1544514220",
    aixScore: 9.7,
  },
  {
    id: "die-with-zero",
    title: "Die With Zero",
    author: "Bill Perkins",
    category: "wealth",
    year: 2020,
    summary:
      "O perspectivă radicală despre optimizarea experiențelor de viață față de acumularea de capital: cum să maximizezi valoarea fiecărui euro cheltuit la momentul potrivit.",
    whyRead:
      "Carte provocatoare pentru clienții HNWI care deja au capital și caută sens în alocarea lui. Schimbă paradigma.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780358099765-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0358099765",
    aixScore: 8.8,
  },

  // ─── Business ─────────────────────────────────────────────────────────────
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    category: "business",
    year: 2014,
    summary:
      "Thiel argumentează că progresul real vine din crearea de lucruri noi, nu din copierea celor existente. Un ghid pentru construirea de companii care să domine piețe noi.",
    whyRead:
      "Gândire de monopol aplicabilă direct în structurarea portofoliilor de investiții și selecția companiilor private de tip unicorn.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780804139021-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0804139024",
    aixScore: 9.3,
  },
  {
    id: "good-to-great",
    title: "Good to Great",
    author: "Jim Collins",
    category: "business",
    year: 2001,
    summary:
      "Collins analizează ce diferențiază companiile care au trecut de la mediocru la extraordinar, identificând factori structurali reproducibili.",
    whyRead:
      "Framework-ul Hedgehog Concept și Flywheel Effect sunt direct aplicabile în analiza companiilor din portofoliul de investiții.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780066620992-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0066620996",
    aixScore: 9.0,
  },
  {
    id: "shoe-dog",
    title: "Shoe Dog",
    author: "Phil Knight",
    category: "business",
    year: 2016,
    summary:
      "Memoriile fondatorului Nike — o poveste uluitoare de antreprenoriat, risc și perseverență care a construit unul dintre cele mai valoroase branduri din lume.",
    whyRead:
      "Inspirație pură pentru antreprenori. Knight demonstrează că cele mai mari afaceri se construiesc prin reziliență, nu prin plan perfect.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781501135927-L.jpg",
    buyUrl: "https://www.amazon.com/dp/1501135929",
    aixScore: 9.1,
  },

  // ─── AI ───────────────────────────────────────────────────────────────────
  {
    id: "superintelligence",
    title: "Superintelligence",
    author: "Nick Bostrom",
    category: "ai",
    year: 2014,
    summary:
      "O analiză profundă a traiectoriilor posibile ale inteligenței artificiale superinteligente și a riscurilor existențiale pe care le implică pentru umanitate.",
    whyRead:
      "Fundamentală pentru oricine investește în companii AI sau dorește să înțeleagă forțele care vor remodela economia globală.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780199678112-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0199678111",
    aixScore: 9.2,
  },
  {
    id: "human-compatible",
    title: "Human Compatible",
    author: "Stuart Russell",
    category: "ai",
    year: 2019,
    summary:
      "Profesorul de la Berkeley propune o nouă paradigmă de AI aliniat cu valorile umane și explică de ce modelele actuale de AI sunt fundamental defectuoase pe termen lung.",
    whyRead:
      "Esențială pentru investitorii în AI Safety și pentru înțelegerea riscurilor sistemice ale automatizării masive.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525558613-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0525558616",
    aixScore: 9.0,
  },
  {
    id: "power-and-prediction",
    title: "Power and Prediction",
    author: "Ajay Agrawal, Joshua Gans, Avi Goldfarb",
    category: "ai",
    year: 2022,
    summary:
      "Cum AI-ul transformă luarea de decizii în afaceri și economie prin reducerea drastică a costului predicției, redistribuind puterea în industrii întregi.",
    whyRead:
      "Cartea cheie pentru a înțelege cum AI va redistribui valoarea economică — esențială pentru alocarea portofoliului pe next decade.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781647824686-L.jpg",
    buyUrl: "https://www.amazon.com/dp/1647824680",
    aixScore: 8.9,
  },

  // ─── Technology ───────────────────────────────────────────────────────────
  {
    id: "the-innovators-dilemma",
    title: "The Innovator's Dilemma",
    author: "Clayton M. Christensen",
    category: "technology",
    year: 1997,
    summary:
      "De ce companiile mari și bine gestionate eșuează în fața inovației disruptive — și cum să identifici și să investești în disruptorii de mâine.",
    whyRead:
      "Cadrul de analiză a disruption-ului este folosit activ de echipele AiX pentru evaluarea oportunitaților de investiție în tech.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781633691780-L.jpg",
    buyUrl: "https://www.amazon.com/dp/1633691780",
    aixScore: 9.4,
  },
  {
    id: "the-lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "technology",
    year: 2011,
    summary:
      "Metodologia Build-Measure-Learn pentru construcția rapidă și validarea produselor tech, minimizând risipa de capital și timp în faza de startup.",
    whyRead:
      "Aplicabilă direct în evaluarea startup-urilor tech din portofoliu și în structurarea pilot-urilor de investiții imobiliare proptech.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0307887898",
    aixScore: 8.8,
  },

  // ─── Cybersecurity ────────────────────────────────────────────────────────
  {
    id: "countdown-to-zero-day",
    title: "Countdown to Zero Day",
    author: "Kim Zetter",
    category: "cybersecurity",
    year: 2014,
    summary:
      "Povestea Stuxnet — primul atac cibernetic de stat care a distrus infrastructură fizică iraniană. Documentarul tehnic definitiv al cyberwarefare modern.",
    whyRead:
      "Înțelegerea atacurilor asupra infrastructurii critice este esențială pentru protejarea activelor HNWI și a investițiilor industriale.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780770436193-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0770436196",
    aixScore: 9.0,
  },
  {
    id: "sandworm",
    title: "Sandworm",
    author: "Andy Greenberg",
    category: "cybersecurity",
    year: 2019,
    summary:
      "Investigarea celui mai devastator grup de hackeri rus — Sandworm — și atacurile care au paralizat infrastructuri întregi de stat și companii multinaționale.",
    whyRead:
      "Perspectivă reală asupra amenințărilor cibernetice la nivel de stat. Esențial pentru investitorii cu expunere în Est-Europa.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780385544405-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0385544405",
    aixScore: 8.8,
  },
  {
    id: "ghost-in-the-wires",
    title: "Ghost in the Wires",
    author: "Kevin Mitnick",
    category: "cybersecurity",
    year: 2011,
    summary:
      "Autobiografia celui mai celebru hacker din lume — Kevin Mitnick — care a penetrat sisteme ale NASA, Motorola și DoD folosind tehnici de social engineering.",
    whyRead:
      "Înțelegerea tacticilor de social engineering este cel mai important strat de protecție pentru investitorii cu active digitale valoroase.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780316037709-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0316037699",
    aixScore: 8.7,
  },

  // ─── Psychology ───────────────────────────────────────────────────────────
  {
    id: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "psychology",
    year: 2011,
    summary:
      "Laureatul Nobel Kahneman explică cele două sisteme de gândire (rapid/emoțional și lent/rațional) și cum biasurile cognitive afectează deciziile financiare.",
    whyRead:
      "Biblia deciziei raționale. Consilierii AiX o recomandă fiecărui client înainte de tranzacții majore pentru a evita deciziile impulsive.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0374533555",
    aixScore: 9.7,
  },
  {
    id: "influence",
    title: "Influence: The Psychology of Persuasion",
    author: "Robert B. Cialdini",
    category: "psychology",
    year: 1984,
    summary:
      "Cialdini identifică cele 6 principii universale ale persuasiunii (reciprocitate, angajament, dovadă socială, autoritate, simpatie, raritate) și cum funcționează.",
    whyRead:
      "Instrumentar psihologic esențial în negocieri imobiliare, due diligence social și identificarea tacticilor de manipulare.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062937650-L.jpg",
    buyUrl: "https://www.amazon.com/dp/006286790X",
    aixScore: 9.4,
  },
  {
    id: "the-compound-effect",
    title: "The Compound Effect",
    author: "Darren Hardy",
    category: "psychology",
    year: 2010,
    summary:
      "Cum decizii mici și consistente, multiplicate în timp, produc rezultate exponențiale spectaculoase — aplicat la bani, relații și performanță.",
    whyRead:
      "Cadrul mental perfect pentru investitorii pe termen lung care înțeleg puterea dobânzii compuse aplicată la orice aspect al vieții.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781593157142-L.jpg",
    buyUrl: "https://www.amazon.com/dp/159315717X",
    aixScore: 8.8,
  },

  // ─── Negotiation ──────────────────────────────────────────────────────────
  {
    id: "never-split-the-difference",
    title: "Never Split the Difference",
    author: "Chris Voss",
    category: "negotiation",
    year: 2016,
    summary:
      "Fostul negociator-șef FBI detaliază tehnicile de negociere tactică (tactical empathy, mirroring, labeling) testate în crize cu ostatici și aplicabile în orice negociere comercială.",
    whyRead:
      "Cartea cu cel mai mare ROI direct aplicată în tranzacțiile imobiliare. Un singur tactic Voss poate salva sute de mii de euro.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062407801-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0062407805",
    aixScore: 9.8,
  },
  {
    id: "getting-to-yes",
    title: "Getting to Yes",
    author: "Roger Fisher & William Ury",
    category: "negotiation",
    year: 1981,
    summary:
      "Metoda negocierii principiale (bazate pe interese, nu poziții) dezvoltată la Harvard Negotiation Project — standardul de aur în rezolvarea conflictelor și încheierea acordurilor.",
    whyRead:
      "Fundament teoretic esențial al oricărui negociator eficient. Complementar cu abordarea mai tactică a lui Voss.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143118756-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0143118757",
    aixScore: 9.2,
  },
  {
    id: "start-with-no",
    title: "Start with No",
    author: "Jim Camp",
    category: "negotiation",
    year: 2002,
    summary:
      "Camp respinge ideea compromisului și a câștig-câștig ca fundament al negocierii. Argumentează că a începe cu „Nu” este mai puternic decât orice altă abordare.",
    whyRead:
      "Metodă contraintutitivă dar extrem de eficientă în negocierile imobiliare off-market unde structura de putere contează.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780609608005-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0609608002",
    aixScore: 8.9,
  },

  // ─── Luxury ───────────────────────────────────────────────────────────────
  {
    id: "the-luxury-strategy",
    title: "The Luxury Strategy",
    author: "Jean-Noël Kapferer & Vincent Bastien",
    category: "luxury",
    year: 2009,
    summary:
      "Definiția academică a luxului și de ce regulile de marketing convențional nu se aplică brandurilor premium. Analiza codurilor care construiesc percepția de raritate.",
    whyRead:
      "Fundamentală pentru înțelegerea psihologiei cumpărătorilor de lux și poziționarea activelor premium pe piață.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780749454777-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0749454776",
    aixScore: 9.0,
  },
  {
    id: "deluxe",
    title: "Deluxe: How Luxury Lost Its Luster",
    author: "Dana Thomas",
    category: "luxury",
    year: 2007,
    summary:
      "Investigație jurnalistică în industria bunurilor de lux: de la atelierele artizanale originale la producția de masă mascată sub branduri de prestigiu.",
    whyRead:
      "Perspectivă critică care ajută investitorii să distingă valoarea reală de lux față de „luxury washing” în achiziții de active și branduri.",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143113706-L.jpg",
    buyUrl: "https://www.amazon.com/dp/0143113704",
    aixScore: 8.6,
  },
];

// Helper: get all unique categories present in BOOKS
export function getAvailableCategories(): BookCategory[] {
  const cats = new Set(BOOKS.map((b) => b.category));
  return Array.from(cats).sort();
}
