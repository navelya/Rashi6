import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, adminToken } from '@/lib/adminAuth';

export async function POST(req: Request) {
  const token = adminToken();
  if (!token) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured on the server.' },
      { status: 500 }
    );
  }

  let password = '';
  try {
    password = ((await req.json()) as { password?: string }).password ?? '';
  } catch {
    /* empty / invalid body — treated as wrong password below */
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}
