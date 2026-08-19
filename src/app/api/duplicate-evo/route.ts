import { NextResponse } from 'next/server';
import { verifyLocalAdmin } from '@/lib/admin-check';

export async function GET() {
  await verifyLocalAdmin();
  return new NextResponse(null, { status: 404 });
}
