/**
 * Minimal admin auth — a single shared password, no database.
 *
 * The raw password lives only in the ADMIN_PASSWORD env var. On login we
 * store its SHA-256 hash in an httpOnly cookie (the raw password is never
 * put in the cookie), and every protected request compares against it.
 */
import { createHash } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'rashi6_admin';

/** The cookie value a logged-in admin should carry, or null if unconfigured. */
export function adminToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw ? createHash('sha256').update(pw).digest('hex') : null;
}

/** True when the current request carries a valid admin cookie. */
export async function isAuthed(): Promise<boolean> {
  const token = adminToken();
  if (!token) return false;
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  return cookie === token;
}
