'use client';
import { useI18n } from '@/lib/i18n';
import { useReveal } from './_shared';
import reviewsData from '@/data/reviews.json';
import styles from './Reviews.module.css';

function Stars({ n }: { n: number }) {
  return (
    <span className={styles.stars} aria-label={`${n} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < n ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

export default function Reviews() {
  const { t } = useI18n();
  const head = useReveal<HTMLDivElement>();
  const banner = useReveal<HTMLDivElement>();

  return (
    <section className={`v2-section ${styles.reviews}`} id="reviews">
      <div className="v2-container">
        <div className={`v2-reveal ${styles.head}`} ref={head}>
          <span className="v2-eyebrow">{t.nav.reviews}</span>
          <h2 className="v2-h2">{t.reviews.title}</h2>
          <p className="v2-sub">{t.reviews.subtitle}</p>
        </div>

        <div className={`v2-reveal ${styles.banner}`} ref={banner}>
          <div className={styles.score}>
            <span className={`v2-display ${styles.scoreNum}`}>5.0</span>
            <div>
              <Stars n={5} />
              <p className={styles.scoreLabel}>{t.labels.avgRating}</p>
            </div>
          </div>
          <span className={styles.host}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" />
            </svg>
            {t.labels.superhost}
          </span>
        </div>

        <div className={styles.grid}>
          {reviewsData.map((r, i) => (
            <Card key={i} review={r} verified={t.labels.verifiedGuest} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  review,
  verified,
  delay,
}: {
  review: { name: string; rating: number; text: string };
  verified: string;
  delay: number;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <article className={`v2-reveal ${styles.card}`} ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      <Stars n={review.rating} />
      <p className={styles.text}>&ldquo;{review.text}&rdquo;</p>
      <div className={styles.author}>
        <span className={styles.avatar}>{review.name.charAt(0)}</span>
        <div>
          <div className={styles.name}>{review.name}</div>
          <div className={styles.verified}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {verified}
          </div>
        </div>
      </div>
    </article>
  );
}
