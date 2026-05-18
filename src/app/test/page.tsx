'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './test-index.module.css';

const VARIANTS = [
  {
    slug: 'mediterranean',
    name: 'Light Mediterranean',
    desc: 'Warm ivory and sand tones with a deep teal accent and soft terracotta. Bright, airy and boutique — the natural fit for a coastal villa.',
    swatches: ['#fbf8f2', '#1f6f6b', '#c8714c', '#2a2521'],
    font: 'Rubik',
  },
  {
    slug: 'coastal',
    name: 'Soft Coastal White',
    desc: 'Crisp white with an ocean-blue accent and sandy beige. Minimal, fresh and generous with whitespace.',
    swatches: ['#ffffff', '#2e6fa8', '#b89a6d', '#16202b'],
    font: 'Rubik',
  },
  {
    slug: 'dark',
    name: 'Refined Warm Dark',
    desc: 'Warm espresso and charcoal with champagne gold and sage. A moody, intimate take on understated luxury.',
    swatches: ['#1a1714', '#c9a86a', '#7d8c7a', '#f2ebe0'],
    font: 'Rubik',
  },
];

export default function TestIndex() {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#15140f';
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <header className={styles.head}>
        <span className={styles.eyebrow}>Rashi6 Villa · Redesign Preview</span>
        <h1 className={styles.title}>Three new looks for the villa landing page</h1>
        <p className={styles.lead}>
          The full page was rebuilt from scratch — new layout, new booking flow with a date
          picker and a redesigned map. Pick a theme below to preview the live page.
        </p>
      </header>

      <div className={styles.grid}>
        {VARIANTS.map((v) => (
          <Link key={v.slug} href={`/test/${v.slug}`} className={styles.card}>
            <div
              className={styles.preview}
              style={{ background: v.swatches[0] }}
            >
              <span
                className={styles.previewName}
                style={{ color: v.swatches[3], fontFamily: `'${v.font}', sans-serif` }}
              >
                Rashi6
              </span>
              <span className={styles.previewBar} style={{ background: v.swatches[1] }} />
              <span className={styles.previewChip} style={{ background: v.swatches[2] }} />
            </div>
            <div className={styles.body}>
              <h2 className={styles.cardName}>{v.name}</h2>
              <p className={styles.cardDesc}>{v.desc}</p>
              <div className={styles.swatches}>
                {v.swatches.map((c) => (
                  <span key={c} className={styles.dot} style={{ background: c }} />
                ))}
              </div>
              <span className={styles.view}>
                View this page
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className={styles.note}>
        Booking widget · live date-range calendar · guest count · WhatsApp hand-off ·
        Google Map at 32.3298°N, 34.8532°E
      </p>
    </div>
  );
}
