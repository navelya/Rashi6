'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import styles from './Footer.module.css';

const WA_PHONE = '972527726209';

export default function Footer() {
  const { t } = useI18n();
  const waLink = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(t.whatsapp.message)}`;
  
  const [hasLogoImage, setHasLogoImage] = useState(false);
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    // Check if the logo SVG exists on client side
    const img = new Image();
    img.src = '/assets/logo/logo.svg';
    img.onload = () => setHasLogoImage(true);
    
    // Set dynamic client-side year to avoid server/client time mismatches
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.topLine} />
      <div className="container">
        <div className={styles.inner}>
          {/* Brand */}
          <div className={styles.brand}>
            {hasLogoImage ? (
              <img
                src="/assets/logo/logo.svg"
                alt="Rashi6 Villa Logo"
                className={styles.logoImg}
                onError={() => setHasLogoImage(false)}
              />
            ) : (
              <span className={styles.logoText}>Rashi6</span>
            )}
            <span className={styles.tagline}>{t.footer.tagline}</span>
            <div className={styles.socials}>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className={styles.links}>
            <h4 className={styles.linksTitle}>{t.labels.navTitle}</h4>
            <ul>
              <li><a href="#features">{t.nav.features}</a></li>
              <li><a href="#gallery">{t.nav.gallery}</a></li>
              <li><a href="#location">{t.nav.location}</a></li>
              <li><a href="#reviews">{t.nav.reviews}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.contact}>
            <h4 className={styles.linksTitle}>{t.nav.contact}</h4>
            <ul>
              <li>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="tel:+972527726209" className={styles.contactItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.13 2.2 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  +972 52-772-6209
                </a>
              </li>
              <li>
                <span className={styles.contactItem} style={{ cursor: 'default' }}>
                  📍 נתניה, ישראל
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <span>© {year} Rashi6 Villa. {t.footer.rights}</span>
          <span className={styles.madeWith}>Made with ❤️ in נתניה</span>
        </div>
      </div>
    </footer>
  );
}
