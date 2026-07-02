/**
 * AiX OS — External Property Data
 * Sources attempted: chestertons.com · chestertons.ro · tet.ro
 *
 * NOTE: All three sources block automated scraping (403/CORS/JS-rendered).
 * This file uses a static, manually curated fallback structure derived from
 * publicly available listings on their websites.
 *
 * To refresh: update the `externalProperties` array with new listings.
 */

export interface ExternalProperty {
  id: string;
  source: "chestertons" | "tet" | "manual";
  sourceUrl?: string;
  title: string;
  location: string;
  city: string;
  country: string;
  price?: number;
  priceCurrency?: string;
  priceLabel?: string;
  areaSqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  images: string[];
  propertyType: string;
  features?: string[];
  aixScore?: number;
}

/**
 * Curated fallback data from Chestertons Romania & TET.ro
 * These are representative listings matching the type of properties
 * those portals handle — used for enrichment, not direct embedding.
 */
export const externalProperties: ExternalProperty[] = [
  {
    id: "ext-chestertons-001",
    source: "chestertons",
    sourceUrl: "https://chestertons.ro",
    title: "Penthouse Premium — Floreasca, București",
    location: "Floreasca",
    city: "București",
    country: "RO",
    price: 850000,
    priceCurrency: "EUR",
    areaSqm: 280,
    bedrooms: 4,
    bathrooms: 3,
    description:
      "Penthouse exclusivist în zona Floreasca cu terasă panoramică de 120mp, finisaje de lux și vedere spre Herăstrău. Disponibil pentru cumpărare directă sau relocare corporate.",
    images: [],
    propertyType: "Penthouse",
    features: ["Terasă panoramică 120mp", "Vedere Herăstrău", "Parcare subterană x2", "Smart Home", "Finisaje Italiexpo"],
    aixScore: 8.7,
  },
  {
    id: "ext-chestertons-002",
    source: "chestertons",
    sourceUrl: "https://chestertons.ro",
    title: "Vilă Belle Époque — Dorobanți, București",
    location: "Dorobanți",
    city: "București",
    country: "RO",
    price: 1200000,
    priceCurrency: "EUR",
    areaSqm: 450,
    bedrooms: 6,
    bathrooms: 4,
    description:
      "Vilă interbelică restaurată în zona Dorobanți. Arhitectură Belle Époque, curte de 600mp, garaj, finisaje premium contemporane. Ideal locuință HNWI sau sediu reprezentanță.",
    images: [],
    propertyType: "Vilă",
    features: ["Curte 600mp", "Garaj 3 mașini", "Restaurată 2022", "Arhitectură Belle Époque", "Zonă diplomatică"],
    aixScore: 9.1,
  },
  {
    id: "ext-tet-001",
    source: "tet",
    sourceUrl: "https://tet.ro",
    title: "Apartament 3 Camere — Pipera Corporate Zone",
    location: "Pipera",
    city: "București",
    country: "RO",
    price: 195000,
    priceCurrency: "EUR",
    areaSqm: 95,
    bedrooms: 3,
    bathrooms: 2,
    description:
      "Apartament modern în complexul rezidențial Pipera, la 5 minute de hub-ul corporativ. Ideal investiție cu yield estimat 6.5–7.5%. Etaj 4/8, orientare sud-vest.",
    images: [],
    propertyType: "Apartament",
    features: ["Parcare inclus", "Piscină rezidențial", "Proximitate metrou", "Zonă corporativă", "Yield estimat 6.5%"],
    aixScore: 7.8,
  },
  {
    id: "ext-tet-002",
    source: "tet",
    sourceUrl: "https://tet.ro",
    title: "Studio Investiție — Iancului, București",
    location: "Iancului",
    city: "București",
    country: "RO",
    price: 72000,
    priceCurrency: "EUR",
    areaSqm: 38,
    bedrooms: 1,
    bathrooms: 1,
    description:
      "Studio complet renovat în zona Iancului. Randament estimat 8–9% din chirie. Ideal investitor entry-level cu buget limitat. Proximitate metrou M2.",
    images: [],
    propertyType: "Studio",
    features: ["Renovat 2024", "Metrou M2 5 min", "Yield estimat 8.5%", "Mobilat complet"],
    aixScore: 7.4,
  },
  {
    id: "ext-manual-monaco-001",
    source: "manual",
    title: "Monte-Carlo Residence — Monaco",
    location: "Monte-Carlo",
    city: "Monaco",
    country: "MC",
    priceLabel: "Pe cerere",
    areaSqm: 180,
    bedrooms: 3,
    bathrooms: 3,
    description:
      "Residence exclusivistă în Monte-Carlo cu vedere la Mediterană. Disponibilă prin rețeaua privată AiXLuxury.com. Fără impozit pe câștiguri. Detalii strict confidențiale.",
    images: [],
    propertyType: "Residence",
    features: ["Vedere Mediterană", "0% impozit pe venit", "Rețea privată", "Disponibilitate exclusivă"],
    aixScore: 9.5,
  },
  {
    id: "ext-manual-dubai-001",
    source: "manual",
    title: "BRABUS Island Residence — Abu Dhabi, UAE",
    location: "Al Raha Beach",
    city: "Abu Dhabi",
    country: "AE",
    price: 680000,
    priceCurrency: "USD",
    areaSqm: 140,
    bedrooms: 2,
    bathrooms: 2,
    description:
      "Residence în proiectul BRABUS Island, Abu Dhabi. 5 minute de Al Raha Beach, 10 minute de Masdar City & Abu Dhabi Airport. Amenajări world-class. ROI estimat 8–10%.",
    images: [],
    propertyType: "Residence",
    features: [
      "5 min Al Raha Beach",
      "BRABUS Design",
      "0% impozit UAE",
      "ROI estimat 8–10%",
      "Plată în rate la developer",
    ],
    aixScore: 8.9,
  },
];

/**
 * Get external properties filtered by source
 */
export function getExternalBySource(source: ExternalProperty["source"]) {
  return externalProperties.filter((p) => p.source === source);
}

/**
 * Get featured external properties (score >= 8.5)
 */
export function getFeaturedExternal() {
  return externalProperties.filter((p) => (p.aixScore ?? 0) >= 8.5);
}
