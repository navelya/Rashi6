'use client';
import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { useReveal } from './_shared';
import galleryData from '@/data/gallery.json';
import styles from './Gallery.module.css';

const IMAGES: string[] = galleryData;
const FALLBACK =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23d8d2c6"/%3E%3C/svg%3E';

export default function Gallery() {
  const { t } = useI18n();
  const head = useReveal<HTMLDivElement>();
  const [box, setBox] = useState<number | null>(null);

  const close = useCallback(() => setBox(null), []);
  const step = useCallback(
    (dir: number) => setBox((b) => (b === null ? b : (b + dir + IMAGES.length) % IMAGES.length)),
    []
  );

  useEffect(() => {
    if (box === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [box, close, step]);

  return (
    <section className={`v2-section ${styles.gallery}`} id="gallery">
      <div className="v2-container">
        <div className={`v2-reveal ${styles.head}`} ref={head}>
          <span className="v2-eyebrow">{t.nav.gallery}</span>
          <h2 className="v2-h2">{t.gallery.title}</h2>
          <p className="v2-sub">{t.gallery.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {IMAGES.map((src, i) => (
            <button
              key={i}
              className={`${styles.item} ${i === 0 ? styles.featured : ''}`}
              onClick={() => setBox(i)}
              aria-label={`${t.gallery.title} ${i + 1}`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className={styles.img}
                onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK)}
              />
              <span className={styles.zoom}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>

      {box !== null && (
        <div className={styles.lightbox} onClick={close} role="dialog" aria-modal="true">
          <button className={styles.lbClose} onClick={close} aria-label="Close">✕</button>
          <button
            className={`${styles.lbNav} ${styles.lbPrev}`}
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="Previous"
          >‹</button>
          <figure className={styles.lbFigure} onClick={(e) => e.stopPropagation()}>
            <img src={IMAGES[box]} alt="" className={styles.lbImg} />
            <figcaption className={styles.lbCount}>{box + 1} / {IMAGES.length}</figcaption>
          </figure>
          <button
            className={`${styles.lbNav} ${styles.lbNext}`}
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="Next"
          >›</button>
        </div>
      )}
    </section>
  );
}
