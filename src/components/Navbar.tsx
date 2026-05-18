'use client';
import { useState, useEffect } from 'react';
import { useI18n, Locale } from '@/lib/i18n';
import styles from './Navbar.module.css';

const LANGS: { code: Locale; label: string }[] = [
  { code: 'he', label: 'עב' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

const WA_PHONE = '972527726209';

export default function Navbar() {
  const { locale, setLocale, t, dir } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasLogoImage, setHasLogoImage] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    
    // Check if the logo SVG is loaded and exists
    const img = new Image();
    img.src = '/assets/logo/logo.svg';
    img.onload = () => setHasLogoImage(true);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waLink = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(t.whatsapp.message)}`;

  const navLinks = [
    { label: t.nav.features, href: '#features' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.location, href: '#location' },
    { label: t.nav.reviews, href: '#reviews' },
  ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a href="#" className={styles.logo} aria-label="Rashi6 Home">
          {hasLogoImage ? (
            <img
              src="/assets/logo/logo.svg"
              alt="Rashi6 Villa Logo"
              className={styles.logoImg}
              onError={() => setHasLogoImage(false)}
            />
          ) : (
            <>
              <span className={styles.logoText}>Rashi6</span>
              <span className={styles.logoTag}>Villa</span>
            </>
          )}
        </a>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className={styles.controls}>
          {/* Language Switcher */}
          <div className={styles.langSwitcher}>
            {LANGS.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={`${styles.langBtn} ${locale === lang.code ? styles.langActive : ''}`}
                aria-label={`Switch to ${lang.label}`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-whatsapp ${styles.navWa}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className={styles.waLabel}>{t.nav.contact}</span>
          </a>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              {t.nav.contact}
            </a>
          </li>
        </ul>
        <div className={styles.mobileLang}>
          {LANGS.map((lang) => (
            <button key={lang.code} onClick={() => { setLocale(lang.code); setMenuOpen(false); }} className={`${styles.langBtn} ${locale === lang.code ? styles.langActive : ''}`}>{lang.label}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}
