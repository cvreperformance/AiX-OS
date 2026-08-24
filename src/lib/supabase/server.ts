import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://')
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : "https://fcpsafjgjnecdlyqfcid.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ')
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcHNhZmpnam5lY2RseXFmY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzAyMTksImV4cCI6MjA5ODMwNjIxOX0.n-Obp-2j284umEvkKHBiTmmTfYARKvGrx3dUDhvcGPY";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Ignored when called from Server Component
          }
        },
      },
    }
  );
}
