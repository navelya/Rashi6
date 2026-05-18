'use client';
import { useState } from 'react';
import { localeTag, useIsDesktop } from './_shared';
import styles from './Calendar.module.css';

interface Props {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (ci: Date | null, co: Date | null) => void;
  locale: string;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const monthKey = (d: Date) => d.getFullYear() * 12 + d.getMonth();

/** Sunday-first for Hebrew (Israeli convention), Monday-first for en/fr. */
const weekStartFor = (locale: string) => (locale === 'he' ? 0 : 1);

export default function Calendar({ checkIn, checkOut, onSelect, locale }: Props) {
  const today = startOfDay(new Date());
  const isDesktop = useIsDesktop();
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [hover, setHover] = useState<Date | null>(null);

  const tag = localeTag[locale] ?? 'en-GB';
  const weekStart = weekStartFor(locale);

  const monthFmt = new Intl.DateTimeFormat(tag, { month: 'long', year: 'numeric' });
  const dowFmt = new Intl.DateTimeFormat(tag, { weekday: 'short' });

  // Weekday header labels, rotated to the locale's first day.
  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, 7 + ((i + weekStart) % 7)); // 2024-01-07 is a Sunday
    return dowFmt.format(d);
  });

  const canGoBack = monthKey(view) > monthKey(today);

  function pick(day: Date) {
    if (!checkIn || (checkIn && checkOut)) {
      onSelect(day, null);
    } else if (day.getTime() <= checkIn.getTime()) {
      onSelect(day, null);
    } else {
      onSelect(checkIn, day);
    }
  }

  function renderMonth(base: Date) {
    const year = base.getFullYear();
    const month = base.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const lead = (firstDow - weekStart + 7) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

    // Provisional end for range preview while hovering.
    const previewEnd = checkIn && !checkOut && hover && hover > checkIn ? hover : checkOut;

    return (
      <div className={styles.month} key={`${year}-${month}`}>
        <div className={styles.monthLabel}>{monthFmt.format(base)}</div>
        <div className={styles.dow}>
          {weekdays.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
        <div className={styles.grid}>
          {cells.map((day, i) => {
            if (!day) return <span key={i} className={styles.empty} />;
            const past = day.getTime() < today.getTime();
            const isIn = checkIn && sameDay(day, checkIn);
            const isOut = checkOut && sameDay(day, checkOut);
            const inRange =
              checkIn && previewEnd && day > checkIn && day < previewEnd;
            const cls = [
              styles.day,
              past && styles.past,
              (isIn || isOut) && styles.endpoint,
              isIn && styles.start,
              isOut && styles.end,
              inRange && styles.inRange,
              sameDay(day, today) && styles.today,
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                type="button"
                key={i}
                className={cls}
                disabled={!!past}
                onClick={() => pick(day)}
                onMouseEnter={() => setHover(day)}
                aria-label={day.toLocaleDateString(tag, { dateStyle: 'full' })}
                aria-pressed={!!(isIn || isOut)}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.calendar} onMouseLeave={() => setHover(null)}>
      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => setView(addMonths(view, -1))}
          disabled={!canGoBack}
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => setView(addMonths(view, 1))}
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className={styles.months}>
        {renderMonth(view)}
        {isDesktop && renderMonth(addMonths(view, 1))}
      </div>
    </div>
  );
}
