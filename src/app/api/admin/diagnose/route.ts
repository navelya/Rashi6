import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/adminAuth';

/**
 * Checks the GitHub connection used for auto-commit and returns a
 * plain-language verdict so misconfiguration is easy to pinpoint.
 */
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const repo = process.env.GITHUB_REPO || '';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN || '';

  const out: {
    repo: string;
    branch: string;
    tokenSet: boolean;
    repoStatus?: number | string;
    branchStatus?: number | string;
    defaultBranch?: string;
    canWrite?: boolean;
    ok: boolean;
    verdict: string;
  } = { repo: repo || '(not set)', branch, tokenSet: !!token, ok: false, verdict: '' };

  if (!token || !repo) {
    out.verdict = !token && !repo
      ? 'GITHUB_TOKEN and GITHUB_REPO are not set — the admin is running in local-file mode.'
      : !token
        ? 'GITHUB_TOKEN is not set.'
        : 'GITHUB_REPO is not set.';
    return NextResponse.json(out);
  }

  if (repo.includes('://') || repo.endsWith('.git') || repo.split('/').length !== 2) {
    out.verdict =
      `GITHUB_REPO must be exactly "owner/repo" — no https://, no .git, no trailing slash. Current value: "${repo}".`;
    return NextResponse.json(out);
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    out.repoStatus = repoRes.status;
    if (repoRes.ok) {
      const j = (await repoRes.json()) as {
        default_branch?: string;
        permissions?: { push?: boolean };
      };
      out.defaultBranch = j.default_branch;
      out.canWrite = !!j.permissions?.push;
    }

    const branchRes = await fetch(
      `https://api.github.com/repos/${repo}/git/ref/heads/${branch}`,
      { headers }
    );
    out.branchStatus = branchRes.status;
  } catch {
    out.verdict = 'Could not reach api.github.com (network error).';
    return NextResponse.json(out);
  }

  if (out.repoStatus === 401) {
    out.verdict = 'The token is invalid or expired. Generate a new token and update GITHUB_TOKEN in Vercel.';
  } else if (out.repoStatus === 403) {
    out.verdict = 'GitHub returned 403 — the token is blocked (org policy on fine-grained tokens, or rate limit).';
  } else if (out.repoStatus === 404) {
    out.verdict =
      `Repo "${repo}" is not reachable with this token. Either the name is wrong, or — most likely — the fine-grained token was not granted access to it. Fix: GitHub → Settings → Developer settings → Fine-grained tokens → your token → Repository access → select this repo; Permissions → Contents → Read and write.`;
  } else if (out.repoStatus === 200 && out.canWrite === false) {
    out.verdict =
      'The token can read the repo but cannot write to it. Set its Contents permission to "Read and write".';
  } else if (out.repoStatus === 200 && out.branchStatus === 404) {
    out.verdict =
      `The repo is reachable, but branch "${branch}" does not exist. This repo's default branch is "${out.defaultBranch}". Set GITHUB_BRANCH=${out.defaultBranch} in Vercel and redeploy.`;
  } else if (out.repoStatus === 200 && out.branchStatus === 200) {
    out.ok = true;
    out.verdict = 'Connection OK — saving should work. If a save still fails, redeploy so the latest env vars take effect.';
  } else {
    out.verdict = `Unexpected result — repo check: ${out.repoStatus}, branch check: ${out.branchStatus}.`;
  }

  return NextResponse.json(out);
}
