import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const revendaSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  telefone: z.string().min(1),
  empresa: z.string().min(1),
  cnpj: z.string().min(1),
  cidade: z.string().min(1),
  estado: z.string().min(1),
  mensagem: z.string().optional(),
  token: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = revendaSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const { token, ...formData } = parsed.data;

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

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin não inicializado' }, { status: 500 });
    }

    await adminDb.collection('revendas_leads').add({
      ...formData,
      status: 'Novo',
      data: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
