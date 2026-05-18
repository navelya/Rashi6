'use client';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useReveal } from './_shared';
import styles from './FAQ.module.css';

export default function FAQ() {
  const { t } = useI18n();
  const head = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={`v2-section ${styles.faq}`} id="faq">
      <div className="v2-container">
        <div className={`v2-reveal ${styles.head}`} ref={head}>
          <span className="v2-eyebrow">{t.nav.faq}</span>
          <h2 className="v2-h2">{t.faq.title}</h2>
          <p className="v2-sub">{t.faq.subtitle}</p>
        </div>

        <div className={styles.list}>
          {t.faq.items.map((item, i) => (
            <Item
              key={i}
              q={item.q}
              a={item.a}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
              delay={i * 55}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Item({
  q,
  a,
  isOpen,
  onToggle,
  delay,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      className={`v2-reveal ${styles.item} ${isOpen ? styles.itemOpen : ''}`}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button type="button" className={styles.q} onClick={onToggle} aria-expanded={isOpen}>
        <span>{q}</span>
        <span className={styles.chevron} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div className={styles.answer}>
        <div className={styles.answerInner}>
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}
