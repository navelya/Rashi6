'use client';
import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { waLink, WhatsAppIcon } from './_shared';
import styles from './WhatsAppFab.module.css';

export default function WhatsAppFab() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={waLink(t.whatsapp.message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.fab} ${show ? styles.show : ''}`}
      aria-label={t.nav.contact}
    >
      <span className={styles.pulse} />
      <WhatsAppIcon size={28} />
    </a>
  );
}
