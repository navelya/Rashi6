import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { saveFaq, saveReviews, type FaqPayload, type ReviewItem } from '@/lib/contentStore';

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: { section?: string; data?: unknown };
  try {
    body = (await req.json()) as { section?: string; data?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    if (body.section === 'faq') {
      const r = await saveFaq(body.data as FaqPayload);
      return NextResponse.json({ ok: true, mode: r.mode });
    }
    if (body.section === 'reviews') {
      const r = await saveReviews(body.data as ReviewItem[]);
      return NextResponse.json({ ok: true, mode: r.mode });
    }
    return NextResponse.json({ error: 'Unknown section.' }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Save failed.' },
      { status: 500 }
    );
  }
}
