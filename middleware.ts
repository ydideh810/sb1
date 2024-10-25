import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/no-auth',
    '/api/auth/callback'
  ];

  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Allow public routes without authentication
  if (isPublicRoute) {
    // If user is logged in and tries to access login page, redirect to dashboard
    if (session && req.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return res;
  }

  // Redirect to login if accessing protected route without session
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
