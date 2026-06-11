'use client';

import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLang } from '@/context/LangContext';

/* ─── Lazy-load WebGL globe ─────────────────────────────────────────────── */
const GlobeScene = dynamic(
  () => import('@/components/three/GlobeScene').then((m) => m.GlobeScene),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[600px] place-items-center rounded-[2.5rem] border border-cyan-200/10 bg-slate-950/60 text-xs tracking-widest text-cyan-300/50">
        LOADING ROUTE COMMAND...
      </div>
    ),
  }
);

/* ─── Route definitions ─────────────────────────────────────────────────── */
const ROUTES = [
  {
    code: '01',
    title: '美国空运/海运',
    region: 'WEST COAST · USA',
    desc: '义乌直发美西，可选空运快件或海运专线，衔接 FBA 入仓与本土派送。',
    isCyan: true,
  },
  {
    code: '02',
    title: '美西/美中/美东海外仓',
    region: 'USA · MULTI-REGION',
    desc: '覆盖洛杉矶、芝加哥、新泽西仓，满足美西/美中/美东多仓补货与 FBA 配送需求。',
    isCyan: false,
  },
  {
    code: '03',
    title: '欧洲海运/铁路/卡航',
    region: 'EUROPE · MULTI-PORT',
    desc: '连接欧洲主要港口，支持海运整柜、铁路联运与末端卡车派送，多式联运全链路。',
    isCyan: true,
  },
  {
    code: '04',
    title: '英国空运/海运',
    region: 'UNITED KINGDOM',
    desc: '提供英国空运快件与海运头程，对接英国本土仓与 Amazon UK FBA 入仓预约。',
    isCyan: false,
  },
  {
    code: '05',
    title: '墨西哥海运',
    region: 'NORTH AMERICA · MEX',
    desc: '服务北美延伸市场，提供墨西哥海运整柜与拼柜方案，衔接当地清关与派送。',
    isCyan: true,
  },
] as const;

