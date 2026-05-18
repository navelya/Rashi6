'use client';
import { useI18n } from '@/lib/i18n';
import styles from './Location.module.css';

export default function Location() {
  const { t } = useI18n();

  return (
    <section className={`section ${styles.location}`} id="location">
      <div className={`orb orb-blue ${styles.orb}`} />
      <div className="container">
        <div className={styles.inner}>
          {/* Left: text */}
          <div className={styles.textCol}>
            <span className="section-label">✦ {t.location.title} ✦</span>
            <h2 className="section-title">{t.location.title}</h2>
            <div className="section-divider" />
            <p className={styles.subtitle}>{t.location.subtitle}</p>
            <p className={styles.desc}>{t.location.desc}</p>

            {/* Highlight chips */}
            <div className={styles.highlights}>
              {t.location.highlights.map((h, i) => (
                <div key={i} className={`glass-card ${styles.highlight}`}>
                  <span className={styles.hlIcon}>{h.icon}</span>
                  <div>
                    <div className={styles.hlValue}>{h.value}</div>
                    <div className={styles.hlLabel}>{h.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Map */}
          <div className={styles.mapCol}>
            <div className={styles.mapWrap}>
              <iframe
                title="Rashi6 Villa Location"
                src="https://maps.google.com/maps?q=Netanya,Israel&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className={styles.map}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className={styles.mapOverlay}>
                <div className={styles.mapPin}>
                  <span>📍</span>
                  <span className={styles.mapPinLabel}>Rashi6 Villa • נתניה</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
