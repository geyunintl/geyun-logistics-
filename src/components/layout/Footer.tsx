'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-white/10 bg-slate-950/70 py-14">
      <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-display text-2xl font-black text-white">{t.footer.company}</p>
          <p className="mt-4 max-w-2xl leading-8 text-slate-400">{t.footer.description}</p>
          <div className="mt-4 flex flex-col gap-1.5">
            <p className="text-sm text-slate-400">
              <span className="font-bold text-amber-300">📞 {t.footer.phone}</span>
              <a href="tel:+12083808736" className="text-white hover:text-amber-200 transition-colors">+1 (208) 380-8736</a>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300 md:grid-cols-3">
          {t.footer.navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-cyan-200">{item.label}</Link>
          ))}
        </div>
      </div>
      <div className="container-x mt-10 text-xs text-slate-500">{t.footer.copyright}</div>
    </footer>
  );
}
