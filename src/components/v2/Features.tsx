'use client';
import { useI18n } from '@/lib/i18n';
import { useReveal } from './_shared';
import styles from './Features.module.css';

/* SVG icons mapped to the 8 amenity items by order (replaces locale emoji). */
const ICONS: React.ReactNode[] = [
  // Jacuzzi
  <path key="i" d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4zm4-1V6a2 2 0 014 0M10 8h.01M14 8h.01M18 8h.01" />,
  // Bedrooms
  <path key="i" d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 18h18M3 18v2m18-2v2M7 10V8a2 2 0 012-2h6a2 2 0 012 2v2" />,
  // Privacy / lock
  <path key="i" d="M6 11h12a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1zm2 0V7a4 4 0 018 0v4" />,
  // 2 floors
  <path key="i" d="M3 21h18M5 21V11l7-5 7 5v10M9 21v-5h6v5" />,
  // Garden
  <path key="i" d="M12 22V12m0 0c0-3 2-5 5-5 0 3-2 5-5 5zm0 0c0-3-2-5-5-5 0 3 2 5 5 5zm0-6a4 4 0 110-8 4 4 0 010 8z" />,
  // Netanya / pin
  <path key="i" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z" />,
  // Near the sea
  <path key="i" d="M3 16c2 0 2-1.5 4.5-1.5S10 16 12 16s2-1.5 4.5-1.5S19 16 21 16M3 11c2 0 2-1.5 4.5-1.5S10 11 12 11s2-1.5 4.5-1.5S19 11 21 11M3 21c2 0 2-1.5 4.5-1.5S10 21 12 21" />,
  // Kitchen
  <path key="i" d="M8 3v7a2 2 0 01-2 2v9M5 3v5M8 8h-3M16 3c-1.5 1-2 3-2 5s.5 4 2 5v8" />,
];

export default function Features() {
  const { t } = useI18n();
  const head = useReveal<HTMLDivElement>();

  return (
    <section className={`v2-section ${styles.features}`} id="features">
      <div className="v2-container">
        <div className={`v2-reveal ${styles.head}`} ref={head}>
          <span className="v2-eyebrow">{t.nav.features}</span>
          <h2 className="v2-h2">{t.features.title}</h2>
          <p className="v2-sub">{t.features.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {t.features.items.map((item, i) => (
            <FeatureCard
              key={i}
              icon={ICONS[i % ICONS.length]}
              title={item.title}
              desc={item.desc}
              delay={i * 70}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      className={`v2-reveal ${styles.card}`}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className={styles.icon} aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
    </div>
  );
}
