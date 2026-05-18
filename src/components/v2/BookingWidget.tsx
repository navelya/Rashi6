'use client';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import Calendar from './Calendar';
import { localeTag, waLink, WhatsAppIcon } from './_shared';
import styles from './BookingWidget.module.css';

const MAX_GUESTS = 8;
const MS_DAY = 86400000;

export default function BookingWidget({ id }: { id?: string }) {
  const { t, locale } = useI18n();
  const b = t.booking;
  const tag = localeTag[locale] ?? 'en-GB';

  const [ci, setCi] = useState<Date | null>(null);
  const [co, setCo] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights = ci && co ? Math.round((co.getTime() - ci.getTime()) / MS_DAY) : 0;
  const fmtDate = (d: Date | null) =>
    d ? d.toLocaleDateString(tag, { day: '2-digit', month: 'short' }) : '';
  const nightsLabel = nights > 0 ? `${nights} ${nights === 1 ? b.night : b.nights}` : '';

  function handleSelect(nextCi: Date | null, nextCo: Date | null) {
    setCi(nextCi);
    setCo(nextCo);
    setError(null);
    if (nextCi && nextCo) setOpen(false);
  }

  function handleCheck() {
    if (!ci || !co) {
      setError(b.errDates);
      setOpen(true);
      return;
    }
    if (!name.trim()) {
      setError(b.errName);
      return;
    }
    const msg = b.waTemplate
      .replace('{name}', name.trim())
      .replace('{checkin}', ci.toLocaleDateString(tag, { dateStyle: 'medium' }))
      .replace('{checkout}', co.toLocaleDateString(tag, { dateStyle: 'medium' }))
      .replace('{nights}', nightsLabel)
      .replace('{guests}', String(guests));
    window.open(waLink(msg), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className={styles.widget} id={id}>
      <div className={styles.head}>
        <span className={styles.label}>{b.label}</span>
        <h3 className={`v2-display ${styles.title}`}>{b.title}</h3>
        <p className={styles.sub}>{b.subtitle}</p>
      </div>

      {/* Date fields */}
      <div className={styles.dates}>
        <button
          type="button"
          className={`${styles.field} ${open ? styles.fieldActive : ''}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={styles.fieldLabel}>{b.checkin}</span>
          <span className={ci ? styles.fieldValue : styles.fieldPlaceholder}>
            {ci ? fmtDate(ci) : b.selectDates}
          </span>
        </button>
        <span className={styles.arrow} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
        <button
          type="button"
          className={`${styles.field} ${open ? styles.fieldActive : ''}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={styles.fieldLabel}>{b.checkout}</span>
          <span className={co ? styles.fieldValue : styles.fieldPlaceholder}>
            {co ? fmtDate(co) : b.addCheckout}
          </span>
        </button>
      </div>

      {/* Inline calendar */}
      {open && (
        <div className={styles.calendarPanel}>
          <Calendar checkIn={ci} checkOut={co} onSelect={handleSelect} locale={locale} />
          {(ci || co) && (
            <div className={styles.calFoot}>
              {nightsLabel && <span className={styles.nights}>{nightsLabel}</span>}
              <button
                type="button"
                className={styles.clear}
                onClick={() => handleSelect(null, null)}
              >
                {b.clear}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Guests + name */}
      <div className={styles.row}>
        <div className={styles.guests}>
          <span className={styles.fieldLabel}>{b.guests}</span>
          <div className={styles.stepper}>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
              aria-label="−"
            >
              −
            </button>
            <span className={styles.count}>{guests}</span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
              disabled={guests >= MAX_GUESTS}
              aria-label="+"
            >
              +
            </button>
          </div>
        </div>
        <label className={styles.nameField}>
          <span className={styles.fieldLabel}>{b.name}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder={b.namePlaceholder}
            className={styles.nameInput}
            autoComplete="name"
          />
        </label>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}

      <button type="button" className={`v2-btn v2-btn-wa ${styles.submit}`} onClick={handleCheck}>
        <WhatsAppIcon size={20} />
        {b.checkBtn}
      </button>
    </div>
  );
}
