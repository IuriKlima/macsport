import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    // Basic auth check: we expect a Firebase ID token in the Authorization header
    // In a real app with next-firebase-auth or session cookies, you'd verify the cookie.
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    if (!adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin não inicializado' }, { status: 500 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Permissão negada' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada' }, { status: 400 });
    }

    const imgbbKey = process.env.IMGBB_API_KEY;
    if (!imgbbKey) {
      return NextResponse.json({ error: 'Chave do ImgBB não configurada' }, { status: 500 });
    }

    // Proxy para ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({ url: data.data.url });
    } else {
      return NextResponse.json({ error: 'Erro ao enviar para ImgBB' }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
