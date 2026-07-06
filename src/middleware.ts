import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    // Basic auth check and cookie refresh using Supabase SSR
    const { supabaseResponse, user } = await updateSession(request);
    const { pathname } = request.nextUrl;

    // Edge-safe lightweight route protection.
    // Heavy role validation (Admin) is handled securely in Server Components.
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  } catch (err) {
    // Temporary Stability Mode:
    // If Supabase edge client crashes for any reason, DO NOT bring down the site.
    // Allow the request to pass through; Server Components will catch unauthorized access.
    console.error("Middleware Auth Error:", err);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes are protected server-side)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
