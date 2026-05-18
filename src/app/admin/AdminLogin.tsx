'use client';
import { useEffect, useState } from 'react';
import styles from './admin.module.css';

export default function AdminLogin({ configured }: { configured: boolean }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#eef0f3';
    return () => { document.body.style.background = prev; };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || 'Login failed.');
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch {
      setErr('Network error — please try again.');
      setBusy(false);
    }
  }

  return (
    <div className={styles.loginWrap}>
      <form className={styles.loginCard} onSubmit={submit}>
        <div className={styles.loginBrand}>Rashi6</div>
        <h1 className={styles.loginTitle}>Content Admin</h1>
        <p className={styles.loginSub}>Sign in to manage the villa&apos;s reviews and FAQ.</p>

        {!configured && (
          <p className={styles.warn}>
            <strong>ADMIN_PASSWORD is not set.</strong> Add it to your environment
            variables (see <code>.env.local.example</code>) before signing in.
          </p>
        )}

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Admin password"
          className={styles.input}
          autoComplete="current-password"
          autoFocus
        />
        {err && <p className={styles.err}>{err}</p>}

        <button type="submit" className={styles.btnPrimary} disabled={busy || !configured}>
          {busy ? 'Checking…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
