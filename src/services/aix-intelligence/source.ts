// src/services/aix-intelligence/source.ts

import { TRUSTED_REAL_ESTATE_SOURCES } from "./sources";

/**
 * Derives a human‑readable source name from a given URL.
 * Returns an empty string if the hostname does not match any trusted domain.
 */
export function deriveSourceFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    for (const src of TRUSTED_REAL_ESTATE_SOURCES) {
      if (src.domains.some((d) => hostname === d || hostname.endsWith('.' + d))) {
        return src.name;
      }
    }
    return "";
  } catch {
    return "";
  }
}