/* ─── Card animation variants ───────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, x: -26 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.16 + i * 0.09,
      duration: 0.52,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

/* ─── RouteCard ─────────────────────────────────────────────────────────── */
function RouteCard({
  route,
  index,
  isActive,
  onEnter,
  onLeave,
  titleText,
  descText,
}: {
  route: (typeof ROUTES)[number];
  index: number;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  titleText: string;
  descText: string;
}) {
  const accentColor = route.isCyan ? '#22d3ee' : '#f4b35b';
  const accentRgba  = route.isCyan ? '34,211,238' : '244,179,91';

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative cursor-default overflow-hidden rounded-xl px-4 py-3.5 transition-all duration-300"
      style={{
        border: `1px solid ${isActive ? `rgba(${accentRgba},0.42)` : 'rgba(255,255,255,0.07)'}`,
        background: isActive
          ? `linear-gradient(135deg, rgba(${accentRgba},0.07), rgba(2,8,23,0.82))`
          : 'rgba(6,18,40,0.50)',
        boxShadow: isActive
          ? `0 0 28px rgba(${accentRgba},0.10), inset 0 1px 0 rgba(255,255,255,0.05)`
          : 'none',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-[3px] rounded-l-xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom, transparent, ${accentColor}, transparent)`,
          opacity: isActive ? 0.9 : 0.25,
        }}
      />

      <div className="flex items-center justify-between pl-1">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[10px] font-black tabular-nums"
            style={{ color: `rgba(${accentRgba},0.52)` }}
          >
            {route.code}
          </span>
          <div>
            <p className="text-[13px] font-bold leading-snug text-white">{titleText}</p>
            <p
              className="mt-0.5 font-mono text-[9px] tracking-[0.18em]"
              style={{ color: `rgba(${accentRgba},0.50)` }}
            >
              {route.region}
            </p>
          </div>
        </div>
        <span
          className="text-sm transition-all duration-300"
          style={{
            opacity: isActive ? 1 : 0,
            color: accentColor,
            transform: isActive ? 'translateX(0)' : 'translateX(-6px)',
          }}
        >
          →
        </span>
      </div>

      <p className="mt-2 pl-8 text-[11.5px] leading-[1.75] text-slate-400">{descText}</p>
    </motion.div>
  );
}

/* ─── Destination node label ─────────────────────────────────────────────── */
function NodeLabel({
  title, sub, posStyle, isCyan,
}: {
  title: string;
  sub: string;
  posStyle: CSSProperties;
  isCyan: boolean;
}) {
  const rgba = isCyan ? '34,211,238' : '244,179,91';
  const dot  = isCyan ? '#22d3ee'    : '#f4b35b';
  return (
    <div className="absolute" style={posStyle}>
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 backdrop-blur-md"
        style={{
          border:     `1px solid rgba(${rgba},0.55)`,
          background: `linear-gradient(135deg, rgba(${rgba},0.08), rgba(2,8,23,0.85))`,
          boxShadow:  `0 0 16px rgba(${rgba},0.14)`,
        }}
      >
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ background: dot, boxShadow: `0 0 8px ${dot}, 0 0 16px ${dot}` }}
        />
        <div>
          <p className="text-[11px] font-bold leading-none text-white">{title}</p>
          <p className="mt-1 text-[8.5px] leading-none text-slate-400">{sub}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Route monitor (top-right) ──────────────────────────────────────────── */
const MONITOR_DEST = ['Los Angeles', 'New York', 'Mexico City', 'Europe', 'London'];
const MONITOR_ETA  = ['14D', '18D', '22D', '28D', '25D'];
const MONITOR_PROG = [62, 47, 36, 29, 33];

function RouteMonitor({ activeIndex }: { activeIndex: number | null }) {
  const idx = activeIndex ?? 0;
  return (
    <div
      className="pointer-events-none absolute right-4 top-4 w-48 rounded-xl p-3 backdrop-blur-lg"
      style={{
        border:     '1px solid rgba(125,211,252,0.24)',
        background: 'rgba(2,8,23,0.80)',
        boxShadow:  '0 0 22px rgba(34,211,238,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className="size-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,.9)]" />
        <p className="font-mono text-[8px] font-black tracking-[0.28em] text-cyan-400">ROUTE MONITOR</p>
      </div>
      <p className="text-[11px] font-bold leading-tight text-white">
        Yiwu → {MONITOR_DEST[idx]}
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,.8)]" />
        <p className="text-[9px] font-semibold text-emerald-300">In Transit</p>
      </div>
      <div className="mt-3">
        <div className="mb-1.5 flex justify-between">
          <span className="text-[8.5px] text-slate-500">ETA</span>
          <span className="font-mono text-[8.5px] font-bold text-amber-300">{MONITOR_ETA[idx]}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400"
            animate={{ width: `${MONITOR_PROG[idx]}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>
      <p className="mt-2.5 font-mono text-[8px] text-slate-500">Nodes: 24/24 &nbsp;·&nbsp; Active</p>
    </div>
  );
}

