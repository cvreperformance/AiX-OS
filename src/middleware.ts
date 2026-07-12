import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Global middleware to enforce user approval status.
 * - Allows unauthenticated routes (auth pages, public API, static assets).
 * - Allows admins unrestricted access.
 * - Redirects users with `approval_status !== 'approved'` to the pending approval page.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that do not require auth or approval
  const publicPaths = [
    '/login',
    '/register',
    '/api/',
    '/_next/',
    '/favicon.ico',
    '/pending-approval',
  ];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Create Supabase client from cookies
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // No user → redirect to login
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

  // If not approved – send to pending page
  if (profile?.approval_status !== 'approved') {
    const pendingUrl = request.nextUrl.clone();
    pendingUrl.pathname = '/pending-approval';
    return NextResponse.redirect(pendingUrl);
  }

  // All checks passed – allow request
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Run for all routes
};
