import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { saveContent, type EditablePayload } from '@/lib/contentStore';

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: { content?: EditablePayload; summary?: string };
  try {
    body = (await req.json()) as { content?: EditablePayload; summary?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body.content) {
    return NextResponse.json({ error: 'Missing content.' }, { status: 400 });
  }

  try {
    const result = await saveContent(
      body.content,
      body.summary?.trim() || 'Update reviews & FAQ via admin'
    );
    return NextResponse.json({ ok: true, mode: result.mode });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Save failed.' },
      { status: 500 }
    );
  }
}
