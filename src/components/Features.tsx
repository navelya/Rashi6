'use client';
import { useI18n } from '@/lib/i18n';
import styles from './Features.module.css';

export default function Features() {
  const { t } = useI18n();

  return (
    <section className={`section ${styles.features}`} id="features">
      {/* Background orbs */}
      <div className={`orb orb-blue ${styles.orb1}`} />
      <div className={`orb orb-gold ${styles.orb2}`} />

      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-label">✦ {t.features.title} ✦</span>
          <h2 className="section-title">{t.features.title}</h2>
          <div className="section-divider" style={{ margin: '0 auto 1rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            {t.features.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {t.features.items.map((item, i) => (
            <div
              key={i}
              className={`glass-card ${styles.card}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{item.icon}</span>
                <div className={styles.iconGlow} />
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
