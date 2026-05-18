'use client';
import { useEffect, useRef, useState, type ComponentType } from 'react';

/** Villa WhatsApp contact number (international format, no +). */
export const WA_PHONE = '972527726209';

/** Build a wa.me deep link with a pre-filled, URL-encoded message. */
export function waLink(message: string): string {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}

/** Map our locale codes to BCP-47 tags for Intl formatting. */
export const localeTag: Record<string, string> = {
  he: 'he-IL',
  en: 'en-GB',
  fr: 'fr-FR',
};

/**
 * Scroll-reveal hook — adds `.v2-in` once the element enters the viewport.
 * Returns a ref to attach to the element you want to animate in.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            /* data attribute (not className) so it survives React
               re-renders — className is reconciled, attributes are not. */
            e.target.setAttribute('data-reveal', 'in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Inline WhatsApp glyph used across CTAs. */
export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/* ── Social glyphs ──────────────────────────────────────────── */
export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.4" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.32 2.1 1.62 3.57 3.5 3.86v3.02c-1.4.1-2.73-.32-3.93-1.03v6.62c0 3.4-2.66 5.53-5.58 5.53-3.02 0-5.49-2.42-5.49-5.42 0-3.27 2.97-5.81 6.3-5.2v3.13c-.42-.13-.86-.2-1.3-.2-1.4 0-2.53 1.12-2.53 2.5 0 1.38 1.13 2.5 2.53 2.5 1.45 0 2.6-1.11 2.6-2.6V3h3.4z" />
    </svg>
  );
}

export function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8.2h2.76l.41-3.2H13.5V7.55c0-.93.26-1.56 1.59-1.56h1.7V3.13c-.3-.04-1.3-.13-2.47-.13-2.45 0-4.12 1.5-4.12 4.24v2.36H7.43v3.2h2.77V21h3.3z" />
    </svg>
  );
}

/* ── SOCIAL LINKS ───────────────────────────────────────────────
   PLACEHOLDERS — replace each `href` below with the villa's real
   profile URLs. (WhatsApp is wired separately via WA_PHONE.)
   ────────────────────────────────────────────────────────────── */
export const SOCIALS: { name: string; href: string; Icon: ComponentType<{ size?: number }> }[] = [
  { name: 'Instagram', href: 'https://instagram.com/REPLACE_ME', Icon: InstagramIcon },
  { name: 'TikTok', href: 'https://tiktok.com/@REPLACE_ME', Icon: TikTokIcon },
  { name: 'Facebook', href: 'https://facebook.com/REPLACE_ME', Icon: FacebookIcon },
];

/** Track whether the viewport is at desktop width (used by the calendar). */
export function useIsDesktop(min = 768) {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${min}px)`);
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [min]);
  return desktop;
}
