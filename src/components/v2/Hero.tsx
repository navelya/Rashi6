'use client';
import { useI18n } from '@/lib/i18n';
import { waLink, WhatsAppIcon } from './_shared';
import styles from './Hero.module.css';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className={styles.hero} id="home">
      <div className={styles.bg}>
        <img src="/assets/images/hero.jpg" alt="" className={styles.bgImg} />
        <div className={styles.overlay} />
      </div>

      <div className={`v2-container ${styles.content}`}>
        <span className={styles.badge}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {t.hero.subtitle}
        </span>

        <h1 className={`v2-display ${styles.title}`}>{t.hero.title}</h1>
        <p className={styles.desc}>{t.hero.desc}</p>

        <div className={styles.ctas}>
          <a href="#book" className={`v2-btn v2-btn-primary ${styles.ctaMain}`}>
            {t.booking.title}
          </a>
          <a
            href={waLink(t.whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            className={`v2-btn ${styles.ctaWa}`}
          >
            <WhatsAppIcon size={19} />
            {t.hero.cta}
          </a>
        </div>

      </div>

      <a href="#features" className={styles.scroll} aria-label={t.hero.scroll}>
        <span className={styles.scrollDot} />
      </a>
    </section>
  );
}
