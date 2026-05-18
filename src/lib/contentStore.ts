/**
 * Content store for the /admin editor.
 *
 * Three independently-saved content areas:
 *  - FAQ      — per language, lives in src/locales/{he,en,fr}.json → `faq`
 *  - Reviews  — shared across languages, src/data/reviews.json
 *  - Gallery  — shared, src/data/gallery.json (+ image files in public/)
 *
 * Two persistence modes, chosen automatically:
 *  - GitHub  — when GITHUB_TOKEN + GITHUB_REPO are set, changes are
 *    committed via the GitHub API (triggers a Vercel redeploy).
 *  - Local   — otherwise, files are written directly (works in `next dev`).
 */
import { promises as fs } from 'fs';
import path from 'path';
import heJson from '@/locales/he.json';
import enJson from '@/locales/en.json';
import frJson from '@/locales/fr.json';
import reviewsJson from '@/data/reviews.json';
import galleryJson from '@/data/gallery.json';

export const LOCALES = ['he', 'en', 'fr'] as const;
export type LocaleCode = (typeof LOCALES)[number];

export interface FaqItem {
  q: string;
  a: string;
}
export interface FaqSection {
  title: string;
  subtitle: string;
  items: FaqItem[];
}
export type FaqPayload = Record<LocaleCode, FaqSection>;

export interface ReviewItem {
  name: string;
  rating: number;
  text: string;
}

const FULL: Record<LocaleCode, Record<string, unknown>> = {
  he: heJson as Record<string, unknown>,
  en: enJson as Record<string, unknown>,
  fr: frJson as Record<string, unknown>,
};

/* ── Readers ─────────────────────────────────────────────────── */

export function readFaq(): FaqPayload {
  const out = {} as FaqPayload;
  for (const code of LOCALES) {
    const faq = (FULL[code] as { faq: FaqSection }).faq;
    out[code] = {
      title: faq.title,
      subtitle: faq.subtitle,
      items: faq.items.map((i) => ({ ...i })),
    };
  }
  return out;
}

export function readReviews(): ReviewItem[] {
  return (reviewsJson as ReviewItem[]).map((r) => ({ ...r }));
}

export function readGallery(): string[] {
  return [...(galleryJson as string[])];
}

/* ── Savers ──────────────────────────────────────────────────── */

export function saveFaq(payload: FaqPayload) {
  const files = LOCALES.map((code) => ({
    path: `src/locales/${code}.json`,
    content: JSON.stringify({ ...FULL[code], faq: payload[code] }, null, 2) + '\n',
  }));
  return persist(files, 'Update FAQ via admin');
}

export function saveReviews(items: ReviewItem[]) {
  return persist(
    [{ path: 'src/data/reviews.json', content: JSON.stringify(items, null, 2) + '\n' }],
    'Update reviews via admin'
  );
}

export async function addGalleryImage(currentList: string[], imageBase64: string) {
  const filename = `gallery-${Date.now()}.jpg`;
  const list = [...currentList, `/assets/images/${filename}`];
  const result = await persist(
    [
      { path: `public/assets/images/${filename}`, content: imageBase64, binary: true },
      { path: 'src/data/gallery.json', content: JSON.stringify(list, null, 2) + '\n' },
    ],
    `Add gallery image ${filename}`
  );
  return { ...result, gallery: list };
}

export async function removeGalleryImage(currentList: string[], target: string) {
  const list = currentList.filter((g) => g !== target);
  const result = await persist(
    [{ path: 'src/data/gallery.json', content: JSON.stringify(list, null, 2) + '\n' }],
    'Remove gallery image via admin'
  );
  return { ...result, gallery: list };
}

/* ── Persistence ─────────────────────────────────────────────── */

interface OutFile {
  path: string;
  content: string; // utf-8 text, or base64 when `binary`
  binary?: boolean;
}

async function persist(files: OutFile[], message: string): Promise<{ mode: 'github' | 'local' }> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (token && repo) {
    await commitToGitHub(files, message, token, repo, process.env.GITHUB_BRANCH || 'main');
    return { mode: 'github' };
  }

  for (const f of files) {
    const full = path.join(process.cwd(), f.path);
    await fs.mkdir(path.dirname(full), { recursive: true });
    if (f.binary) await fs.writeFile(full, Buffer.from(f.content, 'base64'));
    else await fs.writeFile(full, f.content, 'utf8');
  }
  return { mode: 'local' };
}

async function gh(url: string, init: RequestInit): Promise<Record<string, unknown>> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 240)}`);
  }
  return res.json();
}

async function commitToGitHub(
  files: OutFile[],
  message: string,
  token: string,
  repo: string,
  branch: string
): Promise<void> {
  const api = `https://api.github.com/repos/${repo}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const ref = (await gh(`${api}/git/ref/heads/${branch}`, { headers })) as {
    object: { sha: string };
  };
  const baseSha = ref.object.sha;
  const baseCommit = (await gh(`${api}/git/commits/${baseSha}`, { headers })) as {
    tree: { sha: string };
  };

  // Text files go in the tree inline; binary files need a base64 blob first.
  const treeEntries: Record<string, unknown>[] = [];
  for (const f of files) {
    if (f.binary) {
      const blob = (await gh(`${api}/git/blobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: f.content, encoding: 'base64' }),
      })) as { sha: string };
      treeEntries.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
    } else {
      treeEntries.push({ path: f.path, mode: '100644', type: 'blob', content: f.content });
    }
  }

  const tree = (await gh(`${api}/git/trees`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: treeEntries }),
  })) as { sha: string };

  const commit = (await gh(`${api}/git/commits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, tree: tree.sha, parents: [baseSha] }),
  })) as { sha: string };

  await gh(`${api}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ sha: commit.sha }),
  });
}
