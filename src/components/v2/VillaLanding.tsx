'use client';
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

export default function VillaLanding() {
  return (
    <I18nProvider>
      <div className="v2-root">
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
