'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { channels } from '@/data/channels';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/context/LangContext';

/* ─── Filter tabs (static; display text comes from t.channels.filterTabs) ── */
const FILTERS = ['时效优先', '成本优先', 'FBA 入仓', '大货出运'] as const;

/* ─── Display channel type (allows string overrides) ───────────────────── */
interface DisplayChannel {
  name:     string;
  passCode: string;
  badge:    string;
  eta:      string;
  etaNote:  string;
  carrier:  string;
  scene:    string;
  tags:     readonly string[];
  isCyan:   boolean;
}

/* ─── Barcode decoration heights (deterministic, no random) ─────────────────── */
const BAR_HEIGHTS = [5, 9, 4, 11, 3, 8, 6, 10, 4, 7, 5, 9];

/* ─── Route Pass Card ──────────────────────────────────────────────────────── */
function RoutePassCard({
  channel,
  index,
  setRef,
}: {
  channel: DisplayChannel;
  index: number;
  setRef: (el: HTMLElement | null) => void;
}) {
  const accent  = channel.isCyan ? '#22d3ee' : '#f4b35b';
  const accentR = channel.isCyan ? '34,211,238' : '244,179,91';

  return (
    <article
      ref={setRef}
      className="route-pass relative flex-none overflow-hidden rounded-[1.8rem] transition-[transform,opacity,box-shadow] duration-500 lg:w-[460px]"
      style={{
        minHeight:      440,
        border:         `1px solid rgba(${accentR},0.22)`,
        background:     `linear-gradient(158deg, rgba(${accentR},0.09) 0%, rgba(2,8,23,0.96) 42%, rgba(2,8,23,0.99) 100%)`,
        boxShadow:      `0 0 44px rgba(${accentR},0.10), 0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-[3px] rounded-l-[1.8rem]"
        style={{ background: `linear-gradient(to bottom, ${accent}, rgba(${accentR},0.25), transparent)` }}
      />

      {/* Top inset glow line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(${accentR},0.55), transparent)` }}
      />

      {/* ── Header strip ── */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          background:   `linear-gradient(90deg, rgba(${accentR},0.13), rgba(${accentR},0.04))`,
          borderBottom: `1px solid rgba(${accentR},0.16)`,
        }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            className="size-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.32 }}
          />
          <span
            className="font-mono text-[8.5px] font-black tracking-[0.26em]"
            style={{ color: `rgba(${accentR},0.58)` }}
          >
            {channel.passCode}
          </span>
        </div>
        <span
          className="rounded px-2 py-[3px] font-mono text-[7.5px] font-black tracking-[0.18em]"
          style={{
            border:     `1px solid rgba(${accentR},0.40)`,
            background: `rgba(${accentR},0.10)`,
            color:      accent,
          }}
        >
          {channel.badge}
        </span>
      </div>

      {/* ── Main body ── */}
      <div className="p-6">

        {/* Route name + carrier */}
        <div className="mb-5">
          <h3 className="font-display text-[1.95rem] font-black leading-tight text-white">{channel.name}</h3>
          <p
            className="mt-1.5 font-mono text-[8.5px] tracking-[0.20em]"
            style={{ color: `rgba(${accentR},0.50)` }}
          >
            VIA {channel.carrier}
          </p>
        </div>

        {/* ETA display */}
        <div
          className="mb-5 flex items-center justify-between rounded-xl px-4 py-3.5"
          style={{
            border:     `1px solid rgba(${accentR},0.20)`,
            background: `rgba(${accentR},0.06)`,
          }}
        >
          <div>
            <p className="font-mono text-[7.5px] uppercase tracking-[0.22em] text-slate-500">
              ETA · {channel.etaNote}
            </p>
            <p
              className="mt-0.5 font-display text-[3.4rem] font-black leading-none tracking-tight"
              style={{ color: accent }}
            >
              {channel.eta}
            </p>
          </div>
          {/* Barcode decoration */}
          <div className="flex items-end gap-[3px]" style={{ height: 40 }}>
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="rounded-sm"
                style={{
                  width:      2.5,
                  height:     h * 2.8,
                  background: `rgba(${accentR},${i % 3 === 0 ? 0.52 : i % 2 === 0 ? 0.24 : 0.12})`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Perforated ticket divider */}
        <div className="mb-5 flex items-center gap-2">
          <div
            className="size-3.5 shrink-0 rounded-full"
            style={{ background: '#020817', boxShadow: `0 0 0 1px rgba(${accentR},0.18)` }}
          />
          <div
            className="flex-1 border-t border-dashed"
            style={{ borderColor: `rgba(${accentR},0.20)` }}
          />
          <div
            className="size-3.5 shrink-0 rounded-full"
            style={{ background: '#020817', boxShadow: `0 0 0 1px rgba(${accentR},0.18)` }}
          />
        </div>

        {/* Scene */}
        <div className="mb-5">
          <p className="mb-1.5 font-mono text-[7.5px] uppercase tracking-[0.22em] text-slate-500">
            SUITABLE FOR
          </p>
          <p className="text-[13px] font-semibold leading-[1.65] text-slate-200">{channel.scene}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {channel.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg px-2.5 py-[5px] text-[9px] font-semibold"
              style={{
                border:     `1px solid rgba(${accentR},0.28)`,
                background: `rgba(${accentR},0.08)`,
                color:      `rgba(${accentR},0.88)`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Watermark ETA in background */}
      <div
        className="pointer-events-none absolute bottom-1 right-4 select-none font-display font-black leading-none"
        style={{
          fontSize:      '7.5rem',
          color:         `rgba(${accentR},0.032)`,
          letterSpacing: '-0.04em',
        }}
      >
        {channel.eta}
      </div>
    </article>
  );
}

/* ─── ChannelHorizontalScroll ──────────────────────────────────────────────── */
export function ChannelHorizontalScroll() {
  const { lang, t } = useLang();
  const sectionRef     = useRef<HTMLElement>(null);
  const trackRef       = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cardRefs       = useRef<(HTMLElement | null)[]>([]);
  const [activeFilter, setActiveFilter] = useState(0);

  /* Build display channels — overlay non-ZH text from t.channels.cards */
  const displayChannels: DisplayChannel[] = channels.map((ch, i) => {
    if (lang === 'zh') return ch as unknown as DisplayChannel;
    const ov = t.channels.cards[i];
    return {
      ...ch,
      name:    ov?.name    ?? ch.name,
      etaNote: ov?.etaNote ?? ch.etaNote,
      carrier: ov?.carrier ?? ch.carrier,
      scene:   ov?.scene   ?? ch.scene,
      tags:    ov?.tags    ?? ch.tags,
    };
  });

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track || window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 160),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin:     true,
          scrub:   1,
          end:     () => `+=${track.scrollWidth}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            /* Progress bar */
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${self.progress * 100}%`;
            }
            /* Active card scale */
            const total     = channels.length;
            const activeIdx = Math.round(self.progress * (total - 1));
            cardRefs.current.forEach((el, i) => {
              if (!el) return;
              const active = i === activeIdx;
              el.style.transform  = active ? 'scale(1.05)' : 'scale(1)';
              el.style.opacity    = active ? '1' : '0.72';
              el.style.boxShadow  = active
                ? `0 0 70px rgba(${channels[i].isCyan ? '34,211,238' : '244,179,91'},0.22), 0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`
                : `0 0 44px rgba(${channels[i].isCyan ? '34,211,238' : '244,179,91'},0.09), 0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`;
            });
          },
        },
      });
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={sectionRef} id="channels" className="relative overflow-hidden bg-[#020817] py-20">

      {/* ── Background atmosphere ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* HUD grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.025)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_50%,black,transparent)]" />
        {/* Center ambient */}
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.03] blur-[90px]" />
        {/* Horizontal transport rails */}
        <div className="absolute inset-x-0 top-[36%] h-px bg-gradient-to-r from-transparent via-cyan-400/[0.12] to-transparent" />
        <div className="absolute inset-x-0 top-[64%] h-px bg-gradient-to-r from-transparent via-amber-400/[0.09] to-transparent" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        {/* Top/bottom fades */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#020817] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#020817] to-transparent" />
      </div>

      {/* ── Header ── */}
      <div className="container-x relative z-10 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.60, ease: 'easeOut' }}
        >
          <p className="mb-3 flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.36em] text-cyan-300">
            <span className="inline-block size-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,.9)]" />
            {t.channels.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.9rem,3.8vw,3.6rem)] font-black leading-tight tracking-[-0.04em] text-white">
            {t.channels.title}
          </h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-8 text-slate-400">
            {t.channels.description}
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.14, duration: 0.55 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {FILTERS.map((_, i) => {
            const label = t.channels.filterTabs[i] ?? FILTERS[i];
            return (
            <button
              key={label}
              onClick={() => setActiveFilter(i)}
              className="rounded-xl px-4 py-2 font-mono text-[9.5px] font-black tracking-[0.16em] transition-all duration-250"
              style={{
                border:     `1px solid ${activeFilter === i ? 'rgba(34,211,238,0.55)' : 'rgba(255,255,255,0.10)'}`,
                background: activeFilter === i ? 'rgba(34,211,238,0.10)' : 'rgba(6,18,42,0.60)',
                color:      activeFilter === i ? '#22d3ee' : 'rgba(148,163,184,0.65)',
                boxShadow:  activeFilter === i ? '0 0 18px rgba(34,211,238,0.14)' : 'none',
              }}
            >
              {label}
            </button>
            );
          })}
        </motion.div>
      </div>

      {/* ── Horizontal scroll track ── */}
      <div className="relative">
        {/* Flowing transport light (rail particle) */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] overflow-hidden">
          <motion.div
            className="absolute h-full rounded-full"
            style={{
              width:      90,
              background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.75), rgba(244,179,91,0.65), transparent)',
            }}
            animate={{ left: ['-8%', '108%'] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.8 }}
          />
        </div>

        <div
          ref={trackRef}
          className="flex flex-col gap-5 px-4 lg:w-max lg:flex-row lg:gap-8 lg:px-[calc((100vw-min(1180px,calc(100%-32px)))/2)]"
        >
          {displayChannels.map((channel, index) => (
            <RoutePassCard
              key={index}
              channel={channel}
              index={index}
              setRef={(el) => { cardRefs.current[index] = el; }}
            />
          ))}
        </div>
      </div>

      {/* ── Scroll progress bar ── */}
      <div className="container-x relative z-10 mt-8 flex flex-col items-center gap-2">
        <div className="relative h-1 w-56 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            ref={progressBarRef}
            className="absolute inset-y-0 left-0 w-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, #22d3ee, #f4b35b)' }}
          />
        </div>
        <p className="font-mono text-[7.5px] tracking-[0.22em] text-slate-600">
          SCROLL TO EXPLORE ALL ROUTES
        </p>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="container-x relative z-10 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
          className="flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/60 px-6 py-5 backdrop-blur-md sm:flex-row sm:items-center"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
        >
          {/* Top glow line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          <p className="relative max-w-xl text-[13.5px] leading-7 text-slate-400">
            {t.channels.ctaDesc}
          </p>
          <Button href="#quote" className="relative shrink-0 shadow-[0_0_36px_rgba(34,211,238,.28)]">
            {t.channels.cta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
