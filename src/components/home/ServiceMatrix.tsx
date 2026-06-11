'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLang } from '@/context/LangContext';

/* ─── Service data ──────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    title: '美国海运',       sub: 'OCEAN FREIGHT',
    desc: '美西/美东海运整柜、拼箱、快船、普船多层级渠道，匹配 FBA 补货与大货出运节奏。',
    tags: ['美森快船', '卡派整柜', '拼箱订舱'],
    isCyan: true,
  },
  {
    title: '美国空运',       sub: 'AIR FREIGHT',
    desc: '高时效补货、旺季加急、样品件与小批量快速入仓，覆盖直飞与中转航线。',
    tags: ['快速补货', '清关派送', '高时效'],
    isCyan: false,
  },
  {
    title: '亚马逊 FBA',    sub: 'AMAZON FBA',
    desc: '预约、贴标、分仓、尾程卡派，降低拒收与延误风险，全流程 FBA 入仓服务。',
    tags: ['FBA 预约', '贴标换标', '尾程派送'],
    isCyan: true,
  },
  {
    title: '海外仓一件代发', sub: 'OVERSEAS WAREHOUSE',
    desc: '美国海外仓收货、上架、拣货、打包、退件处理，支持本土订单快速履约。',
    tags: ['一件代发', '退件换标', '本土履约'],
    isCyan: false,
  },
  {
    title: '集装箱订舱',     sub: 'CONTAINER BOOKING',
    desc: '对接主要船司与港口资源，支持大货项目稳定出运，整柜舱位资源保障。',
    tags: ['整柜订舱', '舱位保障', '项目物流'],
    isCyan: true,
  },
  {
    title: '尾程派送',       sub: 'LAST MILE DELIVERY',
    desc: 'UPS、FedEx 本土账号资源，匹配商业件与住宅件派送策略，签收实时追踪。',
    tags: ['UPS/FedEx', '本土派送', '签收追踪'],
    isCyan: false,
  },
] as const;

const CHAIN = ['需求确认', '渠道匹配', '国内入仓', '出运跟踪', '海外衔接', '签收回传'] as const;

/* ─── SVG icons ─────────────────────────────────────────────────────────────── */
function IconOcean({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M2 18c1.2-1.2 2.8-1.2 4 0s2.8 1.2 4 0 2.8-1.2 4 0 2.8 1.2 4 0" />
      <path d="M2 13c1.2-1.2 2.8-1.2 4 0s2.8 1.2 4 0 2.8-1.2 4 0 2.8 1.2 4 0" />
      <rect x="6" y="5" width="12" height="6" rx="1" strokeWidth="1.3" />
      <path d="M9 5V3M15 5V3" />
    </svg>
  );
}
function IconAir({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M22 16.5H2l5-9 5.5 5.5 3-4 4 5.5z" />
      <path d="M5 19h14" strokeWidth="1.2" />
      <circle cx="18" cy="6" r="2" fill={color} opacity="0.5" stroke="none" />
    </svg>
  );
}
function IconFBA({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M21 10H3l2-6h14l2 6z" />
      <rect x="3" y="10" width="18" height="11" rx="1" />
      <path d="M10 10v11M14 10v11" strokeWidth="1.1" opacity="0.6" />
      <path d="M7 15h2M15 15h2" strokeWidth="1.2" />
    </svg>
  );
}
function IconWarehouse({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z" />
      <path d="M9 21v-8h6v8" />
      <path d="M9 8h6" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}
function IconContainer({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="2" y="6" width="20" height="13" rx="1" />
      <path d="M2 11h20M7 6V4M12 6V4M17 6V4" />
      <circle cx="5"  cy="19" r="1.2" fill={color} stroke="none" />
      <circle cx="19" cy="19" r="1.2" fill={color} stroke="none" />
      <path d="M9 14h6" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}
function IconLastMile({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="1" y="10" width="15" height="11" rx="1" />
      <path d="M16 13h4l3 4v4h-7" />
      <circle cx="5.5"  cy="21" r="2" />
      <circle cx="18.5" cy="21" r="2" />
      <path d="M4 10V7a2 2 0 012-2h8a2 2 0 012 2v3" strokeWidth="1.3" />
    </svg>
  );
}

const SERVICE_ICONS = [IconOcean, IconAir, IconFBA, IconWarehouse, IconContainer, IconLastMile];

/* ─── Service node card ─────────────────────────────────────────────────────── */
function ServiceNode({
  service, index, isActive, onClick, delay = 0,
  titleText, descText, tagsText,
}: {
  service: (typeof SERVICES)[number];
  index: number;
  isActive: boolean;
  onClick: () => void;
  delay?: number;
  titleText: string;
  descText: string;
  tagsText: string[];
}) {
  const accent  = service.isCyan ? '#22d3ee' : '#f4b35b';
  const accentR = service.isCyan ? '34,211,238' : '244,179,91';
  const Icon    = SERVICE_ICONS[index];

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-300"
      style={{
        border:     `1px solid ${isActive ? `rgba(${accentR},0.58)` : 'rgba(255,255,255,0.07)'}`,
        background: isActive
          ? `linear-gradient(135deg, rgba(${accentR},0.13), rgba(2,8,23,0.92))`
          : 'rgba(6,18,42,0.58)',
        boxShadow: isActive
          ? `0 0 44px rgba(${accentR},0.24), 0 0 88px rgba(${accentR},0.08), inset 0 1px 0 rgba(255,255,255,0.10)`
          : 'inset 0 1px 0 rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        transform:  isActive ? 'scale(1.015)' : 'scale(1)',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
          opacity: isActive ? 1 : 0.18,
        }}
      />

      {/* Active top glow edge */}
      {isActive && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${accentR},0.6), transparent)` }}
        />
      )}

      {/* Top row */}
      <div className="flex items-center gap-3">
        <div
          className="grid size-9 shrink-0 place-items-center rounded-xl p-1.5 transition-all duration-300"
          style={{
            border:     `1px solid rgba(${accentR},0.28)`,
            background: `rgba(${accentR},0.10)`,
            boxShadow:  isActive ? `0 0 18px rgba(${accentR},0.40)` : 'none',
          }}
        >
          <Icon color={accent} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-bold leading-snug text-white">{titleText}</p>
          <p
            className="mt-0.5 truncate font-mono text-[8px] tracking-[0.16em]"
            style={{ color: `rgba(${accentR},0.52)` }}
          >
            {service.sub}
          </p>
        </div>

        {/* ACTIVE badge or dormant indicator */}
        <div className="shrink-0">
          {isActive ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded px-1.5 py-[3px] font-mono text-[7px] font-black tracking-[0.16em]"
              style={{
                background: `rgba(${accentR},0.14)`,
                border:     `1px solid rgba(${accentR},0.48)`,
                color:      accent,
              }}
            >
              ACTIVE
            </motion.span>
          ) : (
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.18)' }}>◇</div>
          )}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p className="mt-3 text-[12px] leading-[1.8] text-slate-300">{descText}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tagsText.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-0.5 text-[8.5px] font-semibold"
                  style={{
                    border:     `1px solid rgba(${accentR},0.35)`,
                    color:      `rgba(${accentR},0.88)`,
                    background: `rgba(${accentR},0.09)`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Orbit core visualization ──────────────────────────────────────────────── */
function OrbitCore({ activeIndex }: { activeIndex: number }) {
  const svc     = SERVICES[activeIndex];
  const accent  = svc.isCyan ? '#22d3ee' : '#f4b35b';
  const accentR = svc.isCyan ? '34,211,238' : '244,179,91';

  return (
    <div className="relative flex h-full min-h-[480px] items-center justify-center">

      {/* ── Orbit ring 1: outer, clockwise ── */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '90%', height: '90%', border: '1px solid rgba(34,211,238,0.16)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        <span style={{ position:'absolute', top:-4, left:'50%', transform:'translateX(-50%)', width:8, height:8, borderRadius:'50%', background:'#22d3ee', boxShadow:'0 0 10px #22d3ee, 0 0 22px rgba(34,211,238,0.6)', display:'block' }} />
        <span style={{ position:'absolute', bottom:-3, left:'50%', transform:'translateX(-50%)', width:5, height:5, borderRadius:'50%', background:'rgba(34,211,238,0.5)', boxShadow:'0 0 6px rgba(34,211,238,0.5)', display:'block' }} />
      </motion.div>

      {/* ── Orbit ring 2: middle, counter-clockwise ── */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '72%', height: '72%', border: '1px dashed rgba(244,179,91,0.22)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      >
        <span style={{ position:'absolute', top:-3, left:'50%', transform:'translateX(-50%)', width:6, height:6, borderRadius:'50%', background:'#f4b35b', boxShadow:'0 0 8px #f4b35b, 0 0 16px rgba(244,179,91,0.5)', display:'block' }} />
        <span style={{ position:'absolute', top:'50%', right:-3, transform:'translateY(-50%)', width:4, height:4, borderRadius:'50%', background:'rgba(244,179,91,0.5)', boxShadow:'0 0 5px rgba(244,179,91,0.4)', display:'block' }} />
      </motion.div>

      {/* ── Orbit ring 3: inner, clockwise slow ── */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '54%', height: '54%', border: '1px solid rgba(34,211,238,0.09)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
      >
        <span style={{ position:'absolute', top:-2.5, left:'50%', transform:'translateX(-50%)', width:5, height:5, borderRadius:'50%', background:'rgba(34,211,238,0.65)', boxShadow:'0 0 7px rgba(34,211,238,0.55)', display:'block' }} />
      </motion.div>

      {/* ── Radar sweep (conic-gradient sector, rotating) ── */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          width: '75%', height: '75%', borderRadius: '50%',
          background: 'conic-gradient(from 0deg, rgba(34,211,238,0.11) 0deg, rgba(34,211,238,0.04) 45deg, transparent 45deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Ambient glow behind core ── */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: '46%', height: '46%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.11), transparent 70%)',
          filter: 'blur(18px)',
        }}
      />

      {/* ── Core sphere ── */}
      <div className="relative z-10 grid size-44 place-items-center">
        {/* Pulse ring A */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1px solid ${accent}` }}
          animate={{ scale: [1, 1.60], opacity: [0.50, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
        />
        {/* Pulse ring B */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1px solid ${accent}` }}
          animate={{ scale: [1, 2.05], opacity: [0.28, 0] }}
          transition={{ duration: 2.8, delay: 0.9, repeat: Infinity, ease: 'easeOut' }}
        />

        {/* Core visual — breathing */}
        <motion.div
          animate={{ scale: [1, 1.025, 1], boxShadow: [
            '0 0 55px rgba(34,211,238,0.22), 0 0 110px rgba(34,211,238,0.09), inset 0 0 36px rgba(34,211,238,0.09)',
            '0 0 70px rgba(34,211,238,0.32), 0 0 140px rgba(34,211,238,0.14), inset 0 0 48px rgba(34,211,238,0.14)',
            '0 0 55px rgba(34,211,238,0.22), 0 0 110px rgba(34,211,238,0.09), inset 0 0 36px rgba(34,211,238,0.09)',
          ] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative grid size-full place-items-center rounded-full text-center"
          style={{
            border:     '1.5px solid rgba(34,211,238,0.38)',
            background: 'radial-gradient(circle at 38% 38%, rgba(34,211,238,0.18) 0%, rgba(2,8,23,0.92) 68%)',
          }}
        >
          <div>
            <p className="font-display text-xl font-black leading-none tracking-tight text-white">GEYUN</p>
            <div className="mx-auto my-2 h-px w-10 bg-cyan-400/40" />
            <p className="font-mono text-[7.5px] font-black tracking-[0.28em] text-cyan-300">LOGISTICS</p>
            <p className="mt-0.5 font-mono text-[6.5px] tracking-[0.22em] text-cyan-400/50">CORE</p>
          </div>
        </motion.div>
      </div>

      {/* ── Active service indicator below core ── */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 rounded-xl px-3 py-1.5 backdrop-blur-md"
          style={{
            border:     `1px solid rgba(${accentR},0.32)`,
            background: `rgba(${accentR},0.07)`,
          }}
        >
          <motion.span
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="font-mono text-[8px] font-black tracking-[0.20em]" style={{ color: `rgba(${accentR},0.80)` }}>
            {svc.sub}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Service chain strip (enhanced progress track) ─────────────────────────── */
function ServiceChain({ chain }: { chain: readonly string[] }) {
  const PROGRESS = 2; // index of "in-progress" node

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/50 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.9)]" />
          <p className="font-mono text-[8.5px] font-black tracking-[0.3em] text-cyan-400/75">SERVICE FLOW · 服务链路</p>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.span
            className="size-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="font-mono text-[7px] tracking-[0.18em] text-emerald-300/60">IN TRANSIT</span>
        </div>
      </div>

      <div className="p-5">
        <div className="relative flex items-start justify-between">

          {/* ── Track: completed portion ── */}
          <div
            className="pointer-events-none absolute top-[10px] h-px"
            style={{
              left:  0,
              width: `${(PROGRESS / (CHAIN.length - 1)) * 100}%`,
              background: 'linear-gradient(90deg, rgba(34,211,238,0.55) 0%, rgba(244,179,91,0.40) 100%)',
            }}
          />
          {/* ── Track: remaining portion ── */}
          <div
            className="pointer-events-none absolute top-[10px] h-px"
            style={{
              left:  `${(PROGRESS / (CHAIN.length - 1)) * 100}%`,
              right: 0,
              background: 'rgba(255,255,255,0.07)',
            }}
          />

          {/* ── Flowing light on track ── */}
          <motion.div
            className="pointer-events-none absolute top-[7px] h-[7px] rounded-full"
            style={{
              width: '22%',
              background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.9), rgba(244,179,91,0.8), transparent)',
            }}
            animate={{ x: ['-30%', '560%'] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }}
          />

          {chain.map((node, i) => {
            const isCyan  = i % 2 === 0;
            const c       = isCyan ? '#22d3ee' : '#f4b35b';
            const cr      = isCyan ? '34,211,238' : '244,179,91';
            const isDone  = i < PROGRESS;
            const isCurr  = i === PROGRESS;

            return (
              <div key={node} className="relative z-10 flex flex-col items-center gap-2">
                {/* Node dot */}
                <motion.div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:      isCurr ? 14 : 10,
                    height:     isCurr ? 14 : 10,
                    background: (isDone || isCurr) ? c : `rgba(${cr},0.28)`,
                    boxShadow:  isCurr
                      ? `0 0 12px ${c}, 0 0 24px rgba(${cr},0.45)`
                      : isDone ? `0 0 6px rgba(${cr},0.6)` : 'none',
                  }}
                  animate={isCurr ? { scale: [1, 1.35, 1], opacity: [1, 0.75, 1] } : {}}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Node label */}
                <span
                  className="whitespace-nowrap rounded-lg px-2 py-0.5 text-[8.5px] font-semibold transition-all duration-300"
                  style={{
                    border:     `1px solid rgba(${cr},${isCurr ? '0.52' : isDone ? '0.32' : '0.18'})`,
                    background: `rgba(${cr},${isCurr ? '0.13' : isDone ? '0.07' : '0.03'})`,
                    color:      `rgba(${cr},${isCurr ? '1.0'  : isDone ? '0.85' : '0.45'})`,
                  }}
                >
                  {node}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── ServiceMatrix (export) ────────────────────────────────────────────────── */
export function ServiceMatrix() {
  const { t } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' });

  /* which side is active */
  const isLeftActive = activeIndex % 2 === 0;
  const activeAccent  = SERVICES[activeIndex].isCyan ? '#22d3ee' : '#f4b35b';
  const activeAccentR = SERVICES[activeIndex].isCyan ? '34,211,238' : '244,179,91';

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#020817] py-24">

      {/* ── Section background atmosphere ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black,transparent)]" />
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.04] blur-[100px]" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#020817] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#020817] to-transparent" />
      </div>

      <div className="container-x relative z-10">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.62, ease: 'easeOut' }}
          className="mb-10"
        >
          <p className="mb-3 flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.36em] text-cyan-300">
            <span className="inline-block size-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,.9)]" />
            {t.serviceMatrix.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.9rem,3.8vw,3.6rem)] font-black leading-tight tracking-[-0.04em] text-white">
            {t.serviceMatrix.title}
          </h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-8 text-slate-400">
            {t.serviceMatrix.description}
          </p>
        </motion.div>

        {/* ── Main orbit shell ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.18, duration: 0.70, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] p-6 md:p-8"
          style={{
            border:     '1px solid rgba(125,211,252,0.14)',
            background: 'radial-gradient(ellipse at 50% 15%, rgba(8,47,73,0.26), rgba(2,8,23,0.96))',
            boxShadow:  '0 0 90px rgba(34,211,238,0.07), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Inner HUD grid */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(34,211,238,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.035) 1px, transparent 1px)',
              backgroundSize:  '44px 44px',
              maskImage:       'radial-gradient(ellipse 90% 85% at 50% 50%, black, transparent)',
            }}
          />

          {/* Scanning line */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.18) 40%, rgba(125,211,252,0.28) 50%, rgba(34,211,238,0.18) 60%, transparent 100%)' }}
            animate={{ y: [0, 490, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />

          {/* ── HUD corner brackets ── */}
          <div className="pointer-events-none absolute left-5 top-5">
            <div className="absolute left-0 top-0 h-7 w-[2px] bg-gradient-to-b from-cyan-400/55 to-transparent" />
            <div className="absolute left-0 top-0 h-[2px] w-7 bg-gradient-to-r from-cyan-400/55 to-transparent" />
          </div>
          <div className="pointer-events-none absolute right-5 top-5">
            <div className="absolute right-0 top-0 h-7 w-[2px] bg-gradient-to-b from-cyan-400/55 to-transparent" />
            <div className="absolute right-0 top-0 h-[2px] w-7 bg-gradient-to-l from-cyan-400/55 to-transparent" />
          </div>
          <div className="pointer-events-none absolute bottom-5 left-5">
            <div className="absolute bottom-0 left-0 h-7 w-[2px] bg-gradient-to-t from-amber-400/45 to-transparent" />
            <div className="absolute bottom-0 left-0 h-[2px] w-7 bg-gradient-to-r from-amber-400/45 to-transparent" />
          </div>
          <div className="pointer-events-none absolute bottom-5 right-5">
            <div className="absolute bottom-0 right-0 h-7 w-[2px] bg-gradient-to-t from-amber-400/45 to-transparent" />
            <div className="absolute bottom-0 right-0 h-[2px] w-7 bg-gradient-to-l from-amber-400/45 to-transparent" />
          </div>

          {/* STATUS BADGES */}
          <div className="pointer-events-none absolute right-14 top-[22px] hidden items-center gap-2 sm:flex">
            <motion.span className="size-1.5 rounded-full bg-emerald-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
            <span className="font-mono text-[7.5px] font-black tracking-[0.22em] text-emerald-300/65">SERVICE MATRIX ONLINE</span>
          </div>
          <div className="pointer-events-none absolute bottom-[22px] left-14 hidden items-center gap-2 sm:flex">
            <span className="size-1.5 rounded-full bg-cyan-400/60 shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
            <span className="font-mono text-[7.5px] tracking-[0.20em] text-cyan-400/48">6 SERVICE NODES ACTIVE</span>
          </div>

          {/* Star particles */}
          {([
            { x:'7%',  y:'12%', s:1.5, o:0.38 },
            { x:'19%', y:'6%',  s:1.0, o:0.28 },
            { x:'36%', y:'9%',  s:1.5, o:0.32 },
            { x:'63%', y:'7%',  s:1.0, o:0.28 },
            { x:'82%', y:'13%', s:1.5, o:0.36 },
            { x:'92%', y:'22%', s:1.0, o:0.24 },
            { x:'89%', y:'78%', s:1.5, o:0.30 },
            { x:'10%', y:'84%', s:1.0, o:0.26 },
            { x:'51%', y:'4%',  s:1.0, o:0.22 },
            { x:'29%', y:'92%', s:1.5, o:0.28 },
            { x:'74%', y:'88%', s:1.0, o:0.24 },
          ] as { x:string; y:string; s:number; o:number }[]).map((p, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute rounded-full bg-white"
              style={{ left: p.x, top: p.y, width: p.s, height: p.s, opacity: p.o }}
              animate={{ opacity: [p.o, p.o * 0.25, p.o] }}
              transition={{ duration: 2.5 + i * 0.35, repeat: Infinity, ease: 'easeInOut', delay: i * 0.28 }}
            />
          ))}

          {/* ── Desktop: 3-column grid ── */}
          <div className="relative hidden md:grid md:grid-cols-[1fr_280px_1fr] md:items-stretch md:gap-6">

            {/* Connector beam overlay */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <motion.div
                animate={{ opacity: isLeftActive ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ right: '50%', left: '10%', height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.40) 55%, rgba(34,211,238,0.70) 100%)' }}
              />
              {isLeftActive && (
                <motion.div
                  key={`ld-${activeIndex}`}
                  className="absolute top-1/2 -mt-1 size-2 -translate-y-1/2 rounded-full"
                  style={{ background: activeAccent, boxShadow: `0 0 8px ${activeAccent}` }}
                  animate={{ left: ['50%', '10%'] }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: 'linear', repeatDelay: 0.7 }}
                />
              )}
              <motion.div
                animate={{ opacity: !isLeftActive ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: '50%', right: '10%', height: '1px', background: 'linear-gradient(90deg, rgba(244,179,91,0.70) 0%, rgba(244,179,91,0.40) 45%, transparent 100%)' }}
              />
              {!isLeftActive && (
                <motion.div
                  key={`rd-${activeIndex}`}
                  className="absolute top-1/2 -mt-1 size-2 -translate-y-1/2 rounded-full"
                  style={{ background: activeAccent, boxShadow: `0 0 8px ${activeAccent}` }}
                  animate={{ left: ['50%', '90%'] }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: 'linear', repeatDelay: 0.7 }}
                />
              )}
            </div>

            {/* Left column: services 0, 2, 4 */}
            <div className="flex flex-col justify-center gap-3 py-4">
              {[0, 2, 4].map((idx, col_i) => (
                <ServiceNode
                  key={SERVICES[idx].title}
                  service={SERVICES[idx]}
                  index={idx}
                  isActive={activeIndex === idx}
                  onClick={() => setActiveIndex(idx)}
                  delay={col_i * 0.07}
                  titleText={t.serviceMatrix.services[idx]?.title ?? SERVICES[idx].title}
                  descText={t.serviceMatrix.services[idx]?.desc ?? SERVICES[idx].desc}
                  tagsText={t.serviceMatrix.services[idx]?.tags ?? [...SERVICES[idx].tags]}
                />
              ))}
            </div>

            {/* Center orbit */}
            <OrbitCore activeIndex={activeIndex} />

            {/* Right column: services 1, 3, 5 */}
            <div className="flex flex-col justify-center gap-3 py-4">
              {[1, 3, 5].map((idx, col_i) => (
                <ServiceNode
                  key={SERVICES[idx].title}
                  service={SERVICES[idx]}
                  index={idx}
                  isActive={activeIndex === idx}
                  onClick={() => setActiveIndex(idx)}
                  delay={col_i * 0.07}
                  titleText={t.serviceMatrix.services[idx]?.title ?? SERVICES[idx].title}
                  descText={t.serviceMatrix.services[idx]?.desc ?? SERVICES[idx].desc}
                  tagsText={t.serviceMatrix.services[idx]?.tags ?? [...SERVICES[idx].tags]}
                />
              ))}
            </div>
          </div>

          {/* ── Mobile: vertical list ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {SERVICES.map((s, i) => (
              <ServiceNode
                key={s.title}
                service={s}
                index={i}
                isActive={activeIndex === i}
                onClick={() => setActiveIndex(i)}
                delay={i * 0.05}
                titleText={t.serviceMatrix.services[i]?.title ?? s.title}
                descText={t.serviceMatrix.services[i]?.desc ?? s.desc}
                tagsText={t.serviceMatrix.services[i]?.tags ?? [...s.tags]}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Service chain ── */}
        <ServiceChain chain={t.serviceMatrix.chain} />
      </div>
    </section>
  );
}
