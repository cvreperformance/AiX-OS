export interface WordOfDayEntry {
  word: string;
  pronunciation?: string;
  explanationRo: string;
  explanationEn: string;
  exampleRo: string;
  exampleEn: string;
}

const WORDS: WordOfDayEntry[] = [
  {
    word: "Liquidity",
    pronunciation: "li-KWID-ih-tee",
    explanationRo: "Cât de repede poate fi transformat un activ în bani fără pierderi mari de valoare.",
    explanationEn: "How quickly an asset can be converted into cash without a major loss in value.",
    exampleRo: "Un portofoliu cu multă liquidity poate reacționa rapid la o oportunitate off-market.",
    exampleEn: "A portfolio with strong liquidity can move quickly on an off-market opportunity.",
  },
  {
    word: "Equity",
    pronunciation: "EH-kwi-tee",
    explanationRo: "Partea din valoarea unui activ care rămâne după scăderea datoriilor și a obligațiilor.",
    explanationEn: "The value of ownership remaining after subtracting liabilities from an asset.",
    exampleRo: "Creșterea equity-ului într-o proprietate apare atunci când datoria scade și valoarea urcă.",
    exampleEn: "Equity grows when debt falls and the asset value rises.",
  },
  {
    word: "EBITDA",
    pronunciation: "ee-BIT-dah",
    explanationRo: "Indicatorul care arată profitul operațional înainte de dobânzi, taxe, depreciere și amortizare.",
    explanationEn: "Operating profit before interest, taxes, depreciation, and amortization.",
    exampleRo: "EBITDA este util când compari companii din industrii similare.",
    exampleEn: "EBITDA helps compare businesses within the same sector.",
  },
  {
    word: "ROI",
    pronunciation: "ar-oh-ai",
    explanationRo: "Randamentul obținut raportat la capitalul investit.",
    explanationEn: "The return generated relative to the capital invested.",
    exampleRo: "Un ROI bun arată dacă un proiect merită scalat sau oprit.",
    exampleEn: "A strong ROI shows whether a project deserves more capital or a pause.",
  },
  {
    word: "Due Diligence",
    pronunciation: "dyoo-DIL-ih-jens",
    explanationRo: "Procesul de verificare completă a riscurilor, actelor și contextului înainte de o decizie.",
    explanationEn: "A full verification process covering risk, documents, and context before a decision.",
    exampleRo: "Fără due diligence, o tranzacție poate părea bună și totuși să ascundă probleme.",
    exampleEn: "Without due diligence, a deal can look good while still hiding serious issues.",
  },
  {
    word: "Cash Flow",
    pronunciation: "kash floh",
    explanationRo: "Banii care intră și ies dintr-un business sau activ într-o perioadă dată.",
    explanationEn: "The money moving in and out of a business or asset during a period.",
    exampleRo: "Un cash flow sănătos face portofoliul mai rezilient în perioadele dificile.",
    exampleEn: "Healthy cash flow makes a portfolio more resilient during difficult periods.",
  },
  {
    word: "Diversification",
    pronunciation: "dai-vur-si-fi-KAY-shun",
    explanationRo: "Împărțirea capitalului în mai multe active pentru a reduce riscul.",
    explanationEn: "Spreading capital across multiple assets to reduce risk.",
    exampleRo: "Diversification-ul protejează un investitor atunci când o singură piață încetinește.",
    exampleEn: "Diversification protects an investor when one market slows down.",
  },
  {
    word: "Leverage",
    pronunciation: "LEV-er-ij",
    explanationRo: "Folosirea capitalului împrumutat sau a resurselor existente pentru a amplifica rezultatul.",
    explanationEn: "Using borrowed capital or existing resources to amplify results.",
    exampleRo: "Leverage-ul bine dozat poate accelera expansiunea unui business.",
    exampleEn: "Measured leverage can accelerate a business's expansion.",
  },
  {
    word: "Inflation",
    pronunciation: "in-FLAY-shun",
    explanationRo: "Ritmul cu care cresc prețurile și scade puterea de cumpărare.",
    explanationEn: "The pace at which prices rise and purchasing power falls.",
    exampleRo: "Inflation-ul ridicat poate eroda randamentele reale dacă nu ești atent la costuri.",
    exampleEn: "High inflation can erode real returns if cost discipline is weak.",
  },
  {
    word: "Hedging",
    pronunciation: "HEJ-ing",
    explanationRo: "Strategia de protejare împotriva unui risc de preț, curs sau piață.",
    explanationEn: "A strategy used to protect against price, currency, or market risk.",
    exampleRo: "Hedging-ul este util când vrei să limitezi expunerea la volatilitate.",
    exampleEn: "Hedging helps when you want to limit exposure to volatility.",
  },
  {
    word: "Asset Allocation",
    pronunciation: "AS-et a-loh-KAY-shun",
    explanationRo: "Modul în care împarți capitalul între clase de active diferite.",
    explanationEn: "How capital is divided across different asset classes.",
    exampleRo: "O alocare echilibrată a activelor ajută la controlul riscului și al randamentului.",
    exampleEn: "Balanced asset allocation helps control both risk and return.",
  },
];

function getBucharestDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return "1970-01-01";
  }

  return `${year}-${month}-${day}`;
}

export function getWordOfDay(date = new Date()) {
  const dateKey = getBucharestDateKey(date);
  const [year, month, day] = dateKey.split("-").map(Number);
  const daysSinceEpoch = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  const index = ((daysSinceEpoch % WORDS.length) + WORDS.length) % WORDS.length;

  return {
    dateKey,
    ...WORDS[index],
  };
}
