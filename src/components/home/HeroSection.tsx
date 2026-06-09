'use client';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { homeData } from '@/data/home';
import { Button } from '@/components/ui/Button';
import { HeroVisualSystem } from '@/components/home/HeroVisualSystem';
import { HeroLoadOverlay } from '@/components/home/HeroLoadOverlay';
import {
  HeroStatsBar,
  HeroGlobeOverlay,
  HeroPlaneTrail,
  HeroParticles,
} from '@/components/home/HeroCinematic';

export function HeroSection() {
  const [showLoader, setShowLoader] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 0.4 });
  const bgX = useTransform(smoothX, [-1, 1], [-16, 16]);
  const bgY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const contentX = useTransform(smoothX, [-1, 1], [6, -6]);
  const contentY = useTransform(smoothY, [-1, 1], [4, -4]);
  const titleChars = useMemo(() => Array.from(homeData.hero.title), []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setShowLoader(window.sessionStorage.getItem('geyun-hero-booted') !== 'true');
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(max-width: 767px)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#020817] pt-24"
    >
      <AnimatePresence>
        {showLoader ? <HeroLoadOverlay onComplete={() => setShowLoader(false)} /> : null}
      </AnimatePresence>

      {/* Background — clean image, no baked-in text */}
      <motion.div className="pointer-events-none absolute inset-[-2%] z-0" style={{ x: bgX, y: bgY }}>
        <HeroVisualSystem />
      </motion.div>

      {/* Cinematic overlays */}
      <HeroPlaneTrail />
      <HeroGlobeOverlay />
      <HeroParticles />

      {/* Content — left-pinned */}
      <motion.div
        className="relative z-10 w-full max-w-screen-xl pb-32 pl-4 pt-4 sm:pl-6 lg:pb-36 lg:pl-10 xl:pl-14"
        style={{ x: contentX, y: contentY }}
      >
        <div className="max-w-[560px]">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-7 flex items-center gap-3"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-full border border-amber-200/45 bg-amber-300/10 font-display text-xl font-black text-amber-200 shadow-[0_0_28px_rgba(244,179,91,.30)]">
              G
            </div>
            <div>
              <p className="font-display text-[1.05rem] font-black leading-none tracking-[-0.01em] text-white">歌运物流</p>
              <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.32em] text-amber-200/75">GEYUN LOGISTICS</p>
            </div>
          </motion.div>

          {/* Title */}
          <h1
            aria-label={homeData.hero.title}
            className="font-display text-[clamp(2.2rem,4.8vw,5.2rem)] font-black leading-[1.04] tracking-[-0.06em] text-white text-glow-cyan"
          >
            {titleChars.map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                aria-hidden="true"
                initial={{ opacity: 0, y: 36, filter: 'blur(14px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.22 + index * 0.026, duration: 0.55, ease: 'easeOut' }}
                className={
                  char === '义' || char === '乌' || char === '全' || char === '球'
                    ? 'inline-block bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent'
                    : 'inline-block'
                }
              >
                {char === '，' ? <><span>，</span><br /></> : char}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: 'easeOut' }}
            className="mt-6 max-w-md text-sm leading-7 text-slate-300 md:text-[15px] md:leading-8"
          >
            {homeData.hero.subtitle}
          </motion.p>

          {/* Service tags */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.22, duration: 0.6 }}
            className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] font-semibold tracking-[0.04em] text-slate-300"
          >
            {['美线专线', 'FBA 入仓', '海外仓', '海运空运', '一件代发', '尾程派送'].map((tag) => (
              <span key={tag} className="flex items-center gap-1.5">
                <span className="size-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,.9)]" />
                {tag}
              </span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.34, duration: 0.6 }}
            className="mt-7 flex flex-wrap gap-4"
          >
            <Button href="#quote" className="energy-button shadow-[0_0_48px_rgba(34,211,238,.40)]">
              {homeData.hero.primaryCta}
            </Button>
            <Button href="#channels" variant="ghost" className="energy-button">
              {homeData.hero.secondaryCta}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats bar — animated, correct values, no 0 bug */}
      <HeroStatsBar />
    </section>
  );
}
