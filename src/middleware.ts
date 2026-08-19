import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isLocalAdminEnabled(request: NextRequest): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  
  if (process.env.ENABLE_LOCAL_ADMIN !== 'true') {
    return false;
  }

  const hostname = request.nextUrl.hostname;
  const hostHeader = request.headers.get('host') || '';
  const hostHeaderName = hostHeader.split(':')[0]; // remove port

  const isAllowedHost = (host: string) => {
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  };

  if (!isAllowedHost(hostname) || !isAllowedHost(hostHeaderName)) {
    return false;
  }

  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/api/upload') ||
    pathname.startsWith('/api/migrate') ||
    pathname.startsWith('/api/duplicate-evo');

  if (isAdminRoute) {
    if (!isLocalAdminEnabled(request)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  const session = request.cookies.get('session')?.value;

  if (pathname === '/admin/signup') {
    return new NextResponse(null, { status: 404 });
  }

  if (pathname === '/admin/login') {
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/api/auth/:path*', 
    '/api/admin/:path*', 
    '/api/upload', 
    '/api/migrate', 
    '/api/duplicate-evo'
  ],
};
