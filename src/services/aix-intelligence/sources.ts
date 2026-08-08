// src/services/aix-intelligence/sources.ts

export interface TrustedSource {
  id: string;
  name: string;
  domains: string[]; // lower‑cased domains for easy matching
  regions: string[];
}

export const TRUSTED_REAL_ESTATE_SOURCES: TrustedSource[] = [
  {
    id: "knight-frank",
    name: "KNIGHT FRANK",
    domains: ["knightfrank.com"],
    regions: ["Europe"],
  },
  {
    id: "savills",
    name: "SAVILLS",
    domains: ["savills.com"],
    regions: ["Europe"],
  },
  {
    id: "jll",
    name: "JLL",
    domains: ["jll.com"],
    regions: ["Europe"],
  },
  {
    id: "cbre",
    name: "CBRE",
    domains: ["cbre.com"],
    regions: ["Europe"],
  },
  {
    id: "cushman-wakefield",
    name: "CUSHMAN & WAKEFIELD",
    domains: ["cushmanwakefield.com"],
    regions: ["Europe"],
  },
  {
    id: "colliers",
    name: "COLLIERS",
    domains: ["colliers.com"],
    regions: ["Europe"],
  },
  {
    id: "bnpp-real-estate",
    name: "BNP PARIBAS REAL ESTATE",
    domains: ["realestate.bnpparibas.com"],
    regions: ["Europe"],
  },
  {
    id: "eurostat",
    name: "EUROSTAT",
    domains: ["ec.europa.eu"],
    regions: ["Europe"],
  },
  {
    id: "ecb",
    name: "ECB",
    domains: ["ecb.europa.eu", "data.ecb.europa.eu"],
    regions: ["Europe"],
  },
];
