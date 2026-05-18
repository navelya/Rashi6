'use client';
import { useEffect, useState } from 'react';
import type { EditablePayload, LocaleCode } from '@/lib/contentStore';
import styles from './admin.module.css';

const LANGS: { code: LocaleCode; label: string }[] = [
  { code: 'he', label: 'עברית' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];
const CODES: LocaleCode[] = ['he', 'en', 'fr'];

type Section = 'reviews' | 'faq';
type Msg = { type: 'ok' | 'err'; text: string };

export default function AdminEditor({
  initialContent,
  mode,
}: {
  initialContent: EditablePayload;
  mode: 'github' | 'local';
}) {
  const [content, setContent] = useState<EditablePayload>(initialContent);
  const [lang, setLang] = useState<LocaleCode>('he');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg | null>(null);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#eef0f3';
    return () => { document.body.style.background = prev; };
  }, []);

  const cur = content[lang];
  const dir = lang === 'he' ? 'rtl' : 'ltr';

  /** Apply a mutation to a fresh clone of the content tree. */
  function update(mutate: (draft: EditablePayload) => void) {
    setContent((prev) => {
      const next = structuredClone(prev);
      mutate(next);
      return next;
    });
    setMsg(null);
  }

  /* Structural edits apply to ALL languages so the lists stay parallel. */
  function addItem(section: Section) {
    update((d) => {
      CODES.forEach((c) => {
        if (section === 'reviews') d[c].reviews.items.push({ name: '', rating: 5, text: '' });
        else d[c].faq.items.push({ q: '', a: '' });
      });
    });
  }
  function removeItem(section: Section, idx: number) {
    update((d) => CODES.forEach((c) => d[c][section].items.splice(idx, 1)));
  }
  function moveItem(section: Section, idx: number, delta: number) {
    update((d) =>
      CODES.forEach((c) => {
        const arr = d[c][section].items as unknown[];
        const j = idx + delta;
        if (j < 0 || j >= arr.length) return;
        [arr[idx], arr[j]] = [arr[j], arr[idx]];
      })
    );
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: 'err', text: data.error || 'Save failed.' });
      } else if (data.mode === 'github') {
        setMsg({
          type: 'ok',
          text: 'Saved and committed to GitHub. Vercel will redeploy in about a minute.',
        });
      } else {
        setMsg({
          type: 'ok',
          text: 'Saved to local files. Commit & push (or restart dev) to see it deployed.',
        });
      }
    } catch {
      setMsg({ type: 'err', text: 'Network error — changes were not saved.' });
    }
    setBusy(false);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <strong>Rashi6</strong>
          <span>Content Admin</span>
          <span className={mode === 'github' ? styles.badgeGh : styles.badgeLocal}>
            {mode === 'github' ? 'GitHub · auto-deploy' : 'Local files'}
          </span>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnGhost} onClick={logout}>Log out</button>
          <button className={styles.btnPrimary} onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {msg && (
          <div className={msg.type === 'ok' ? styles.msgOk : styles.msgErr}>{msg.text}</div>
        )}

        <p className={styles.hint}>
          Add, remove and reorder items once — those changes apply to all three
          languages. Text fields are edited per language using the tabs below.
        </p>

        <div className={styles.tabs}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`${styles.tab} ${lang === l.code ? styles.tabOn : ''}`}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* ── REVIEWS ──────────────────────────────────────────── */}
        <section className={styles.panel} dir={dir}>
          <h2 className={styles.panelTitle}>{cur.reviews.title || 'Reviews'}</h2>

          <div className={styles.metaGrid}>
            <Field label="Section title">
              <input
                dir={dir}
                value={cur.reviews.title}
                onChange={(e) => update((d) => { d[lang].reviews.title = e.target.value; })}
              />
            </Field>
            <Field label="Section subtitle">
              <input
                dir={dir}
                value={cur.reviews.subtitle}
                onChange={(e) => update((d) => { d[lang].reviews.subtitle = e.target.value; })}
              />
            </Field>
          </div>

          {cur.reviews.items.map((it, idx) => (
            <div key={idx} className={styles.item}>
              <ItemHead
                index={idx}
                count={cur.reviews.items.length}
                onUp={() => moveItem('reviews', idx, -1)}
                onDown={() => moveItem('reviews', idx, 1)}
                onDelete={() => removeItem('reviews', idx)}
              />
              <div className={styles.rowTwo}>
                <Field label="Guest name">
                  <input
                    dir={dir}
                    value={it.name}
                    onChange={(e) =>
                      update((d) => { d[lang].reviews.items[idx].name = e.target.value; })
                    }
                  />
                </Field>
                <Field label="Rating" small>
                  <select
                    value={it.rating}
                    onChange={(e) =>
                      update((d) => {
                        d[lang].reviews.items[idx].rating = Number(e.target.value);
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} ★</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Review text">
                <textarea
                  dir={dir}
                  rows={3}
                  value={it.text}
                  onChange={(e) =>
                    update((d) => { d[lang].reviews.items[idx].text = e.target.value; })
                  }
                />
              </Field>
            </div>
          ))}

          <button className={styles.addBtn} onClick={() => addItem('reviews')}>
            + Add review
          </button>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className={styles.panel} dir={dir}>
          <h2 className={styles.panelTitle}>{cur.faq.title || 'FAQ'}</h2>

          <div className={styles.metaGrid}>
            <Field label="Section title">
              <input
                dir={dir}
                value={cur.faq.title}
                onChange={(e) => update((d) => { d[lang].faq.title = e.target.value; })}
              />
            </Field>
            <Field label="Section subtitle">
              <input
                dir={dir}
                value={cur.faq.subtitle}
                onChange={(e) => update((d) => { d[lang].faq.subtitle = e.target.value; })}
              />
            </Field>
          </div>

          {cur.faq.items.map((it, idx) => (
            <div key={idx} className={styles.item}>
              <ItemHead
                index={idx}
                count={cur.faq.items.length}
                onUp={() => moveItem('faq', idx, -1)}
                onDown={() => moveItem('faq', idx, 1)}
                onDelete={() => removeItem('faq', idx)}
              />
              <Field label="Question">
                <input
                  dir={dir}
                  value={it.q}
                  onChange={(e) =>
                    update((d) => { d[lang].faq.items[idx].q = e.target.value; })
                  }
                />
              </Field>
              <Field label="Answer">
                <textarea
                  dir={dir}
                  rows={3}
                  value={it.a}
                  onChange={(e) =>
                    update((d) => { d[lang].faq.items[idx].a = e.target.value; })
                  }
                />
              </Field>
            </div>
          ))}

          <button className={styles.addBtn} onClick={() => addItem('faq')}>
            + Add question
          </button>
        </section>

        <div className={styles.saveBar}>
          <button className={styles.btnPrimary} onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  small,
  children,
}: {
  label: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={small ? styles.fieldSm : styles.field}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function ItemHead({
  index,
  count,
  onUp,
  onDown,
  onDelete,
}: {
  index: number;
  count: number;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={styles.itemHead}>
      <span className={styles.itemNum}>#{index + 1}</span>
      <div className={styles.itemCtrls}>
        <button onClick={onUp} disabled={index === 0} aria-label="Move up">↑</button>
        <button onClick={onDown} disabled={index === count - 1} aria-label="Move down">↓</button>
        <button className={styles.del} onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
