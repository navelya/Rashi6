'use client';
import { useEffect } from 'react';
import { I18nProvider } from '@/lib/i18n';
import Navbar from './Navbar';
import Hero from './Hero';
import BookingWidget from './BookingWidget';
import Features from './Features';
import Gallery from './Gallery';
import Location from './Location';
import Reviews from './Reviews';
import FAQ from './FAQ';
import CTA from './CTA';
import Footer from './Footer';
import WhatsAppFab from './WhatsAppFab';
import styles from './VillaLanding.module.css';

export type Theme = 'mediterranean' | 'coastal' | 'dark';

/** Body background per theme — keeps overscroll/edges on-theme. */
const BODY_BG: Record<Theme, string> = {
  mediterranean: '#fbf8f2',
  coastal: '#ffffff',
  dark: '#1a1714',
};

export default function VillaLanding({ theme }: { theme: Theme }) {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = BODY_BG[theme];
    return () => { document.body.style.background = prev; };
  }, [theme]);

  return (
    <I18nProvider>
      <div className={`v2-root v2-theme-${theme}`}>
        <Navbar />
        <main>
          <Hero />

          {/* Booking widget overlaps the hero base */}
          <div className={styles.bookingZone} id="book">
            <div className="v2-container">
              <div className={styles.bookingInner}>
                <BookingWidget />
              </div>
            </div>
          </div>

          <Features />
          <Gallery />
          <Reviews />
          <FAQ />
          <Location />
          <CTA />
        </main>
        <Footer />
        <WhatsAppFab />
      </div>
    </I18nProvider>
  );
}
