import { NextResponse } from 'next/server';
import { z } from 'zod';
import { formsDb } from '@/lib/firebase-forms';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyTurnstile } from '@/lib/turnstile';

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
  }).strict(),
  itens: z.array(z.any()),
  token: z.string(), // Turnstile token required
}).strict();

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 500 * 1024) { // 500KB limit
      return NextResponse.json({ error: 'Bad Request' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const body = await request.json();
    const parsed = orcamentoSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const { cliente, itens, token } = parsed.data;

    const isValidTurnstile = await verifyTurnstile(token, request);
    if (!isValidTurnstile) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    if (!formsDb) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }

    await formsDb.collection('orcamentos').add({
      cliente,
      itens,
      status: 'Novo',
      data: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
