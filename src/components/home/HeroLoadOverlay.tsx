'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const bootSteps = ['YIWU HUB ONLINE', 'ROUTES SYNC', 'FBA READY'];

export function HeroLoadOverlay({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    const tick = () => {
      const progress = Math.min(1, (performance.now() - started) / 1850);
      setPercent(Math.round(progress * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        window.sessionStorage.setItem('geyun-hero-booted', 'true');
        window.setTimeout(onComplete, 420);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ opacity: 0, clipPath: 'inset(0% 50% 0% 50%)' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#020617]"
    >
      <div className="startup-grid absolute inset-0" />
      <div className="startup-scan absolute inset-x-0 top-1/2 h-px" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.18),transparent_28rem)]" />
      <div className="relative grid place-items-center text-center">
        <div className="startup-ring absolute size-72 rounded-full md:size-96" />
        <motion.div initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="relative z-10">
          <div className="mx-auto mb-8 grid size-20 place-items-center rounded-full border border-amber-200/40 bg-amber-300/10 font-display text-4xl font-black text-amber-200 shadow-[0_0_60px_rgba(244,179,91,.28)]">G</div>
          <p className="font-display text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">歌运物流</p>
          <p className="mt-3 text-xs font-black uppercase tracking-[0.42em] text-cyan-200">GLOBAL LOGISTICS COMMAND SYSTEM</p>
          <div className="mx-auto mt-8 h-1.5 w-72 overflow-hidden rounded-full bg-white/10 md:w-96">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-white to-amber-300 shadow-[0_0_24px_rgba(34,211,238,.75)]" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-black tabular-nums text-cyan-100">
            <span>SYSTEM BOOT</span>
            <span>{percent}%</span>
          </div>
          <div className="mt-8 grid gap-2 sm:grid-cols-3">
            {bootSteps.map((step, index) => (
              <motion.span key={step} initial={{ opacity: 0.25 }} animate={{ opacity: [0.25, 1, 0.55] }} transition={{ delay: index * 0.18, duration: 1.2, repeat: Infinity }} className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100">
                {step}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
