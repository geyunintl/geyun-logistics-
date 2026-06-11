'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { warehouseVideos } from '@/data/warehouse';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLang } from '@/context/LangContext';

// Ambient video that autoplays silently, falls back to poster image
function AmbientVideo({
  src,
  poster,
  alt,
  className,
}: {
  src?: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        className={className}
      />
    );
  }
  return (
    <Image
      src={poster}
      alt={alt}
      fill
      className={className}
      sizes="(max-width:1024px) 100vw, 60vw"
    />
  );
}

export function WarehouseVideoWall() {
  const { t } = useLang();
  const tags = t.warehouse.tags;
  const [main, ...rest] = warehouseVideos;
  return (
    <section className="container-x py-28">
      <SectionHeading
        eyebrow={t.warehouse.eyebrow}
        title={t.warehouse.title}
        description={t.warehouse.description}
      />
      <div className="relative overflow-hidden rounded-[3rem] border border-cyan-200/10 bg-slate-950/72 p-5 shadow-[0_0_90px_rgba(34,211,238,.10)] md:p-7">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="relative grid gap-5 lg:grid-cols-[1.35fr_.9fr]">

          {/* ── Main large card ── */}
          <motion.div
            whileHover={{ scale: 1.012 }}
            className="group relative min-h-[500px] overflow-hidden rounded-[2.5rem] border border-cyan-200/15 bg-black"
          >
            <AmbientVideo
              src={main.src}
              poster={main.poster}
              alt={main.title}
              className="absolute inset-0 h-full w-full object-cover opacity-[0.78] transition-[transform,opacity] duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Top tags */}
            <div className="absolute left-6 top-6 flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cyan-200/20 bg-slate-950/55 px-3 py-1 text-xs font-black text-cyan-100 backdrop-blur-xl"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Live badge */}
            {main.src && (
              <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full border border-red-400/30 bg-slate-950/70 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-300">LIVE FOOTAGE</span>
              </div>
            )}

            <div className="absolute bottom-0 p-8">
              <span className="rounded-full bg-cyan-300 px-4 py-2 text-xs font-black text-slate-950">
                4K REAL FOOTAGE
              </span>
              <h3 className="mt-5 font-display text-4xl font-black">{main.title}</h3>
              <p className="mt-3 max-w-xl text-slate-200">{main.description}</p>
            </div>
          </motion.div>

          {/* ── Side cards ── */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((item, index) => (
              <motion.article
                key={item.title}
                whileHover={{ x: 6, scale: 1.025 }}
                className="group relative min-h-36 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04]"
              >
                <AmbientVideo
                  src={item.src}
                  poster={item.poster}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-50 transition-[transform,opacity] duration-500 group-hover:scale-110 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/72 to-transparent" />
                <div className="relative p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200">
                      {tags[index + 2] ?? '作业'}
                    </span>
                    {item.src && (
                      <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-300">
                        VIDEO
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 text-xl font-black text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
