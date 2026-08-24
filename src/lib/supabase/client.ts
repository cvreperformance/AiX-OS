import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://')
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : "https://fcpsafjgjnecdlyqfcid.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ')
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcHNhZmpnam5lY2RseXFmY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzAyMTksImV4cCI6MjA5ODMwNjIxOX0.n-Obp-2j284umEvkKHBiTmmTfYARKvGrx3dUDhvcGPY";

export function isSupabaseConfigured(): boolean {
  return true;
}

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabasePublic = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
