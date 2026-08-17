import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    maxAge: 0,
    httpOnly: true,
    secure: !isDevelopment,
    path: '/admin',
    sameSite: 'strict',
  });

  return NextResponse.json({ success: true });
}
