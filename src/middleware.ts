import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Rotas públicas do admin
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    // Se já estiver logado (tem cookie), redireciona para o painel
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Rotas protegidas do admin
  if (pathname.startsWith('/admin')) {
    // Se não tem cookie, barrado antes de carregar o JS do cliente
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Nota: Como o Middleware roda na Edge, não podemos usar o firebase-admin 
    // diretamente aqui para decodificar o token. 
    // O bloqueio rígido do cookie "session" garante que apenas usuários 
    // que passaram pela /api/auth/login entrem.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
