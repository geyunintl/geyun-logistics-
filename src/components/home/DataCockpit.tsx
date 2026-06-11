'use client';

import { motion, useInView, useAnimationFrame } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLang } from '@/context/LangContext';

/* ─── Card data ─────────────────────────────────────────────────────────── */
const CARDS = [
  {
    value: '2017', suffix: '年', label: '成立时间',
    desc: '从义乌起航，深耕跨境物流链路。',
    isCyan: true,
    bottomType: 'timeline',
  },
  {
    value: '1000', suffix: '万', label: '注册资金',
    desc: '稳定投入，服务跨境电商长期增长。',
    isCyan: false,
    bottomType: 'bar',
  },
  {
    value: '6', suffix: '城', label: '全国布局',
    desc: '义乌、深圳、泉州、武汉、太原、长沙协同。',
    isCyan: true,
    bottomType: 'dots',
  },
  {
    value: '24', suffix: 'H', label: '渠道响应',
    desc: '多团队联动，快速匹配发货方案。',
    isCyan: false,
    bottomType: 'pulse',
  },
  {
    value: '12', suffix: '日达', label: '美线快船',
    desc: '覆盖美森限时达、卡派、FBA入仓。',
    isCyan: true,
    bottomType: 'flow',
  },
  {
    value: '3', suffix: '类', label: '核心客群',
    desc: 'FBA、独立站、大货项目全链路服务。',
    isCyan: false,
    bottomType: 'tags',
  },
] as const;

const CHAIN = [
  '义乌货源', '国内仓储', '美线出运', '海外仓', 'FBA 入仓', '尾程派送',
] as const;

/* ─── Card icons ─────────────────────────────────────────────────────────── */
function IconClock({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="h-full w-full">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
      <circle cx="12" cy="12" r="1" fill={color} stroke="none" />
    </svg>
  );
}
function IconShield({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="h-full w-full">
      <path d="M12 3L4 7v5c0 4.4 3.5 8.5 8 9.5 4.5-1 8-5.1 8-9.5V7L12 3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconNodes({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="h-full w-full">
      <circle cx="12" cy="12" r="2.5" fill={color} stroke="none" opacity="0.7" />
      <circle cx="4"  cy="8"  r="1.8" />
      <circle cx="20" cy="8"  r="1.8" />
      <circle cx="4"  cy="16" r="1.8" />
      <circle cx="20" cy="16" r="1.8" />
      <line x1="6" y1="8.8"  x2="10" y2="11" />
      <line x1="18" y1="8.8" x2="14" y2="11" />
      <line x1="6" y1="15.2" x2="10" y2="13" />
      <line x1="18" y1="15.2" x2="14" y2="13" />
    </svg>
  );
}
function IconTimer({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="h-full w-full">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5" />
      <path d="M9.5 3h5M12 3v2" />
      <path d="M18.4 5.6l-1.5 1.5" />
    </svg>
  );
}
function IconRoute({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="h-full w-full">
      <path d="M3 17c4-8 14-8 18 0" />
      <circle cx="3"  cy="17" r="1.5" fill={color} stroke="none" />
      <circle cx="21" cy="17" r="1.5" fill={color} stroke="none" />
      <path d="M12 9 L14 7 L12 5 L17 7 L12 9z" fill={color} opacity="0.7" stroke="none" />
    </svg>
  );
}
function IconUsers({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="h-full w-full">
      <circle cx="8"  cy="8"  r="3" />
      <circle cx="16" cy="8"  r="3" />
      <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 14c1.7 0 4 1.3 4 4" />
    </svg>
  );
}

const ICONS = [IconClock, IconShield, IconNodes, IconTimer, IconRoute, IconUsers];

