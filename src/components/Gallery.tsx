'use client';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import styles from './Gallery.module.css';

// These are the images users should place in /public/assets/images/
// Named gallery-1.jpg through gallery-9.jpg
const GALLERY_IMAGES = [
  { src: '/assets/images/gallery-1.jpg', alt: 'Villa exterior' },
  { src: '/assets/images/gallery-2.jpg', alt: 'Jacuzzi' },
  { src: '/assets/images/gallery-3.jpg', alt: 'Garden' },
  { src: '/assets/images/gallery-4.jpg', alt: 'Living room' },
  { src: '/assets/images/gallery-5.jpg', alt: 'Bedroom' },
  { src: '/assets/images/gallery-6.jpg', alt: 'Kitchen' },
  { src: '/assets/images/gallery-7.jpg', alt: 'Bedroom 2' },
  { src: '/assets/images/gallery-8.jpg', alt: 'Outdoor area' },
  { src: '/assets/images/gallery-9.jpg', alt: 'View' },
  { src: '/assets/images/gallery-10.jpg', alt: 'Interior view' },
  { src: '/assets/images/gallery-11.jpg', alt: 'Bedroom 3' },
  { src: '/assets/images/gallery-12.jpg', alt: 'Bathroom' },
  { src: '/assets/images/gallery-13.jpg', alt: 'Pool / Jacuzzi area' },
  { src: '/assets/images/gallery-14.jpg', alt: 'Outdoor view' },
  { src: '/assets/images/gallery-15.jpg', alt: 'Garden path' },
  { src: '/assets/images/gallery-16.jpg', alt: 'Bedroom 4' },
  { src: '/assets/images/gallery-17.jpg', alt: 'Terrace' },
];

export default function Gallery() {
  const { t } = useI18n();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((l) => (l! > 0 ? l! - 1 : GALLERY_IMAGES.length - 1));
  const next = () => setLightbox((l) => (l! < GALLERY_IMAGES.length - 1 ? l! + 1 : 0));

  return (
    <section className={`section ${styles.gallery}`} id="gallery">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-label">✦ {t.gallery.title} ✦</span>
          <h2 className="section-title">{t.gallery.title}</h2>
          <div className="section-divider" style={{ margin: '0 auto 1rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={i}
              className={`${styles.item} ${i === 0 ? styles.featured : ''}`}
              onClick={() => setLightbox(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className={styles.img}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%230c1120"/><text x="50%25" y="50%25" fill="%23475569" text-anchor="middle" font-size="14" dy=".3em">${img.alt}</text></svg>`;
                }}
              />
              <div className={styles.overlay}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button className={`${styles.lbNav} ${styles.lbPrev}`} onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>
          <div className={styles.lbContent} onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY_IMAGES[lightbox].src} alt={GALLERY_IMAGES[lightbox].alt} className={styles.lbImage} />
            <div className={styles.lbCaption}>
              {lightbox + 1} / {GALLERY_IMAGES.length}
            </div>
          </div>
          <button className={`${styles.lbNav} ${styles.lbNext}`} onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">›</button>
          <button className={styles.lbClose} onClick={() => setLightbox(null)} aria-label="Close">✕</button>
        </div>
      )}
    </section>
  );
}
