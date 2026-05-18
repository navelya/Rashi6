'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import he from '@/locales/he.json';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

export type Locale = 'he' | 'en' | 'fr';

const locales = { he, en, fr };

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: typeof he;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType>({
  locale: 'he',
  setLocale: () => {},
  t: he,
  dir: 'rtl',
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('he');
  const t = locales[locale] as typeof he;
  const dir = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      <div dir={dir} lang={locale} style={{ direction: dir }}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
