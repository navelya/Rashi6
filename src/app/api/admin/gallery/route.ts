import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';
import { addGalleryImage, removeGalleryImage } from '@/lib/contentStore';

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: { action?: string; currentList?: string[]; image?: string; path?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const list = Array.isArray(body.currentList) ? body.currentList : [];

  try {
    if (body.action === 'add') {
      if (!body.image) {
        return NextResponse.json({ error: 'Missing image data.' }, { status: 400 });
      }
      const r = await addGalleryImage(list, body.image);
      return NextResponse.json({ ok: true, mode: r.mode, gallery: r.gallery });
    }
    if (body.action === 'delete') {
      if (!body.path) {
        return NextResponse.json({ error: 'Missing image path.' }, { status: 400 });
      }
      const r = await removeGalleryImage(list, body.path);
      return NextResponse.json({ ok: true, mode: r.mode, gallery: r.gallery });
    }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Gallery update failed.' },
      { status: 500 }
    );
  }
}
