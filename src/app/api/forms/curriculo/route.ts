import { NextResponse } from 'next/server';
import { z } from 'zod';
import { formsDb, formsStorage } from '@/lib/firebase-forms';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyTurnstile } from '@/lib/turnstile';

const curriculoSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  telefone: z.string().min(1),
  linkedin: z.string().optional(),
  mensagem: z.string().optional(),
  token: z.string(),
}).strict();

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: 'Bad Request' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const formData = await request.formData();
    const data: Record<string, any> = {};
    let file: File | null = null;

    for (const [key, value] of formData.entries()) {
      if (key === 'file') {
        file = value as File;
      } else {
        data[key] = value;
      }
    }

    const parsed = curriculoSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const isValidTurnstile = await verifyTurnstile(parsed.data.token, request);
    if (!isValidTurnstile) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    if (!formsDb || !formsStorage) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }

    let curriculo_url = '';

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const bucket = formsStorage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
      const filename = `curriculos/${Date.now()}_${file.name}`;
      const fileRef = bucket.file(filename);
      
      await fileRef.save(buffer, {
        metadata: { contentType: file.type },
        public: true,
      });

      curriculo_url = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    }

    const { token, ...curriculoData } = parsed.data;

    await formsDb.collection('curriculos').add({
      ...curriculoData,
      curriculo_url,
      status: 'Novo',
      data: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
