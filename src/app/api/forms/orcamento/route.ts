import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const orcamentoSchema = z.object({
  cliente: z.object({
    nome: z.string().min(1),
    telefone: z.string().min(1),
    email: z.string().email(),
    perfil: z.string(),
    cidade: z.string(),
    estado: z.string(),
    etapa: z.string(),
    mensagem: z.string().optional(),
  }),
  itens: z.array(z.any()),
  token: z.string().optional(), // Turnstile token
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orcamentoSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const { cliente, itens, token } = parsed.data;

    // Validate Turnstile
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

    await adminDb.collection('orcamentos').add({
      cliente,
      itens,
      status: 'Novo',
      data: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
