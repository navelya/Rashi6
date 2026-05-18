'use client';
import { useI18n } from '@/lib/i18n';
import { useReveal, waLink, WhatsAppIcon } from './_shared';
import styles from './CTA.module.css';

export default function CTA() {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className={styles.cta} id="contact">
      <div className={styles.bg}>
        <img src="/assets/images/cta-bg.jpg" alt="" className={styles.bgImg} />
        <div className={styles.overlay} />
      </div>

      <div className={`v2-container v2-reveal ${styles.content}`} ref={ref}>
        <h2 className={`v2-display ${styles.title}`}>{t.cta.title}</h2>
        <p className={styles.desc}>{t.cta.desc}</p>

        <div className={styles.actions}>
          <a href="#book" className={`v2-btn v2-btn-primary ${styles.btn}`}>
            {t.booking.title}
          </a>
          <a
            href={waLink(t.whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            className={`v2-btn v2-btn-wa ${styles.btn}`}
          >
            <WhatsAppIcon size={20} />
            {t.cta.btn}
          </a>
        </div>

        <ul className={styles.trust}>
          <li>{t.labels.quickReply}</li>
          <li>{t.labels.noFees}</li>
          <li>{t.labels.directPrice}</li>
        </ul>
      </div>
    </section>
  );
}