/* ─── Bottom decorators ──────────────────────────────────────────────────── */
function BottomTimeline({ isCyan }: { isCyan: boolean }) {
  const c = isCyan ? '#22d3ee' : '#f4b35b';
  const years = [2017, 2019, 2021, 2023, 2025];
  return (
    <div className="mt-4 space-y-1">
      <div className="flex items-center gap-1">
        {years.map((y, i) => (
          <div key={y} className="flex flex-1 flex-col items-center gap-0.5">
            <div className="h-1.5 w-full rounded-full" style={{ background: i <= 3 ? c : 'rgba(255,255,255,0.08)', opacity: i <= 3 ? 0.7 + i * 0.07 : 1 }} />
            <span className="text-[7px] text-slate-600">{y}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BottomBar({ isCyan }: { isCyan: boolean }) {
  const c = isCyan ? 'from-cyan-500 to-cyan-300' : 'from-amber-500 to-amber-300';
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-[8px] text-slate-600">
        <span>注册资本</span><span>1000万</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${c}`}
          initial={{ width: 0 }}
          whileInView={{ width: '82%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  );
}

function BottomDots({ isCyan }: { isCyan: boolean }) {
  const cities = ['义乌', '深圳', '泉州', '武汉', '太原', '长沙'];
  const c = isCyan ? '#22d3ee' : '#f4b35b';
  return (
    <div className="mt-4 flex items-center gap-2">
      {cities.map((city, i) => (
        <div key={city} className="flex flex-col items-center gap-0.5">
          <motion.div
            className="size-2 rounded-full"
            style={{ background: c }}
            animate={{ opacity: [0.4, 1, 0.4], boxShadow: [`0 0 4px ${c}`, `0 0 10px ${c}`, `0 0 4px ${c}`] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-[6.5px] text-slate-600">{city}</span>
        </div>
      ))}
    </div>
  );
}

function BottomPulse({ isCyan }: { isCyan: boolean }) {
  const c = isCyan ? '#22d3ee' : '#f4b35b';
  const bars = [0.4, 0.7, 1.0, 0.8, 0.5, 0.9, 0.6, 1.0, 0.7, 0.4];
  return (
    <div className="mt-4 flex items-end gap-0.5 h-5">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm"
          style={{ background: c, opacity: 0.55 }}
          animate={{ scaleY: [h, h * 0.5 + 0.2, h] }}
          transition={{ duration: 1.4, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function BottomFlow({ isCyan }: { isCyan: boolean }) {
  const c = isCyan ? '34,211,238' : '244,179,91';
  return (
    <div className="mt-4">
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="absolute inset-y-0 rounded-full"
          style={{ width: '40%', background: `linear-gradient(90deg, transparent, rgba(${c},0.9), transparent)` }}
          animate={{ x: ['-40%', '140%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[7px] text-slate-600">
        <span>义乌出发</span><span>Los Angeles</span>
      </div>
    </div>
  );
}

function BottomTags({ isCyan }: { isCyan: boolean }) {
  const tags = ['FBA', '独立站', '大货'];
  const c = isCyan ? '34,211,238' : '244,179,91';
  return (
    <div className="mt-4 flex gap-1.5">
      {tags.map((t, i) => (
        <motion.span
          key={t}
          className="rounded-md px-2 py-0.5 text-[8.5px] font-semibold"
          style={{ border: `1px solid rgba(${c},0.4)`, color: `rgba(${c},0.9)`, background: `rgba(${c},0.08)` }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {t}
        </motion.span>
      ))}
    </div>
  );
}

const BOTTOM_MAP = {
  timeline: BottomTimeline,
  bar:      BottomBar,
  dots:     BottomDots,
  pulse:    BottomPulse,
  flow:     BottomFlow,
  tags:     BottomTags,
};

/* ─── KPI Card ───────────────────────────────────────────────────────────── */
function KpiCard({
  card,
  index,
  labelText,
  descText,
}: {
  card: (typeof CARDS)[number];
  index: number;
  labelText: string;
  descText: string;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon    = ICONS[index];
  const accent  = card.isCyan ? '#22d3ee' : '#f4b35b';
  const accentR = card.isCyan ? '34,211,238' : '244,179,91';
  const Bottom  = BOTTOM_MAP[card.bottomType];

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl p-5 transition-all duration-300"
      style={{
        border:     `1px solid ${hovered ? `rgba(${accentR},0.45)` : 'rgba(255,255,255,0.08)'}`,
        background: hovered
          ? `linear-gradient(135deg, rgba(${accentR},0.07), rgba(2,8,23,0.88))`
          : 'rgba(6,18,42,0.60)',
        boxShadow: hovered
          ? `0 0 32px rgba(${accentR},0.14), inset 0 1px 0 rgba(255,255,255,0.07)`
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Top row: icon + unit label */}
      <div className="flex items-start justify-between">
        <div
          className="grid size-10 place-items-center rounded-xl p-2"
          style={{
            border:     `1px solid rgba(${accentR},0.30)`,
            background: `rgba(${accentR},0.10)`,
            boxShadow:  hovered ? `0 0 14px rgba(${accentR},0.25)` : 'none',
          }}
        >
          <Icon color={accent} />
        </div>
        <span
          className="rounded-md px-1.5 py-0.5 font-mono text-[8px] font-black tracking-[0.18em]"
          style={{ color: `rgba(${accentR},0.7)`, border: `1px solid rgba(${accentR},0.18)`, background: `rgba(${accentR},0.06)` }}
        >
          {labelText}
        </span>
      </div>

      {/* Value */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-[2.8rem] font-black leading-none tracking-tight text-white">
          {card.value}
        </span>
        <span
          className="font-display text-xl font-black"
          style={{ color: accent }}
        >
          {card.suffix}
        </span>
      </div>

      {/* Description */}
      <p className="mt-2 text-[12.5px] leading-[1.7] text-slate-400">{descText}</p>

      {/* Bottom decorator */}
      <Bottom isCyan={card.isCyan} />

      {/* Active left accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
          opacity: hovered ? 0.9 : 0.25,
        }}
      />
    </motion.article>
  );
}

/* ─── Chain strip ────────────────────────────────────────────────────────── */
function ChainStrip({ chain }: { chain: readonly string[] }) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-white/8 bg-slate-950/50 p-5 backdrop-blur-md">
      <p className="mb-4 text-center font-mono text-[8.5px] font-black tracking-[0.3em] text-cyan-400/70">
        LOGISTICS CHAIN · 全链路服务节点
      </p>
      <div className="relative flex items-center justify-between">
        {/* Animated flow line behind nodes */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/8">
          <motion.div
            className="absolute inset-y-0 rounded-full"
            style={{ width: '25%', background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.8), rgba(244,179,91,0.6), transparent)' }}
            animate={{ x: ['-30%', '130%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {chain.map((node, i) => {
          const isCyan = i % 2 === 0;
          const c      = isCyan ? '#22d3ee' : '#f4b35b';
          const cr     = isCyan ? '34,211,238' : '244,179,91';
          return (
            <div key={node} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                className="size-3 rounded-full"
                style={{ background: c, boxShadow: `0 0 8px ${c}` }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.4, delay: i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span
                className="whitespace-nowrap rounded-lg px-2 py-0.5 text-[9px] font-semibold"
                style={{
                  border:     `1px solid rgba(${cr},0.32)`,
                  background: `rgba(${cr},0.07)`,
                  color:      `rgba(${cr},0.90)`,
                }}
              >
                {node}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── DataCockpit ────────────────────────────────────────────────────────── */
export function DataCockpit() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="container-x py-24">
      {/* Outer glass shell */}
      <div
        className="relative overflow-hidden rounded-[2.5rem] p-6 md:p-10"
        style={{
          border:     '1px solid rgba(125,211,252,0.14)',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(8,47,73,0.30), rgba(2,8,23,0.94))',
          boxShadow:  '0 0 100px rgba(34,211,238,0.07), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* ── Background layers ── */}

        {/* HUD grid */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)',
            backgroundSize:  '44px 44px',
            maskImage:       'radial-gradient(ellipse 90% 80% at 50% 50%, black, transparent)',
          }}
        />

        {/* Ambient glow spots */}
        <div className="pointer-events-none absolute left-1/4 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[70px]" aria-hidden="true" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 h-48 w-48 rounded-full bg-amber-400/[0.05] blur-[60px]" aria-hidden="true" />

        {/* Scanning line */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.3) 40%, rgba(125,211,252,0.5) 50%, rgba(34,211,238,0.3) 60%, transparent 100%)' }}
          animate={{ y: [0, 600, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />

        {/* ── Header ── */}
        <div className="relative z-10">
          <div className="mb-10 flex items-start justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <p className="mb-3 flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.36em] text-cyan-300">
                <span className="inline-block size-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,.9)]" />
                {t.cockpit.eyebrow}
              </p>
              <h2 className="font-display text-[clamp(1.8rem,3.5vw,3.2rem)] font-black leading-tight tracking-[-0.04em] text-white">
                {t.cockpit.title}
              </h2>
              <p className="mt-3 max-w-xl text-[14px] leading-7 text-slate-400">
                {t.cockpit.description}
              </p>
            </motion.div>

            {/* DATA LIVE badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
              className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex"
            >
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 backdrop-blur-md"
                style={{
                  border:     '1px solid rgba(34,211,238,0.28)',
                  background: 'rgba(2,8,23,0.80)',
                }}
              >
                <motion.span
                  className="size-2 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="font-mono text-[8.5px] font-black tracking-[0.24em] text-emerald-300">DATA LIVE</span>
              </div>
              <p className="font-mono text-[7.5px] text-slate-600">歌运物流运营数据</p>
            </motion.div>
          </div>

          {/* ── KPI Grid ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((card, i) => (
              <KpiCard
                key={card.label}
                card={card}
                index={i}
                labelText={t.cockpit.cards[i]?.label ?? card.label}
                descText={t.cockpit.cards[i]?.desc ?? card.desc}
              />
            ))}
          </div>

          {/* ── Chain strip ── */}
          <ChainStrip chain={t.cockpit.chain} />
        </div>
      </div>
    </section>
  );
}
