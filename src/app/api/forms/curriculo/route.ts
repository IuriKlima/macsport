import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getApps } from 'firebase-admin/app';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const nome = formData.get('nome') as string;
    const email = formData.get('email') as string;
    const telefone = formData.get('telefone') as string;
    const linkedin = (formData.get('linkedin') as string) || '';
    const mensagem = (formData.get('mensagem') as string) || '';
    const token = formData.get('token') as string;
    const file = formData.get('file') as File | null;

    if (!nome || !email || !telefone) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    if (token) {
      const secret = process.env.TURNSTILE_SECRET_KEY;
      if (secret) {
        const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${secret}&response=${token}`,
        });
        const verifyJson = await verify.json();
        if (!verifyJson.success) {
          return NextResponse.json({ error: 'Validação de CAPTCHA falhou' }, { status: 400 });
        }
      }
    }

    if (!adminDb || getApps().length === 0) {
      return NextResponse.json({ error: 'Firebase Admin não inicializado' }, { status: 500 });
    }

    let curriculo_url = '';

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const bucket = getStorage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
      const filename = `curriculos/${Date.now()}_${file.name}`;
      const fileRef = bucket.file(filename);
      
      await fileRef.save(buffer, {
        metadata: { contentType: file.type },
        public: true,
      });

      curriculo_url = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    }

    await adminDb.collection('curriculos').add({
      nome,
      email,
      telefone,
      linkedin,
      mensagem,
      curriculo_url,
      status: 'Novo',
      data: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
