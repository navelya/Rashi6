'use client';
import { useI18n } from '@/lib/i18n';
import { useReveal } from './_shared';
import styles from './Location.module.css';

/* Map is intentionally city-level — it shows the villa is in Netanya
   without pinning the exact address. */
const MAP_SRC = `https://maps.google.com/maps?q=Netanya,Israel&z=13&hl=en&output=embed`;
const MAP_LINK = `https://www.google.com/maps/place/Netanya,+Israel`;

/* SVG icons for the 4 distance highlights, by order. */
const HL_ICONS: React.ReactNode[] = [
  <path key="i" d="M12 3a6 6 0 016 6c0 1-9 12-9 12M12 3a6 6 0 00-6 6M5 21h14M12 9v0" />,
  <path key="i" d="M6 2l-2 5v13a1 1 0 001 1h14a1 1 0 001-1V7l-2-5zM4 7h16M9 11a3 3 0 006 0" />,
  <path key="i" d="M17.8 19.2L16 11l3.5-3.5a2.1 2.1 0 00-3-3L13 8 4.8 6.2l-1.5 1.5L9 11l-3 3-3-1-1 1 4 2 2 4 1-1-1-3 3-3 3.3 5.7z" />,
  <path key="i" d="M8 3h8a3 3 0 013 3v9a3 3 0 01-3 3H8a3 3 0 01-3-3V6a3 3 0 013-3zM5 11h14M9 22l-2-3m10 3l-2-3M9.5 15h.01M14.5 15h.01" />,
];

export default function Location() {
  const { t } = useI18n();
  const left = useReveal<HTMLDivElement>();
  const right = useReveal<HTMLDivElement>();

  return (
    <section className={`v2-section ${styles.location}`} id="location">
      <div className="v2-container">
        <div className={styles.inner}>
          <div className={`v2-reveal ${styles.text}`} ref={left}>
            <span className="v2-eyebrow">{t.nav.location}</span>
            <h2 className="v2-h2">{t.location.title}</h2>
            <p className={styles.lead}>{t.location.subtitle}</p>
            <p className={styles.desc}>{t.location.desc}</p>

            <div className={styles.highlights}>
              {t.location.highlights.map((h, i) => (
                <div key={i} className={styles.hl}>
                  <span className={styles.hlIcon} aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      {HL_ICONS[i % HL_ICONS.length]}
                    </svg>
                  </span>
                  <div>
                    <div className={styles.hlValue}>{h.value}</div>
                    <div className={styles.hlLabel}>{h.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className={styles.directions}>
              {t.nav.location}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          <div className={`v2-reveal ${styles.mapWrap}`} ref={right}>
            <iframe
              title="Netanya, Israel"
              src={MAP_SRC}
              className={styles.map}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
