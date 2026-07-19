import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'nit_secret_key_2026';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('nit_token')?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Rule: Admin API Protection
  const isAdminApi = pathname.startsWith('/api/admin') && !pathname.includes('/login');
  if (isAdminApi) {
    const adminSession = request.cookies.get('admin_session')?.value;
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }
  }

  // Rule A: Missing cookie -> /dashboard, /certificates, /api/student/...
  const isProtectedApi = pathname.startsWith('/api/student') && !pathname.includes('/login') && !pathname.includes('/register');
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/certificates') || isProtectedApi;
  
  if (isProtectedPath && !isAuthenticated) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('nit_token');
    return response;
  }

  // Rule B: Present cookie -> /login, /join
  const isAuthPath = pathname === '/login' || pathname === '/join';
  
  if (isAuthPath && isAuthenticated) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin panel)
     * - internships
     * - skill_courses
     */
    '/((?!_next/static|_next/image|favicon.ico|admin|internships|skill_courses).*)',
  ],
};
