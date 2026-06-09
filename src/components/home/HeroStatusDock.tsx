'use client';

import { motion } from 'framer-motion';

const statuses = [
  { label: 'YIWU HUB', value: 'ONLINE', tone: 'cyan' },
  { label: 'US WEST', value: 'ETA 12D', tone: 'gold' },
  { label: 'FBA APPOINTMENT', value: 'READY', tone: 'cyan' },
  { label: 'OVERSEAS WH', value: 'SYNC', tone: 'cyan' },
  { label: 'LAST MILE', value: 'TRACKING', tone: 'gold' },
];

export function HeroStatusDock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.45, duration: 0.8, ease: 'easeOut' }}
      className="pointer-events-none absolute bottom-5 left-1/2 z-20 hidden w-[min(1180px,calc(100%-32px))] -translate-x-1/2 grid-cols-5 gap-3 lg:grid"
    >
      {statuses.map((item, index) => (
        <div key={item.label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/52 px-4 py-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
          <div className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${item.tone === 'gold' ? 'bg-amber-300 shadow-[0_0_16px_rgba(244,179,91,.9)]' : 'bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,.9)]'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{item.label}</span>
          </div>
          <p className="mt-2 font-display text-lg font-black text-white">{item.value}</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/8">
            <motion.div initial={{ width: '20%' }} animate={{ width: ['20%', '92%', '58%', '100%'] }} transition={{ delay: index * 0.12, duration: 3.2, repeat: Infinity, repeatType: 'mirror' }} className="h-full rounded-full bg-cyan-300" />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
