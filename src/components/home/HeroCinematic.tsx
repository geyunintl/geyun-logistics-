'use client';

import { motion, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import styles from './HeroCinematic.module.css';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type StatItem = {
  value: number;
  suffix: string;
  label: string;
  icon: string;
};

/* ─── Data ──────────────────────────────────────────────────────────────── */

const heroStats: StatItem[] = [
  { value: 2017,   suffix: '',    label: '公司成立',     icon: '◉' },
  { value: 1000,   suffix: '万',  label: '注册资金',     icon: '▣' },
  { value: 12,     suffix: '+',   label: '分公司布局',   icon: '⌂' },
  { value: 12000,  suffix: '㎡',  label: '仓储面积',     icon: '▤' },
  { value: 200,    suffix: '+',   label: '海运专线',     icon: '⇄' },
  { value: 200000, suffix: 'ft²', label: '洛杉矶海外仓', icon: '⬢' },
];

// Fixed particle positions on right half — deterministic, no hydration mismatch
const PARTICLES = [
  { x: 72, y: 13, s: 2.5, d: 0.0,  dur: 5.2 },
  { x: 59, y: 27, s: 2.0, d: 0.9,  dur: 4.8 },
  { x: 82, y: 36, s: 1.8, d: 1.6,  dur: 6.0 },
  { x: 68, y: 51, s: 2.2, d: 0.4,  dur: 5.5 },
  { x: 76, y: 21, s: 1.5, d: 2.2,  dur: 4.6 },
  { x: 88, y: 17, s: 2.0, d: 1.2,  dur: 5.8 },
  { x: 56, y: 43, s: 2.4, d: 1.8,  dur: 4.9 },
  { x: 85, y: 55, s: 1.8, d: 0.7,  dur: 6.2 },
  { x: 63, y: 19, s: 2.0, d: 2.0,  dur: 5.1 },
  { x: 79, y: 67, s: 1.5, d: 1.4,  dur: 5.6 },
];

/* ─── StatCard ──────────────────────────────────────────────────────────── */

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const [count, setCount] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const controls = animate(0, stat.value, {
      duration: 1.9,
      delay: 0.35 + index * 0.11,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [stat.value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 11 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 + index * 0.09, duration: 0.48, ease: 'easeOut' }}
      className="flex items-center gap-2.5 border-white/8 px-2 py-2 lg:border-r lg:px-3"
    >
      <motion.span
        className="grid size-8 shrink-0 place-items-center rounded-full border border-amber-200/22 bg-amber-200/8 text-xs font-black text-amber-200"
        animate={{
          boxShadow: [
            '0 0 8px rgba(244,179,91,.14)',
            '0 0 22px rgba(244,179,91,.52)',
            '0 0 8px rgba(244,179,91,.14)',
          ],
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 + index * 0.32 }}
      >
        {stat.icon}
      </motion.span>
      <div>
        <div className="font-display text-base font-black leading-none text-white md:text-xl">
          {count}<span>{stat.suffix}</span>
        </div>
        <div className="mt-0.5 text-[9.5px] font-semibold tracking-[0.1em] text-slate-400">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── HeroStatsBar ──────────────────────────────────────────────────────── */

export function HeroStatsBar() {
  return (
    <div className="cinematic-stats absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-white/8 bg-slate-950/55 backdrop-blur-xl">
      <div className={styles.scanLine} aria-hidden="true" />
      <div className="container-x grid grid-cols-2 gap-px py-3 sm:grid-cols-3 lg:grid-cols-6">
        {heroStats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ─── HeroGlobeOverlay ──────────────────────────────────────────────────── */

export function HeroGlobeOverlay() {
  return (
    <div
      className="pointer-events-none absolute right-[5%] top-[6%] z-[15] hidden h-[44vh] w-[44vh] md:block"
      aria-hidden="true"
    >
      <svg viewBox="0 0 440 440" fill="none" className="h-full w-full opacity-80">
        <defs>
          <linearGradient id="hcGlobeGold" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%"   stopColor="#f4b35b" stopOpacity="0" />
            <stop offset="50%"  stopColor="#fcd58d" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="hcGlobeCyan" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="55%"  stopColor="#7dd3fc" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#f4b35b" stopOpacity="0.22" />
          </linearGradient>
          <filter id="hcNodeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Animated route lines */}
        <path
          className={styles.routeLine}
          d="M82 314 C 169 147, 356 118, 509 226"
          stroke="url(#hcGlobeGold)" strokeWidth="1.8" strokeLinecap="round"
        />
        <path
          className={`${styles.routeLine} ${styles.routeLineD1}`}
          d="M92 372 C 218 242, 402 247, 536 363"
          stroke="url(#hcGlobeCyan)" strokeWidth="1.4" strokeLinecap="round"
        />
        <path
          className={`${styles.routeLine} ${styles.routeLineD2}`}
          d="M170 178 C 264 374, 374 430, 512 300"
          stroke="url(#hcGlobeGold)" strokeWidth="1.1" strokeLinecap="round"
        />

        {/* Pulsing nodes */}
        <circle className={styles.routeNode}                      cx="162" cy="268" r="4"   fill="#67e8f9" filter="url(#hcNodeGlow)" />
        <circle className={`${styles.routeNode} ${styles.routeNodeD1}`} cx="406" cy="220" r="3.5" fill="#f4b35b" filter="url(#hcNodeGlow)" />
        <circle className={`${styles.routeNode} ${styles.routeNodeD2}`} cx="476" cy="354" r="4"   fill="#67e8f9" filter="url(#hcNodeGlow)" />
        <circle className={`${styles.routeNode} ${styles.routeNodeD3}`} cx="256" cy="174" r="3"   fill="#f4b35b" filter="url(#hcNodeGlow)" />
      </svg>
    </div>
  );
}

/* ─── HeroPlaneTrail ────────────────────────────────────────────────────── */

export function HeroPlaneTrail() {
  return (
    <div
      className="pointer-events-none absolute right-[10%] top-[3%] z-[14] hidden h-[24vh] w-[42vw] md:block"
      aria-hidden="true"
    >
      <svg viewBox="0 0 680 240" fill="none" preserveAspectRatio="xMaxYMin meet" className="h-full w-full">
        <defs>
          <linearGradient id="hcTrailCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="65%"  stopColor="#7dd3fc" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id="hcTrailGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f4b35b" stopOpacity="0" />
            <stop offset="60%"  stopColor="#fcd58d" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#f4b35b" stopOpacity="0.72" />
          </linearGradient>
        </defs>
        <path
          className={styles.planeTrail}
          d="M0 185 C 220 130, 440 82, 680 44"
          stroke="url(#hcTrailCyan)" strokeWidth="1.6" strokeLinecap="round"
        />
        <path
          className={`${styles.planeTrail} ${styles.planeTrailD1}`}
          d="M48 202 C 258 150, 468 106, 680 68"
          stroke="url(#hcTrailGold)" strokeWidth="1.0" strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ─── HeroParticles ─────────────────────────────────────────────────────── */

export function HeroParticles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[13] hidden overflow-hidden md:block"
      aria-hidden="true"
    >
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-cyan-300"
          style={{
            left: `${p.x}%`,
            top:  `${p.y}%`,
            width:  p.s,
            height: p.s,
            boxShadow: `0 0 ${p.s * 3}px rgba(34,211,238,.78)`,
          }}
          animate={{ y: [-7, 7, -7], opacity: [0.18, 0.65, 0.18] }}
          transition={{ duration: p.dur, delay: p.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

