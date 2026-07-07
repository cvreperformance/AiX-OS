/**
 * Supabase Storage configuration for AiX OS™ property images.
 * Override via environment variables — no hardcoded URLs in components.
 */

export const storageConfig = {
  /** Public bucket name (case-sensitive in Supabase) */
  bucket:
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || "Proprietati",

  /** Supabase project URL */
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || "",

  /** Placeholder when no image is available */
  fallbackImage: "/images/property-fallback.svg",
} as const;

export function isStorageConfigured(): boolean {
  return Boolean(storageConfig.supabaseUrl);
}

export function getSupabaseHostname(): string | null {
  if (!storageConfig.supabaseUrl) return null;
  try {
    return new URL(storageConfig.supabaseUrl).hostname;
  } catch {
    return null;
  }
}
