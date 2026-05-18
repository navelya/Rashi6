import type { Metadata } from 'next';
import { isAuthed } from '@/lib/adminAuth';
import { readFaq, readReviews, readGallery } from '@/lib/contentStore';
import AdminLogin from './AdminLogin';
import AdminEditor from './AdminEditor';

export const metadata: Metadata = {
  title: 'Rashi6 — Content Admin',
  robots: { index: false, follow: false },
};

// Reads cookies + env at request time — never prerender.
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isAuthed())) {
    return <AdminLogin configured={!!process.env.ADMIN_PASSWORD} />;
  }

  const mode: 'github' | 'local' =
    process.env.GITHUB_TOKEN && process.env.GITHUB_REPO ? 'github' : 'local';

  return (
    <AdminEditor
      faq={readFaq()}
      reviews={readReviews()}
      gallery={readGallery()}
      mode={mode}
    />
  );
}
