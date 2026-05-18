'use client';
import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { waLink, WhatsAppIcon, WA_PHONE, SOCIALS } from './_shared';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useI18n();
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const links = [
    { label: t.nav.features, href: '#features' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.location, href: '#location' },
    { label: t.nav.reviews, href: '#reviews' },
    { label: t.nav.faq, href: '#faq' },
  ];

  return (
    <footer className={styles.footer}>
      <div className="v2-container">
        <div className={styles.inner}>
          <div className={styles.brand}>
            <a href="#home" className={styles.logo}>
              <img src="/assets/logo/logo.svg" alt="Rashi6 Villa" className={styles.logoImg} />
            </a>
            <p className={styles.tagline}>{t.footer.tagline}</p>
            <div className={styles.socials}>
              <a
                href={waLink(t.whatsapp.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </a>
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.social}
                  aria-label={s.name}
                >
                  <s.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav className={styles.col}>
            <h4>{t.labels.navTitle}</h4>
            <ul>
              {links.map((l) => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h4>{t.nav.contact}</h4>
            <ul>
              <li>
                <a href={waLink(t.whatsapp.message)} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`tel:+${WA_PHONE}`} dir="ltr">+972 52-772-6209</a>
              </li>
              <li className={styles.muted}>{t.hero.subtitle}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {year} Rashi6 Villa · {t.footer.rights}</span>
          <span>{t.footer.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
