/**
 * Content store for the /admin editor.
 *
 * Two save modes, chosen automatically:
 *  - GitHub mode  — when GITHUB_TOKEN + GITHUB_REPO are set, edits are
 *    committed to the repo via the GitHub API (one commit, all locales),
 *    which triggers a Vercel redeploy. This is the production path.
 *  - Local mode   — otherwise, edits are written straight to the locale
 *    JSON files. Works in `next dev`; lets you use the admin before any
 *    GitHub/Vercel setup is done.
 *
 * Only the `reviews` and `faq` blocks are editable; every other key in
 * each locale file is preserved untouched.
 */
import { promises as fs } from 'fs';
import path from 'path';
import heJson from '@/locales/he.json';
import enJson from '@/locales/en.json';
import frJson from '@/locales/fr.json';

export const LOCALES = ['he', 'en', 'fr'] as const;
export type LocaleCode = (typeof LOCALES)[number];

export interface ReviewItem {
  name: string;
  rating: number;
  text: string;
}
export interface FaqItem {
  q: string;
  a: string;
}
export interface EditableSection {
  reviews: { title: string; subtitle: string; items: ReviewItem[] };
  faq: { title: string; subtitle: string; items: FaqItem[] };
}
export type EditablePayload = Record<LocaleCode, EditableSection>;

const FULL: Record<LocaleCode, Record<string, unknown>> = {
  he: heJson as Record<string, unknown>,
  en: enJson as Record<string, unknown>,
  fr: frJson as Record<string, unknown>,
};

/** Pull the editable slice (reviews + faq) out of every locale file. */
export function readEditable(): EditablePayload {
  const out = {} as EditablePayload;
  for (const code of LOCALES) {
    const file = FULL[code] as { reviews: EditableSection['reviews']; faq: EditableSection['faq'] };
    out[code] = {
      reviews: {
        title: file.reviews.title,
        subtitle: file.reviews.subtitle,
        items: file.reviews.items.map((r) => ({ ...r })),
      },
      faq: {
        title: file.faq.title,
        subtitle: file.faq.subtitle,
        items: file.faq.items.map((f) => ({ ...f })),
      },
    };
  }
  return out;
}

/** Merge edits back into the full locale objects and serialize them. */
function buildFiles(payload: EditablePayload): { path: string; content: string }[] {
  return LOCALES.map((code) => {
    const merged = { ...FULL[code], reviews: payload[code].reviews, faq: payload[code].faq };
    return {
      path: `src/locales/${code}.json`,
      content: JSON.stringify(merged, null, 2) + '\n',
    };
  });
}

export async function saveContent(
  payload: EditablePayload,
  summary: string
): Promise<{ mode: 'github' | 'local' }> {
  const files = buildFiles(payload);
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (token && repo) {
    await commitToGitHub(files, summary, token, repo, process.env.GITHUB_BRANCH || 'main');
    return { mode: 'github' };
  }

  // Local fallback — write the files directly (works in `next dev`).
  for (const f of files) {
    await fs.writeFile(path.join(process.cwd(), f.path), f.content, 'utf8');
  }
  return { mode: 'local' };
}

/* ── GitHub commit (Git Data API — one commit for all locale files) ── */

async function gh(url: string, init: RequestInit): Promise<Record<string, unknown>> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 240)}`);
  }
  return res.json();
}

async function commitToGitHub(
  files: { path: string; content: string }[],
  summary: string,
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

  const tree = (await gh(`${api}/git/trees`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      base_tree: baseCommit.tree.sha,
      tree: files.map((f) => ({
        path: f.path,
        mode: '100644',
        type: 'blob',
        content: f.content,
      })),
    }),
  })) as { sha: string };

  const commit = (await gh(`${api}/git/commits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message: summary, tree: tree.sha, parents: [baseSha] }),
  })) as { sha: string };

  await gh(`${api}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ sha: commit.sha }),
  });
}
