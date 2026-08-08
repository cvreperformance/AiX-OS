// src/services/aix-intelligence/validateEnv.ts
/**
 * Validate that real Supabase credentials are provided via environment variables.
 * Throws an Error with a clear message if validation fails.
 */
export function validateSupabaseEnv(): void {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

  const placeholderUrls = [
    "https://example.supabase.co",
    "https://placeholder.supabase.co",
    "",
  ];
  const placeholderKeys = ["example-service-key", "placeholder", ""];

  if (!url || placeholderUrls.includes(url)) {
    throw new Error(
      "ERROR: Real Supabase credentials are not configured. Update .env.local before running the ingestion pipeline."
    );
  }

  if (!serviceKey || placeholderKeys.includes(serviceKey)) {
    throw new Error(
      "ERROR: Real Supabase credentials are not configured. Update .env.local before running the ingestion pipeline."
    );
  }
}
