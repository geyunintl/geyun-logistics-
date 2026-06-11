'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/context/LangContext';
import { LANG_LABELS, type Lang } from '@/lib/i18n';

/* ── LangSwitcher ────────────────────────────────────────────────────── */
const LANG_ORDER: Lang[] = ['en', 'es', 'de', 'zh'];

function GlobeIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 2a12.6 12.6 0 0 1 0 16M10 2a12.6 12.6 0 0 0 0 16M2 10h16" />
    </svg>
  );
}

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-200"
        aria-label="Switch language"
      >
        <GlobeIcon />
        <span>{LANG_LABELS[lang].short}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          viewBox="0 0 10 6"
          className="size-2.5 text-slate-500"
          fill="none" stroke="currentColor" strokeWidth="1.8"
        >
          <path d="M1 1l4 4 4-4" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0,   y: 4,  scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/96 py-1 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
            {LANG_ORDER.map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/[0.07] ${
                  lang === l ? 'text-cyan-300' : 'text-slate-300 hover:text-white'
                }`}
              >
                {lang === l && (
                  <svg viewBox="0 0 12 12" className="size-3 shrink-0" fill="currentColor">
                    <path d="M1 6l3.5 3.5L11 2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  </svg>
                )}
                {lang !== l && <span className="size-3 shrink-0" />}
                {LANG_LABELS[l].full}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── MobileLangRow ──────────────────────────────────────────────────── */
function MobileLangRow({ onClose }: { onClose: () => void }) {
  const { lang, setLang } = useLang();
  return (
    <div className="flex flex-1 gap-1">
      {LANG_ORDER.map((l) => (
        <button
          key={l}
          onClick={() => { setLang(l); onClose(); }}
          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
            lang === l
              ? 'bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/30'
              : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          {LANG_LABELS[l].short}
        </button>
      ))}
    </div>
  );
}

/* ── Hexagon Logo ───────────────────────────────────────────────────── */
function HexLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 40 46"
      width={size}
      height={size * 1.15}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="nb-hx-g" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points="20,2 38,12 38,34 20,44 2,34 2,12"
        fill="#22d3ee"
        filter="url(#nb-hx-g)"
      />
      <polygon
        points="20,7 33,14.5 33,31.5 20,39 7,31.5 7,14.5"
        fill="none"
        stroke="#0f172a"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fill="#0f172a"
        fontSize="15"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        歌
      </text>
    </svg>
  );
}

/* ── Component ──────────────────────────────────────────────────────── */
export function Navbar() {
  const pathname = usePathname();
  const { t } = useLang();
  const [scrolled,      setScrolled]      = useState(false);
  const [open,          setOpen]          = useState(false);
  const [serviceOpen,   setServiceOpen]   = useState(false);
  const [mobileService, setMobileService] = useState(false);
  const [dismissed,     setDismissed]     = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close flyout on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setServiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const barVisible = !dismissed && !scrolled;

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">

        {/* ── Announcement bar ── */}
        <AnimatePresence>
          {barVisible && (
            <motion.div
              key="bar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="relative flex items-center justify-center gap-3 border-b border-cyan-400/10 bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 px-10 py-2">
                <span className="text-[11px] font-semibold text-slate-300">
                  🚀 <span className="font-black text-cyan-300">{t.nav.announce}</span>
                </span>
                <Link
                  href="/#quote"
                  className="shrink-0 rounded-full bg-cyan-300 px-3 py-0.5 text-[10px] font-black text-slate-950 transition hover:bg-cyan-200"
                >
                  {t.nav.announceCta}
                </Link>
                <button
                  onClick={() => setDismissed(true)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 grid size-5 place-items-center rounded-full text-slate-500 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 1l10 10M11 1L1 11" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Navbar ── */}
        <div className="px-4 py-3">
          <div className={`container-x flex items-center justify-between rounded-full border px-4 py-2 transition duration-300 ${
            scrolled
              ? 'border-cyan-200/20 bg-slate-950/82 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl'
              : 'border-white/10 bg-white/[0.03] backdrop-blur-md'
          }`}>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <HexLogo />
              <span>
                <strong className="block font-display text-base tracking-tight text-white leading-none">歌运物流</strong>
                <small className="block text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-200/80 mt-0.5">GEYUN LOGISTICS</small>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 lg:flex">

              {/* Home */}
              <Link href="/" className="relative rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:text-white">
                {pathname === '/' && (
                  <motion.span layoutId="nb-pill" className="absolute inset-0 rounded-full bg-cyan-300/12" />
                )}
                <span className="relative">{t.nav.home}</span>
              </Link>

              {/* Services flyout */}
              <div
                ref={flyoutRef}
                className="relative"
                onMouseEnter={() => setServiceOpen(true)}
                onMouseLeave={() => setServiceOpen(false)}
              >
                <button className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:text-white">
                  <span>{t.nav.services}</span>
                  <motion.svg
                    animate={{ rotate: serviceOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    viewBox="0 0 10 6"
                    className="size-2.5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M1 1l4 4 4-4" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {serviceOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0,  scale: 1 }}
                      exit={{ opacity: 0,   y: 6,  scale: 0.97 }}
                      transition={{ duration: 0.16 }}
                      className="absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/96 p-1.5 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl"
                    >
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                      {[
                        { color: '#22d3ee' },
                        { color: '#f4b35b' },
                        { color: '#818cf8' },
                        { color: '#34d399' },
                      ].map((meta, i) => {
                        const item = t.nav.serviceItems[i];
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setServiceOpen(false)}
                            className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
                          >
                            <span
                              className="mt-1 size-2 shrink-0 rounded-full"
                              style={{ backgroundColor: meta.color, boxShadow: `0 0 8px ${meta.color}90` }}
                            />
                            <div>
                              <p className="text-sm font-bold text-white transition group-hover:text-cyan-100">
                                {item.label}
                              </p>
                              <p className="mt-0.5 text-xs leading-4 text-slate-400">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other top-level links */}
              {t.nav.topNav.filter((n) => n.href !== '/').map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:text-white"
                >
                  {pathname === item.href && (
                    <motion.span layoutId="nb-pill" className="absolute inset-0 rounded-full bg-cyan-300/12" />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop CTA + LangSwitcher */}
            <div className="hidden items-center gap-2 lg:flex shrink-0">
              <Button href="/contact">{t.nav.cta}</Button>
              <LangSwitcher />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full border border-white/10 text-white transition hover:border-white/20 lg:hidden"
              aria-label="Open menu"
            >
              <span className="flex flex-col items-center gap-[5px]">
                <span className="block h-[1.5px] w-5 rounded-full bg-current" />
                <span className="block h-[1.5px] w-3.5 rounded-full bg-current" />
                <span className="block h-[1.5px] w-5 rounded-full bg-current" />
              </span>
            </button>

          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-slate-950/65 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-80 flex-col border-l border-white/10 bg-slate-950 shadow-2xl"
            >
              {/* Top glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-white/8 p-5">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                  <HexLogo />
                  <span>
                    <strong className="block font-display text-base font-black leading-none text-white">歌运物流</strong>
                    <small className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-cyan-200/70">GEYUN LOGISTICS</small>
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-white/20 hover:text-white"
                  aria-label="Close"
                >
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 1l10 10M11 1L1 11" />
                  </svg>
                </button>
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-xl px-4 py-3.5 text-base font-bold text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {t.nav.home}
                </Link>

                {/* Service accordion */}
                <div>
                  <button
                    onClick={() => setMobileService((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-base font-bold text-slate-200 transition hover:bg-white/[0.06]"
                  >
                    <span>{t.nav.services}</span>
                    <motion.svg
                      animate={{ rotate: mobileService ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      viewBox="0 0 10 6"
                      className="size-3 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M1 1l4 4 4-4" />
                    </motion.svg>
                  </button>

                  <AnimatePresence>
                    {mobileService && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 space-y-0.5 pb-1.5">
                          {[
                            { color: '#22d3ee' },
                            { color: '#f4b35b' },
                            { color: '#818cf8' },
                            { color: '#34d399' },
                          ].map((meta, i) => {
                            const item = t.nav.serviceItems[i];
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-white/[0.06]"
                              >
                                <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                                <span className="text-sm font-semibold text-slate-300">{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {t.nav.topNav.filter((n) => n.href !== '/').map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center rounded-xl px-4 py-3.5 text-base font-bold text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Drawer CTA + LangSwitcher */}
              <div className="space-y-3 border-t border-white/8 p-5">
                <Button href="/contact" className="w-full justify-center energy-button">
                  {t.nav.cta}
                </Button>

                {/* Language selector row */}
                <div className="flex items-center gap-2">
                  <GlobeIcon />
                  <MobileLangRow onClose={() => setOpen(false)} />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
