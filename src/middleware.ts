import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isLocalAdminEnabled(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }
  
  if (process.env.ENABLE_LOCAL_ADMIN !== 'true') {
    return false;
  }

  const hostname = request.nextUrl.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return false;
  }

  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bloqueio de painel e auth em produção
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/auth') || pathname.startsWith('/api/admin')) {
    if (!isLocalAdminEnabled(request)) {
      // Retorna 404 para esconder a existência dessas rotas
      return new NextResponse(null, { status: 404 });
    }
  }

  const session = request.cookies.get('session')?.value;

  // Rotas públicas do admin
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Rotas protegidas do admin
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*', '/api/admin/:path*'],
};
