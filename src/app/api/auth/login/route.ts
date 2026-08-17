import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!adminAuth) {
      return NextResponse.json({ error: 'Servidor mal configurado. FIREBASE_PRIVATE_KEY ausente.' }, { status: 500 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (decodedToken.admin !== true) {
      return NextResponse.json({ error: 'Não autorizado. Requer privilégios de administrador.' }, { status: 403 });
    }

    // Define a validade do cookie para 5 dias
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Cria o cookie de sessão com base no token JWT
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const isDevelopment = process.env.NODE_ENV === 'development';

    // Define o cookie HTTP-Only
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: !isDevelopment,
      path: '/admin',
      sameSite: 'strict',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro na criação do cookie de sessão:', error);
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }
}
