'use client';
import { I18nProvider } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Gallery from '@/components/Gallery';
import Location from '@/components/Location';
import Reviews from '@/components/Reviews';
import BookingCTA from '@/components/BookingCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <I18nProvider>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Gallery />
        <Location />
        <Reviews />
        <BookingCTA />
      </main>
      <Footer />
    </I18nProvider>
  );
}
