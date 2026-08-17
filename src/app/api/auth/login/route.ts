import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!adminAuth) {
      return NextResponse.json({ error: 'Servidor mal configurado. FIREBASE_PRIVATE_KEY ausente.' }, { status: 500 });
    }

    // Define a validade do cookie para 5 dias
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Cria o cookie de sessão com base no token JWT
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Define o cookie HTTP-Only usando a API moderna do Next.js App Router
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro na criação do cookie de sessão:', error);
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }
}
