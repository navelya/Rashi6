'use client';
import { useState, useEffect } from 'react';
import { useI18n, Locale } from '@/lib/i18n';
import { waLink, WhatsAppIcon } from './_shared';
import styles from './Navbar.module.css';

const LANGS: { code: Locale; label: string }[] = [
  { code: 'he', label: 'עב' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

export default function Navbar() {
  const { locale, setLocale, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const links = [
    { label: t.nav.features, href: '#features' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.location, href: '#location' },
    { label: t.nav.reviews, href: '#reviews' },
    { label: t.nav.faq, href: '#faq' },
  ];

  return (
    <header className={`${styles.nav} ${scrolled || menuOpen ? styles.solid : ''}`}>
      <div className={`v2-container ${styles.inner}`}>
        <a href="#home" className={styles.logo} aria-label="Rashi6 Villa">
          <img src="/assets/logo/logo.svg" alt="Rashi6 Villa" className={styles.logoImg} />
        </a>

        <nav className={styles.links} aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          <div className={styles.langs}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={`${styles.lang} ${locale === l.code ? styles.langOn : ''}`}
                aria-pressed={locale === l.code}
              >
                {l.label}
              </button>
            ))}
          </div>
          <a
            href={`#book`}
            className={`v2-btn v2-btn-primary ${styles.cta}`}
          >
            {t.booking.title}
          </a>
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOn : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.sheet} ${menuOpen ? styles.sheetOpen : ''}`}>
        <nav className={styles.sheetLinks}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className={styles.sheetLangs}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setMenuOpen(false); }}
              className={`${styles.lang} ${locale === l.code ? styles.langOn : ''}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <a
          href={waLink(t.whatsapp.message)}
          target="_blank"
          rel="noopener noreferrer"
          className={`v2-btn v2-btn-wa ${styles.sheetCta}`}
          onClick={() => setMenuOpen(false)}
        >
          <WhatsAppIcon size={20} />
          {t.nav.contact}
        </a>
      </div>
    </header>
  );
}
