'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Lang, translations, type Translations } from '@/lib/i18n';

/* ─── Context shape ──────────────────────────────────────────────────────── */
interface LangContextValue {
  lang:    Lang;
  t:       Translations;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang:    'en',
  t:       translations.en,
  setLang: () => {},
});

/* ─── Provider ───────────────────────────────────────────────────────────── */
export function LangProvider({ children }: { children: ReactNode }) {
  // Always start with 'en' for SSR consistency; reads localStorage after hydration
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('geyun-lang') as Lang;
      if (saved && translations[saved]) setLangState(saved);
    } catch {
      // localStorage unavailable (e.g. private browsing with strict settings)
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('geyun-lang', l);
    } catch {
      // ignore
    }
  };

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LangContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */
export function useLang(): LangContextValue {
  return useContext(LangContext);
}
