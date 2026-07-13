import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Global middleware to enforce route protection.
 * - Public routes are accessible to everyone.
 * - Protected routes (/dashboard, /admin) require authentication.
 * - Redirects users with `approval_status !== 'approved'` to the pending approval page.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const protectedPaths = [
    '/dashboard',
    '/admin',
    '/workspace'
  ];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // If the route is public, allow access immediately
  if (!isProtected) {
    return NextResponse.next();
  }

  // Create Supabase client from cookies
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // No user trying to access a protected route → redirect to login
  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Fetch profile (including approval_status and role)
  const { data: profile } = await supabase
    .from('profiles')
    .select('approval_status,role')
    .eq('id', user.id)
    .single();

  // If admin – unrestricted
  if (profile?.role === 'admin') {
    return NextResponse.next();
  }


  // All checks passed – allow request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes are usually protected within the handlers)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