/* ─── Global network panel (bottom-right) ────────────────────────────────── */
function GlobalNetworkPanel() {
  return (
    <div
      className="pointer-events-none absolute bottom-14 right-4 w-48 rounded-xl p-3.5 backdrop-blur-lg"
      style={{
        border:     '1px solid rgba(34,211,238,0.22)',
        background: 'rgba(2,8,23,0.86)',
        boxShadow:  '0 0 24px rgba(34,211,238,0.08)',
      }}
    >
      <p className="mb-2.5 font-mono text-[8px] font-black tracking-[0.26em] text-cyan-400">GLOBAL NETWORK</p>
      <div className="space-y-1.5">
        {[
          { dot: 'bg-cyan-400',    label: '5 Active Routes'       },
          { dot: 'bg-amber-400',   label: '24 Tracking Nodes'     },
          { dot: 'bg-emerald-400 animate-pulse', label: 'Customs Sync Online' },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`size-1.5 shrink-0 rounded-full ${dot}`} />
            <p className="text-[9px] text-slate-300">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── GlobalRouteMap ────────────────────────────────────────────────────── */
export function GlobalRouteMap() {
  const { t } = useLang();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#020817] py-24"
    >
      {/* Background atmosphere — echoes Hero dark grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black,transparent)]" />
        <div className="absolute left-[18%] top-1/3 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-cyan-500/[0.04] blur-[90px]" />
        <div className="absolute right-[15%] bottom-1/4 h-[360px] w-[360px] rounded-full bg-amber-400/[0.04] blur-[80px]" />
        {/* Top fade: seamless blend from Hero stats bar */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#020817] to-transparent" />
      </div>

      <div className="container-x relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.62, ease: 'easeOut' }}
          className="mb-12"
        >
          <p className="mb-3 flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.36em] text-cyan-300">
            <span className="inline-block size-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,.9)]" />
            {t.globalRoute.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.9rem,3.8vw,3.6rem)] font-black leading-tight tracking-[-0.04em] text-white">
            {t.globalRoute.title}
          </h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-8 text-slate-400">
            {t.globalRoute.description}
          </p>
        </motion.div>

        {/* Main two-column grid */}
        <div className="grid items-center gap-8 lg:grid-cols-[420px_1fr] xl:grid-cols-[450px_1fr]">

          {/* Left: route command cards */}
          <motion.div
            className="flex flex-col gap-2.5"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {ROUTES.map((route, i) => (
              <RouteCard
                key={route.code}
                route={route}
                index={i}
                isActive={activeIndex === i}
                onEnter={() => setActiveIndex(i)}
                onLeave={() => setActiveIndex(null)}
                titleText={t.globalRoute.routes[i]?.title ?? route.title}
                descText={t.globalRoute.routes[i]?.desc ?? route.desc}
              />
            ))}

            {/* Origin label */}
            <motion.p
              custom={5}
              variants={cardVariants}
              className="mt-1 flex items-center gap-2 pl-1 text-[11px] tracking-[0.06em] text-slate-500"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-amber-400/70 shadow-[0_0_6px_rgba(244,179,91,.6)]" />
              {t.globalRoute.origin}
            </motion.p>
          </motion.div>

          {/* Right: Globe command station */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.28, duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden md:block"
          >
            {/* ── Outer glow border ── */}
            <div
              className="relative overflow-hidden rounded-[2.5rem]"
              style={{
                border:     '1px solid rgba(125,211,252,0.28)',
                boxShadow:  [
                  '0 0 0 1px rgba(34,211,238,0.08)',
                  '0 0 80px rgba(34,211,238,0.16)',
                  '0 0 160px rgba(34,211,238,0.06)',
                  'inset 0 1px 0 rgba(255,255,255,0.08)',
                ].join(', '),
                background: 'radial-gradient(ellipse at 50% 46%, rgba(8,47,73,0.38), rgba(2,8,23,0.96))',
              }}
            >
              {/* ── Layer 1: HUD background grid ── */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
                }}
              />

              {/* ── Layer 2: Radar scan rings ── */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute rounded-full"
                  style={{ width: '88%', height: '88%', border: '1px solid rgba(34,211,238,0.18)' }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                  className="absolute rounded-full"
                  style={{ width: '74%', height: '74%', border: '1px dashed rgba(244,179,91,0.14)' }}
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
                  className="absolute rounded-full"
                  style={{ width: '60%', height: '60%', border: '1px solid rgba(34,211,238,0.08)' }}
                />
              </div>

              {/* ── Layer 3: WebGL globe ── */}
              <GlobeScene activeIndex={activeIndex} />

              {/* ── Layers 4+5: HTML overlays ── */}
              <div className="pointer-events-none absolute inset-0">

                {/* Destination node labels — spread around the globe */}
                <NodeLabel title="LA · 海外仓"  sub="Los Angeles WH"     posStyle={{ top: '46%', right: '4%'   }} isCyan />
                <NodeLabel title="NY · FBA"     sub="New York"           posStyle={{ top: '17%', right: '6%'   }} isCyan={false} />
                <NodeLabel title="MEX · 海运"   sub="Mexico Sea Freight"  posStyle={{ top: '66%', right: '6%'  }} isCyan />
                <NodeLabel title="EU · 铁海"    sub="Europe Rail & Sea"   posStyle={{ top: '9%',  left: '14%'  }} isCyan={false} />
                <NodeLabel title="UK · 派送"    sub="UK Delivery"         posStyle={{ top: '34%', left: '11%'  }} isCyan />

                {/* YIWU HUB — prominent origin */}
                <div className="absolute" style={{ top: '46%', left: '18%' }}>
                  {/* Expanding pulse rings */}
                  <motion.div
                    className="absolute rounded-full border-2 border-amber-400/50"
                    style={{ width: 28, height: 28, left: '50%', top: '50%', x: '-50%', y: '-50%' }}
                    animate={{ scale: [1, 2.8], opacity: [0.7, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute rounded-full border border-amber-400/35"
                    style={{ width: 28, height: 28, left: '50%', top: '50%', x: '-50%', y: '-50%' }}
                    animate={{ scale: [1, 3.8], opacity: [0.5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                  />
                  {/* Label */}
                  <div
                    className="relative flex items-center gap-3 rounded-xl px-3 py-2 backdrop-blur-md"
                    style={{
                      border:     '1px solid rgba(244,179,91,0.55)',
                      background: 'rgba(2,8,23,0.82)',
                      boxShadow:  '0 0 20px rgba(244,179,91,0.18)',
                    }}
                  >
                    <span className="size-3.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_16px_rgba(244,179,91,1),0_0_32px_rgba(244,179,91,0.6)]" />
                    <div>
                      <p className="font-mono text-[11px] font-black tracking-[0.22em] text-amber-300">YIWU HUB</p>
                      <p className="font-mono text-[8.5px] tracking-[0.14em] text-amber-200/70">义乌发货中心</p>
                    </div>
                  </div>
                </div>

                {/* Route monitor — top-right */}
                <RouteMonitor activeIndex={activeIndex} />

                {/* Global network panel — bottom-right */}
                <GlobalNetworkPanel />
              </div>

              {/* ── Bottom status bar ── */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-6 py-2"
                style={{
                  background:  'linear-gradient(to top, rgba(2,8,23,0.92), rgba(2,8,23,0.55) 60%, transparent)',
                  borderTop:   '1px solid rgba(34,211,238,0.12)',
                }}
              >
                <span className="font-mono text-[8px] font-black tracking-[0.24em] text-cyan-400">GLOBAL NETWORK</span>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1.5 text-[8.5px] text-slate-400">
                  <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,.8)]" />
                  5 Active Routes
                </span>
                <span className="text-slate-700">·</span>
                <span className="text-[8.5px] text-slate-400">24 Tracking Nodes</span>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1.5 text-[8.5px] text-slate-400">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Customs Sync Online
                </span>
              </div>
            </div>

            {/* Corner bracket accents — stronger */}
            <div className="pointer-events-none absolute -left-px -top-px h-16 w-px bg-gradient-to-b from-cyan-400/70 to-transparent" />
            <div className="pointer-events-none absolute -left-px -top-px h-px w-16 bg-gradient-to-r from-cyan-400/70 to-transparent" />
            <div className="pointer-events-none absolute -bottom-px -right-px h-16 w-px bg-gradient-to-t from-amber-400/60 to-transparent" />
            <div className="pointer-events-none absolute -bottom-px -right-px h-px w-16 bg-gradient-to-l from-amber-400/60 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
