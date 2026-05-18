'use client';
import { useI18n } from '@/lib/i18n';
import styles from './Reviews.module.css';

export default function Reviews() {
  const { t } = useI18n();

  return (
    <section className={`section ${styles.reviews}`} id="reviews">
      <div className={`orb orb-gold ${styles.orb}`} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="section-label">✦ {t.reviews.title} ✦</span>
          <h2 className="section-title">{t.reviews.title}</h2>
          <div className="section-divider" style={{ margin: '0 auto 1rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            {t.reviews.subtitle}
          </p>
        </div>

        {/* Overall rating banner */}
        <div className={styles.ratingBanner}>
          <div className={styles.ratingScore}>5.0</div>
          <div className={styles.ratingDetails}>
            <div className="stars">★★★★★</div>
            <div className={styles.ratingLabel}>{t.labels.avgRating}</div>
          </div>
          <div className={styles.ratingBadge}>
            <span>🏆</span>
            <span>{t.labels.superhost}</span>
          </div>
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {t.reviews.items.map((review, i) => (
            <div key={i} className={`glass-card ${styles.card}`}>
              {/* Stars */}
              <div className="stars">
                {[...Array(review.rating)].map((_, s) => (
                  <span key={s}>★</span>
                ))}
              </div>

              {/* Quote */}
              <p className={styles.text}>&ldquo;{review.text}&rdquo;</p>

              {/* Author */}
              <div className={styles.author}>
                <div className={styles.avatar}>
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className={styles.name}>{review.name}</div>
                  <div className={styles.verified}>✓ {t.labels.verifiedGuest}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
