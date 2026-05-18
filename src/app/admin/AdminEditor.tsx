'use client';
import { useEffect, useState } from 'react';
import type { FaqPayload, LocaleCode, ReviewItem } from '@/lib/contentStore';
import styles from './admin.module.css';

const LANGS: { code: LocaleCode; label: string }[] = [
  { code: 'he', label: 'עברית' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];
const CODES: LocaleCode[] = ['he', 'en', 'fr'];
const MAX_IMAGE_PX = 2000;

type Tab = 'qa' | 'reviews' | 'gallery';
type Msg = { type: 'ok' | 'err'; text: string } | null;
type Diag = {
  repo: string;
  branch: string;
  tokenSet: boolean;
  repoStatus?: number | string;
  branchStatus?: number | string;
  defaultBranch?: string;
  ok: boolean;
  verdict: string;
};

export default function AdminEditor({
  faq: initialFaq,
  reviews: initialReviews,
  gallery: initialGallery,
  mode,
}: {
  faq: FaqPayload;
  reviews: ReviewItem[];
  gallery: string[];
  mode: 'github' | 'local';
}) {
  const [tab, setTab] = useState<Tab>('qa');

  const [faq, setFaq] = useState<FaqPayload>(initialFaq);
  const [faqLang, setFaqLang] = useState<LocaleCode>('he');
  const [faqBusy, setFaqBusy] = useState(false);
  const [faqMsg, setFaqMsg] = useState<Msg>(null);

  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [revBusy, setRevBusy] = useState(false);
  const [revMsg, setRevMsg] = useState<Msg>(null);

  const [gallery, setGallery] = useState<string[]>(initialGallery);
  const [galBusy, setGalBusy] = useState(false);
  const [galMsg, setGalMsg] = useState<Msg>(null);

  const [diag, setDiag] = useState<Diag | null>(null);
  const [diagBusy, setDiagBusy] = useState(false);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#eef0f3';
    return () => { document.body.style.background = prev; };
  }, []);

  function okText(saveMode: string, what: string) {
    return saveMode === 'github'
      ? `${what} Committed to GitHub — Vercel will redeploy in about a minute.`
      : `${what} Saved to local files.`;
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  }

  async function runDiagnose() {
    setDiagBusy(true);
    setDiag(null);
    try {
      const res = await fetch('/api/admin/diagnose');
      setDiag(await res.json());
    } catch {
      setDiag({ repo: '', branch: '', tokenSet: false, ok: false, verdict: 'Could not run the check.' });
    }
    setDiagBusy(false);
  }

  /* ── FAQ ─────────────────────────────────────────────────── */
  function updateFaq(mutate: (d: FaqPayload) => void) {
    setFaq((prev) => {
      const next = structuredClone(prev);
      mutate(next);
      return next;
    });
    setFaqMsg(null);
  }
  function addFaqItem() {
    updateFaq((d) => CODES.forEach((c) => d[c].items.push({ q: '', a: '' })));
  }
  function removeFaqItem(idx: number) {
    updateFaq((d) => CODES.forEach((c) => d[c].items.splice(idx, 1)));
  }
  function moveFaqItem(idx: number, delta: number) {
    updateFaq((d) =>
      CODES.forEach((c) => {
        const arr = d[c].items;
        const j = idx + delta;
        if (j < 0 || j >= arr.length) return;
        [arr[idx], arr[j]] = [arr[j], arr[idx]];
      })
    );
  }
  async function saveFaq() {
    setFaqBusy(true);
    setFaqMsg(null);
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'faq', data: faq }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed.');
      setFaqMsg({ type: 'ok', text: okText(data.mode, 'FAQ saved.') });
    } catch (e) {
      setFaqMsg({ type: 'err', text: e instanceof Error ? e.message : 'Save failed.' });
    }
    setFaqBusy(false);
  }

  /* ── Reviews ─────────────────────────────────────────────── */
  function updateReviews(mutate: (d: ReviewItem[]) => void) {
    setReviews((prev) => {
      const next = structuredClone(prev);
      mutate(next);
      return next;
    });
    setRevMsg(null);
  }
  async function saveReviews() {
    setRevBusy(true);
    setRevMsg(null);
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'reviews', data: reviews }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed.');
      setRevMsg({ type: 'ok', text: okText(data.mode, 'Reviews saved.') });
    } catch (e) {
      setRevMsg({ type: 'err', text: e instanceof Error ? e.message : 'Save failed.' });
    }
    setRevBusy(false);
  }

  /* ── Gallery ─────────────────────────────────────────────── */
  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setGalBusy(true);
    setGalMsg(null);
    let list = gallery;
    let lastMode = mode;
    try {
      for (const file of Array.from(files)) {
        const image = await processImage(file);
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add', image, currentList: list }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed.');
        list = data.gallery;
        lastMode = data.mode;
        setGallery(list);
      }
      setGalMsg({ type: 'ok', text: okText(lastMode, `${files.length} image(s) added.`) });
    } catch (e) {
      setGalMsg({ type: 'err', text: e instanceof Error ? e.message : 'Upload failed.' });
    }
    setGalBusy(false);
  }
  async function deleteImage(path: string) {
    setGalBusy(true);
    setGalMsg(null);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', path, currentList: gallery }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed.');
      setGallery(data.gallery);
      setGalMsg({ type: 'ok', text: okText(data.mode, 'Image removed.') });
    } catch (e) {
      setGalMsg({ type: 'err', text: e instanceof Error ? e.message : 'Delete failed.' });
    }
    setGalBusy(false);
  }

  const curFaq = faq[faqLang];
  const faqDir = faqLang === 'he' ? 'rtl' : 'ltr';

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
          <button className={styles.btnGhost} onClick={runDiagnose} disabled={diagBusy}>
            {diagBusy ? 'Checking…' : 'Check GitHub'}
          </button>
          <button className={styles.btnGhost} onClick={logout}>Log out</button>
        </div>
      </header>

      <div className={styles.body}>
        {diag && (
          <div
            className={diag.ok ? styles.msgOk : styles.msgErr}
            style={{ marginBottom: 18 }}
          >
            <strong>{diag.verdict}</strong>
            <div className={styles.diagDetails}>
              GITHUB_REPO: {diag.repo} &nbsp;·&nbsp; GITHUB_BRANCH: {diag.branch}
              {diag.repoStatus !== undefined && <> &nbsp;·&nbsp; repo check: {diag.repoStatus}</>}
              {diag.branchStatus !== undefined && <> &nbsp;·&nbsp; branch check: {diag.branchStatus}</>}
              {diag.defaultBranch && <> &nbsp;·&nbsp; default branch: {diag.defaultBranch}</>}
            </div>
          </div>
        )}

        <div className={styles.mainTabs}>
          <button
            className={`${styles.mainTab} ${tab === 'qa' ? styles.mainTabOn : ''}`}
            onClick={() => setTab('qa')}
          >
            Q&amp;A
          </button>
          <button
            className={`${styles.mainTab} ${tab === 'reviews' ? styles.mainTabOn : ''}`}
            onClick={() => setTab('reviews')}
          >
            Reviews
          </button>
          <button
            className={`${styles.mainTab} ${tab === 'gallery' ? styles.mainTabOn : ''}`}
            onClick={() => setTab('gallery')}
          >
            Gallery
          </button>
        </div>

        {/* ════════════ Q&A ════════════ */}
        {tab === 'qa' && (
          <>
            <p className={styles.hint}>
              Pick a language, then edit its questions. Adding, deleting or
              reordering a question applies to all three languages at once.
            </p>
            <div className={styles.tabs}>
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  className={`${styles.tab} ${faqLang === l.code ? styles.tabOn : ''}`}
                  onClick={() => setFaqLang(l.code)}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <section className={styles.panel} dir={faqDir}>
              <div className={styles.metaGrid}>
                <Field label="Section title">
                  <input
                    dir={faqDir}
                    value={curFaq.title}
                    onChange={(e) => updateFaq((d) => { d[faqLang].title = e.target.value; })}
                  />
                </Field>
                <Field label="Section subtitle">
                  <input
                    dir={faqDir}
                    value={curFaq.subtitle}
                    onChange={(e) => updateFaq((d) => { d[faqLang].subtitle = e.target.value; })}
                  />
                </Field>
              </div>

              {curFaq.items.map((it, idx) => (
                <div key={idx} className={styles.item}>
                  <ItemHead
                    index={idx}
                    count={curFaq.items.length}
                    onUp={() => moveFaqItem(idx, -1)}
                    onDown={() => moveFaqItem(idx, 1)}
                    onDelete={() => removeFaqItem(idx)}
                  />
                  <Field label="Question">
                    <input
                      dir={faqDir}
                      value={it.q}
                      onChange={(e) =>
                        updateFaq((d) => { d[faqLang].items[idx].q = e.target.value; })
                      }
                    />
                  </Field>
                  <Field label="Answer">
                    <textarea
                      dir={faqDir}
                      rows={3}
                      value={it.a}
                      onChange={(e) =>
                        updateFaq((d) => { d[faqLang].items[idx].a = e.target.value; })
                      }
                    />
                  </Field>
                </div>
              ))}

              <button className={styles.addBtn} onClick={addFaqItem}>+ Add question</button>
            </section>

            {faqMsg && (
              <div className={faqMsg.type === 'ok' ? styles.msgOk : styles.msgErr}>
                {faqMsg.text}
              </div>
            )}
            <div className={styles.saveBar}>
              <button className={styles.btnPrimary} onClick={saveFaq} disabled={faqBusy}>
                {faqBusy ? 'Saving…' : 'Save FAQ'}
              </button>
            </div>
          </>
        )}

        {/* ════════════ REVIEWS ════════════ */}
        {tab === 'reviews' && (
          <>
            <p className={styles.hint}>
              Reviews are shared across all languages — keep each review in the
              language the guest wrote it. They are not translated.
            </p>

            <section className={styles.panel}>
              {reviews.map((it, idx) => (
                <div key={idx} className={styles.item}>
                  <ItemHead
                    index={idx}
                    count={reviews.length}
                    onUp={() =>
                      updateReviews((d) => {
                        if (idx > 0) [d[idx], d[idx - 1]] = [d[idx - 1], d[idx]];
                      })
                    }
                    onDown={() =>
                      updateReviews((d) => {
                        if (idx < d.length - 1) [d[idx], d[idx + 1]] = [d[idx + 1], d[idx]];
                      })
                    }
                    onDelete={() => updateReviews((d) => { d.splice(idx, 1); })}
                  />
                  <div className={styles.rowTwo}>
                    <Field label="Guest name">
                      <input
                        dir="auto"
                        value={it.name}
                        onChange={(e) =>
                          updateReviews((d) => { d[idx].name = e.target.value; })
                        }
                      />
                    </Field>
                    <Field label="Rating" small>
                      <select
                        value={it.rating}
                        onChange={(e) =>
                          updateReviews((d) => { d[idx].rating = Number(e.target.value); })
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
                      dir="auto"
                      rows={3}
                      value={it.text}
                      onChange={(e) =>
                        updateReviews((d) => { d[idx].text = e.target.value; })
                      }
                    />
                  </Field>
                </div>
              ))}

              <button
                className={styles.addBtn}
                onClick={() => updateReviews((d) => { d.push({ name: '', rating: 5, text: '' }); })}
              >
                + Add review
              </button>
            </section>

            {revMsg && (
              <div className={revMsg.type === 'ok' ? styles.msgOk : styles.msgErr}>
                {revMsg.text}
              </div>
            )}
            <div className={styles.saveBar}>
              <button className={styles.btnPrimary} onClick={saveReviews} disabled={revBusy}>
                {revBusy ? 'Saving…' : 'Save reviews'}
              </button>
            </div>
          </>
        )}

        {/* ════════════ GALLERY ════════════ */}
        {tab === 'gallery' && (
          <>
            <p className={styles.hint}>
              Gallery photos are shared across all languages. Adding or removing
              an image is saved immediately. Uploaded photos are auto-resized for
              the web. The first image is shown larger on the site.
            </p>

            <section className={styles.panel}>
              <label className={`${styles.uploadLabel} ${galBusy ? styles.uploadBusy : ''}`}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className={styles.uploadInput}
                  disabled={galBusy}
                  onChange={(e) => {
                    handleUpload(e.target.files);
                    e.target.value = '';
                  }}
                />
                {galBusy ? 'Uploading…' : '+ Add image(s)'}
              </label>

              {galMsg && (
                <div
                  className={galMsg.type === 'ok' ? styles.msgOk : styles.msgErr}
                  style={{ marginTop: 14 }}
                >
                  {galMsg.text}
                </div>
              )}

              <p className={styles.galleryCount}>{gallery.length} photo(s)</p>

              <div className={styles.galleryGrid}>
                {gallery.map((src, idx) => (
                  <div key={src} className={styles.galleryCard}>
                    {idx === 0 && <span className={styles.galleryBadge}>Featured</span>}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className={styles.galleryThumb} />
                    <button
                      className={styles.galleryDel}
                      onClick={() => deleteImage(src)}
                      disabled={galBusy}
                      aria-label="Delete image"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

/* Resize an image client-side (max 2000px, JPEG) → base64 (no data: prefix). */
function processImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const longest = Math.max(width, height);
      if (longest > MAX_IMAGE_PX) {
        const scale = MAX_IMAGE_PX / longest;
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Image processing is not supported in this browser.'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That file could not be read as an image.'));
    };
    img.src = url;
  });
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
