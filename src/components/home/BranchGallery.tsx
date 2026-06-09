'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';

// ─── Branch data — network diagram positions ────────────────────────────────────
// viewBox 0 0 880 780  |  HQ at center (440, 380)
// Pentagon formation radius ≈ 215; positions chosen to mirror geography:
//   Taiyuan  → top        (440, 165)   angle = -90°
//   Quanzhou → upper-R    (644, 314)   angle = -18°
//   Shenzhen → lower-R    (566, 554)   angle = +54°
//   Changsha → lower-L    (314, 554)   angle = +126°
//   Wuhan    → upper-L    (236, 314)   angle = +198°
const BRANCHES = [
  {
    city: '义乌总部', cityShort: '义乌', en: 'YIWU HQ', region: '华东核心',
    desc: '以义乌为核心枢纽，统筹客户对接、货物集散、仓储分拨与跨境物流方案匹配，辐射全国分公司协同运营。',
    tags: ['总部调度', '货源集散', '仓储分拨', '方案匹配'],
    image: '/assets/geyun/real/enhanced/d3a59e691c3b236106f3962b0e0f6da7.jpg',
    isHQ: true, x: 440, y: 380,
  },
  {
    city: '深圳分公司', cityShort: '深圳', en: 'SHENZHEN BRANCH', region: '华南市场',
    desc: '深耕华南跨境电商产业带，服务平台卖家、独立站客户与高频补货需求，快速衔接美线头程资源。',
    tags: ['华南市场', '跨境卖家', '高频补货', '快速响应'],
    image: '/assets/geyun/geyun_premium_assets/02_branch_photos_dark_overlay/branch_shenzhen_dark_hero.jpg',
    isHQ: false, x: 566, y: 554,
  },
  {
    city: '泉州分公司', cityShort: '泉州', en: 'QUANZHOU BRANCH', region: '福建产业带',
    desc: '服务福建及周边产业带客户，衔接服饰、鞋包、轻工等出口货源，提供海运头程与出运全程支持。',
    tags: ['福建产业带', '外贸货源', '海运出运', '客户服务'],
    image: '/assets/geyun/geyun_premium_assets/02_branch_photos_dark_overlay/branch_quanzhou_dark_hero.jpg',
    isHQ: false, x: 644, y: 314,
  },
  {
    city: '武汉分公司', cityShort: '武汉', en: 'WUHAN BRANCH', region: '华中区域',
    desc: '辐射华中区域跨境卖家，提升中部市场物流响应效率，联动义乌总部实现货物集散与干线调度。',
    tags: ['华中区域', '中部市场', '分拨协同', '节点响应'],
    image: '/assets/geyun/geyun_premium_assets/02_branch_photos_dark_overlay/branch_wuhan_dark_hero.jpg',
    isHQ: false, x: 236, y: 314,
  },
  {
    city: '太原分公司', cityShort: '太原', en: 'TAIYUAN BRANCH', region: '华北市场',
    desc: '拓展华北及周边市场服务触点，增强北方区域跨境业务触达能力，提供贴近客户的本地化物流支持。',
    tags: ['华北服务', '区域触达', '客户响应', '渠道协同'],
    image: '/assets/geyun/geyun_premium_assets/02_branch_photos_dark_overlay/branch_taiyuan_dark_hero.jpg',
    isHQ: false, x: 440, y: 165,
  },
  {
    city: '长沙分公司', cityShort: '长沙', en: 'CHANGSHA BRANCH', region: '中南市场',
    desc: '连接中南区域跨境电商卖家与外贸出运客户，扩展歌运中南服务网络，协同全国节点高效响应。',
    tags: ['中南市场', '新设分公司', '服务延伸', '协同响应'],
    image: '/assets/geyun/geyun_premium_assets/02_branch_photos_dark_overlay/branch_changsha_dark_hero.jpg',
    isHQ: false, x: 314, y: 554,
  },
];

const STATS = [
  { label: '调度核心', value: 'YIWU HQ' },
  { label: '全国布局', value: '6 城' },
  { label: '仓储规模', value: '12000㎡' },
  { label: '响应速度', value: '24H' },
  { label: '网络协同', value: '多地联动' },
  { label: '核心航线', value: '美线专线' },
];

// ─── Network arcs from HQ (440,380) → each branch ─────────────────────────────
const ARCS: Record<string, string> = {
  '深圳分公司': 'M 440,380 Q 532,452 566,554',
  '泉州分公司': 'M 440,380 Q 562,287 644,314',
  '武汉分公司': 'M 440,380 Q 318,287 236,314',
  '太原分公司': 'M 440,380 Q 465,258 440,165',
  '长沙分公司': 'M 440,380 Q 348,452 314,554',
};

const HQ = BRANCHES[0];

// ─── B: Pentagon mesh — edges between the 5 branches (outward-bowing beziers) ──
const MESH_ARCS = [
  { d: 'M 440,165 Q 568,205 644,314' },  // Taiyuan → Quanzhou
  { d: 'M 644,314 Q 652,450 566,554' },  // Quanzhou → Shenzhen
  { d: 'M 566,554 Q 440,606 314,554' },  // Shenzhen → Changsha (bows south)
  { d: 'M 314,554 Q 228,450 236,314' },  // Changsha → Wuhan
  { d: 'M 236,314 Q 308,199 440,165' },  // Wuhan → Taiyuan
];

// ─── C: Satellite service chips — 2 per branch, outside node circle ────────────
const SATELLITE_TAGS: Record<string, { label: string; dx: number; dy: number }[]> = {
  '深圳分公司': [{ label: '华南专线', dx: 74, dy: -16 }, { label: '卖家仓配', dx: 74, dy: 16 }],
  '泉州分公司': [{ label: '海运出运', dx: 70, dy: -16 }, { label: '鞋服集货', dx: 70, dy: 16 }],
  '武汉分公司': [{ label: '华中集拼', dx: -74, dy: -16 }, { label: '干线协同', dx: -74, dy: 16 }],
  '太原分公司': [{ label: '华北辐射', dx: -64, dy: -42 }, { label: '区域到门', dx: 64, dy: -42 }],
  '长沙分公司': [{ label: '中南布点', dx: -74, dy: -16 }, { label: '协同响应', dx: -74, dy: 16 }],
};

// Radar center = HQ, r covers full network
const RC = { x: 440, y: 380, r: 278 };

// HQ pointy-top hexagon, circumradius 54, center (440,380)
// sin60° ≈ 0.866 → 54*0.866≈46.8  cos60°=0.5 → 54*0.5=27
const HQ_HEX   = '440,326 487,353 487,407 440,434 393,407 393,353';  // R=54
const HQ_RING1 = '440,316 496,348 496,412 440,444 384,412 384,348';  // R=64
const HQ_RING2 = '440,303 506,339 506,421 440,457 374,421 374,339';  // R=77

// ─── Component ────────────────────────────────────────────────────────────────
export function BranchGallery() {
  const [activeCity, setActiveCity] = useState('义乌总部');
  const [hoverCity,  setHoverCity]  = useState<string | null>(null);
  const [inView,     setInView]     = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const highlightedCity = hoverCity ?? activeCity;
  const activeBranch = useMemo(
    () => BRANCHES.find((b) => b.city === activeCity) ?? BRANCHES[0],
    [activeCity],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const subBranches = BRANCHES.filter((b) => !b.isHQ);

  // Radar 60° sweep sector: leading edge at +60° from north
  const rrSin60 = RC.r * 0.866; // ≈ 241
  const rrCos60 = RC.r * 0.5;   // ≈ 139

  return (
    <section ref={sectionRef} className="container-x py-28">

      {/* ── Section heading ── */}
      <SectionHeading
        align="center"
        eyebrow="CHINA SERVICE NETWORK"
        title="中国服务网络指挥图"
        description="以义乌总部为调度核心，联动深圳、泉州、武汉、太原、长沙分公司，深入产业带与跨境卖家一线，形成从货源集散、仓储分拨到美线出运的全国协同服务网络。"
      />

      {/* ── Main grid ── */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">

        {/* ═══ LEFT · Radial Network Diagram ═══ */}
        <div className="relative min-h-[580px] overflow-hidden rounded-[2.4rem] border border-cyan-400/[0.12] bg-slate-950/85">
          {/* Ambient glow behind SVG */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 65% at 50% 49%, rgba(8,47,73,0.65), transparent)' }}
          />

          {/* Corner decoration labels */}
          <div className="absolute top-5 left-5 z-10 text-[9px] font-black tracking-[0.32em] text-cyan-400/55 uppercase select-none">
            Network Command
          </div>
          <div className="absolute top-5 right-5 z-10 flex items-center gap-1.5 select-none">
            <span className="size-1.5 rounded-full bg-cyan-400" style={{ animation: 'energy-pulse 2s ease-in-out infinite' }} />
            <span className="text-[9px] font-black text-cyan-400/55 tracking-widest">SYS.LIVE</span>
          </div>
          <div className="absolute bottom-5 left-5 z-10 text-[8px] font-mono text-slate-600 tracking-widest select-none">
            GEYUN LOGISTICS © 2026
          </div>

          {/* ── SVG network diagram ── */}
          <svg
            viewBox="0 0 880 780"
            className="absolute inset-0 w-full h-full"
            aria-label="歌运物流全国服务网络"
          >
            <defs>
              {/* Diamond background tessellation */}
              <pattern id="b6hex" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M 18,0 L 36,18 L 18,36 L 0,18 Z"
                  fill="none" stroke="rgba(34,211,238,0.05)" strokeWidth="0.55" />
              </pattern>

              {/* Deep center radial glow */}
              <radialGradient id="b6netbg" cx="50%" cy="49%" r="48%">
                <stop offset="0%"   stopColor="rgba(8,47,73,0.60)" />
                <stop offset="55%"  stopColor="rgba(4,22,38,0.28)" />
                <stop offset="100%" stopColor="rgba(2,8,23,0.04)" />
              </radialGradient>

              {/* HQ golden ambient glow */}
              <radialGradient id="b6hqglow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(244,179,91,0.55)" />
                <stop offset="55%"  stopColor="rgba(244,179,91,0.18)" />
                <stop offset="100%" stopColor="rgba(244,179,91,0)" />
              </radialGradient>

              {/* ── Photo clip paths ── */}
              {/* HQ pointy-top hexagon R=54 */}
              <clipPath id="clipHQ">
                <polygon points={HQ_HEX} />
              </clipPath>
              {/* Branch circles r=42 */}
              {subBranches.map((branch) => (
                <clipPath key={`cp_${branch.city}`} id={`cp_${branch.en.split(' ')[0]}`}>
                  <circle cx={branch.x} cy={branch.y} r={42} />
                </clipPath>
              ))}
            </defs>

            {/* ── Diamond grid — full background ── */}
            <rect x="0" y="0" width="880" height="780" fill="url(#b6hex)" opacity="0.9" />

            {/* ── Deep glow from center ── */}
            <rect x="0" y="0" width="880" height="780" fill="url(#b6netbg)" />

            {/* ── Concentric orbit rings around HQ ── */}
            {[102, 178, 248, 312].map((r, i) => (
              <circle key={r} cx={440} cy={380} r={r}
                fill="none"
                stroke="rgba(34,211,238,0.055)"
                strokeWidth={i === 0 ? 0.9 : 0.7}
                strokeDasharray={i === 0 ? undefined : '5 20'}
                style={{ opacity: inView ? 1 : 0, transition: `opacity 0.9s ease ${0.2 + i * 0.18}s` }}
              />
            ))}

            {/* ── B: Secondary mesh — pentagon edge arcs between branches ── */}
            {MESH_ARCS.map((edge, i) => (
              <g key={`mesh_${i}`}>
                {/* Soft outer glow */}
                <path d={edge.d} fill="none"
                  stroke="rgba(34,211,238,0.07)" strokeWidth="5"
                  style={{ filter: 'blur(3px)', opacity: inView ? 1 : 0, transition: `opacity 0.8s ease ${1.4 + i * 0.14}s` }}
                />
                {/* Main mesh line */}
                <path d={edge.d} fill="none"
                  stroke="rgba(34,211,238,0.20)" strokeWidth="0.85"
                  strokeDasharray="3 18"
                  style={{ opacity: inView ? 1 : 0, transition: `opacity 0.8s ease ${1.4 + i * 0.14}s` }}
                />
                {/* Slow secondary flow particle */}
                {inView && (
                  <circle r={2} fill="rgba(34,211,238,0.72)"
                    style={{ filter: 'drop-shadow(0 0 3px rgba(34,211,238,0.80))' }}>
                    <animateMotion
                      dur={`${4.0 + i * 0.6}s`} repeatCount="indefinite"
                      begin={`${i * 0.8}s`} path={edge.d}
                    />
                  </circle>
                )}
              </g>
            ))}

            {/* ── Arc flight lines ── */}
            {subBranches.map((branch, i) => {
              const isHL = highlightedCity === branch.city;
              const arcD = ARCS[branch.city];
              if (!arcD) return null;
              return (
                <g key={`arc_${branch.city}`}>
                  {/* Soft glow halo */}
                  <path d={arcD} fill="none"
                    stroke={isHL ? 'rgba(244,179,91,0.22)' : 'rgba(34,211,238,0.10)'}
                    strokeWidth={isHL ? 9 : 6}
                    style={{
                      filter: 'blur(4px)',
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.55s ease ${0.9 + i * 0.14}s, stroke 0.3s ease`,
                    }}
                  />
                  {/* Main arc line */}
                  <path d={arcD} fill="none"
                    stroke={isHL ? 'rgba(244,179,91,0.80)' : 'rgba(34,211,238,0.35)'}
                    strokeWidth={isHL ? 2.4 : 1.6}
                    strokeDasharray={isHL ? '9 6' : '5 11'}
                    style={{
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.55s ease ${0.9 + i * 0.14}s, stroke 0.3s ease, stroke-width 0.3s ease`,
                    }}
                  />
                  {/* Flow particle */}
                  {inView && (
                    <circle
                      r={isHL ? 4.5 : 3.2}
                      fill={isHL ? '#f4b35b' : '#22d3ee'}
                      style={{
                        filter: `drop-shadow(0 0 ${isHL ? 10 : 6}px ${isHL ? 'rgba(244,179,91,0.95)' : 'rgba(34,211,238,0.90)'})`,
                      }}
                    >
                      <animateMotion
                        dur={`${2.0 + i * 0.35}s`}
                        repeatCount="indefinite"
                        begin={`${i * 0.48}s`}
                        path={arcD}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* ── Rotating radar sweep (SVG-native SMIL) ── */}
            {inView && (
              <g>
                <path
                  d={`M ${RC.x},${RC.y} L ${RC.x},${RC.y - RC.r} A ${RC.r},${RC.r} 0 0,1 ${RC.x + rrSin60},${RC.y - rrCos60} Z`}
                  fill="rgba(34,211,238,0.040)"
                />
                <line
                  x1={RC.x} y1={RC.y} x2={RC.x + rrSin60} y2={RC.y - rrCos60}
                  stroke="rgba(34,211,238,0.60)" strokeWidth="1.8"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(34,211,238,0.85))' }}
                />
                <line
                  x1={RC.x} y1={RC.y} x2={RC.x} y2={RC.y - RC.r}
                  stroke="rgba(34,211,238,0.20)" strokeWidth="0.9"
                />
                <animateTransform
                  attributeName="transform" type="rotate"
                  from={`0 ${RC.x} ${RC.y}`} to={`360 ${RC.x} ${RC.y}`}
                  dur="9s" repeatCount="indefinite"
                />
              </g>
            )}

            {/* ── HQ ambient glow sphere ── */}
            <circle cx={HQ.x} cy={HQ.y} r={92}
              fill="url(#b6hqglow)"
              style={{ opacity: inView ? 1 : 0, transition: 'opacity 1.2s ease 1.4s' }}
            />

            {/* ── C: HQ broadcast waves — 3 staggered expanding rings ── */}
            {inView && [0, 1.3, 2.6].map((begin) => (
              <circle key={begin} cx={440} cy={380} r={58}
                fill="none" stroke="rgba(244,179,91,0.55)" strokeWidth="1.4">
                <animate attributeName="r" values="58;305" dur="3.9s"
                  begin={`${begin}s`} repeatCount="indefinite" calcMode="spline"
                  keySplines="0.25 0 0.75 1" />
                <animate attributeName="stroke-opacity" values="0.55;0" dur="3.9s"
                  begin={`${begin}s`} repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1.4;0.3" dur="3.9s"
                  begin={`${begin}s`} repeatCount="indefinite" />
              </circle>
            ))}

            {/* ── HQ city photo (hex-clipped) ── */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <image
              href={HQ.image}
              x={393} y={326} width={94} height={108}
              clipPath="url(#clipHQ)"
              preserveAspectRatio="xMidYMid slice"
              style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.9s ease 1.5s' }}
            />

            {/* ── Branch city photos (circle-clipped) ── */}
            {subBranches.map((branch, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <image
                key={`img_${branch.city}`}
                href={branch.image}
                x={branch.x - 42} y={branch.y - 42} width={84} height={84}
                clipPath={`url(#cp_${branch.en.split(' ')[0]})`}
                preserveAspectRatio="xMidYMid slice"
                style={{ opacity: inView ? 1 : 0, transition: `opacity 0.8s ease ${1.6 + i * 0.14}s` }}
              />
            ))}

            {/* ── HQ hex node ── */}
            <g
              onClick={() => setActiveCity(HQ.city)}
              onMouseEnter={() => setHoverCity(HQ.city)}
              onMouseLeave={() => setHoverCity(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Photo darkening overlay */}
              <polygon points={HQ_HEX} fill="rgba(2,8,23,0.40)" />

              {/* Outer pulse hex rings (SMIL on stroke-opacity avoids transform-origin issue) */}
              <polygon points={HQ_RING2} fill="none" stroke="rgba(244,179,91,0.18)" strokeWidth="1"
                style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 1.8s' }}>
                <animate attributeName="stroke-opacity" values="0.18;0.04;0.18" dur="3.6s" repeatCount="indefinite" begin="0.8s" />
              </polygon>
              <polygon points={HQ_RING1} fill="none" stroke="rgba(244,179,91,0.35)" strokeWidth="1.3"
                style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 1.6s' }}>
                <animate attributeName="stroke-opacity" values="0.35;0.08;0.35" dur="2.6s" repeatCount="indefinite" />
              </polygon>

              {/* Gold border — reacts to hover */}
              <polygon points={HQ_HEX} fill="none"
                stroke={highlightedCity === HQ.city ? '#f4b35b' : 'rgba(244,179,91,0.78)'}
                strokeWidth={highlightedCity === HQ.city ? 2.8 : 2.2}
                style={{
                  filter: `drop-shadow(0 0 ${highlightedCity === HQ.city ? 18 : 11}px rgba(244,179,91,0.90))`,
                  opacity: inView ? 1 : 0,
                  transition: 'stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.5s ease 1.5s',
                }}
              />

              {/* Corner accent dots on hex vertices */}
              {['440,326','487,353','487,407','440,434','393,407','393,353'].map((pt, vi) => {
                const [px, py] = pt.split(',').map(Number);
                return (
                  <circle key={vi} cx={px} cy={py} r={2.5}
                    fill="rgba(244,179,91,0.80)"
                    style={{ opacity: inView ? 1 : 0, transition: `opacity 0.4s ease ${1.7 + vi * 0.06}s` }}
                  />
                );
              })}

              {/* Text inside hex */}
              <text x={440} y={370} textAnchor="middle" fontSize={8} fill="#fde68a"
                fontWeight="900" letterSpacing="0.20em"
                style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease 1.8s' }}>
                YIWU
              </text>
              <text x={440} y={389} textAnchor="middle" fontSize={9.5} fill="#f4b35b"
                fontWeight="900"
                style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease 1.8s' }}>
                HQ ★
              </text>

              {/* Labels below hex */}
              <text x={440} y={453} textAnchor="middle" fontSize={12} fill="#fde68a"
                fontWeight="800"
                style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease 1.9s' }}>
                义乌总部
              </text>
              <rect x={412} y={460} width={56} height={17} rx={4}
                fill="rgba(244,179,91,0.11)" stroke="rgba(244,179,91,0.30)" strokeWidth="0.8"
                style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease 2.0s' }} />
              <text x={440} y={473} textAnchor="middle" fontSize={7.5} fill="#fcd34d"
                fontWeight="700" letterSpacing="0.15em"
                style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease 2.0s' }}>
                调度核心
              </text>
            </g>

            {/* ── Branch nodes ── */}
            {subBranches.map((branch, i) => {
              const isHL  = highlightedCity === branch.city;
              const delay = 1.8 + i * 0.15;
              const enKey = branch.en.split(' ')[0]; // 'SHENZHEN' etc.

              // EN label above circle, ZH name + badge below
              const enY    = branch.y - 52;
              const zhY    = branch.y + 57;
              const badgeY = branch.y + 63;

              return (
                <g key={`node_${branch.city}`}
                  onClick={() => setActiveCity(branch.city)}
                  onMouseEnter={() => setHoverCity(branch.city)}
                  onMouseLeave={() => setHoverCity(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Photo darkening overlay */}
                  <circle cx={branch.x} cy={branch.y} r={42} fill="rgba(2,8,23,0.46)" />

                  {/* Outer pulse ring */}
                  <circle cx={branch.x} cy={branch.y} r={54}
                    fill="none"
                    stroke={isHL ? 'rgba(34,211,238,0.40)' : 'rgba(34,211,238,0.18)'}
                    strokeWidth={isHL ? 1.4 : 0.8}
                    style={{
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.5s ease ${delay}s, stroke 0.3s ease, stroke-width 0.3s ease`,
                      animation: 'energy-pulse 2.8s ease-in-out infinite',
                    }}
                  />

                  {/* Main border */}
                  <circle cx={branch.x} cy={branch.y} r={42}
                    fill="none"
                    stroke={isHL ? '#22d3ee' : 'rgba(34,211,238,0.58)'}
                    strokeWidth={isHL ? 2.5 : 1.8}
                    style={{
                      filter: `drop-shadow(0 0 ${isHL ? 14 : 6}px rgba(34,211,238,${isHL ? 0.92 : 0.55}))`,
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.5s ease ${delay}s, stroke 0.3s ease, stroke-width 0.3s ease`,
                    }}
                  />

                  {/* Small center accent dot */}
                  <circle cx={branch.x} cy={branch.y} r={2.5}
                    fill={isHL ? '#67e8f9' : 'rgba(34,211,238,0.55)'}
                    style={{
                      filter: isHL ? 'drop-shadow(0 0 6px rgba(34,211,238,1))' : undefined,
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.4s ease ${delay + 0.1}s, fill 0.3s ease`,
                    }}
                  />

                  {/* EN label above */}
                  <text x={branch.x} y={enY} textAnchor="middle" fontSize={7.5}
                    fill={isHL ? '#67e8f9' : 'rgba(147,210,255,0.58)'}
                    fontWeight="800" letterSpacing="0.15em"
                    style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ease ${delay + 0.1}s, fill 0.3s ease` }}>
                    {enKey}
                  </text>

                  {/* City name below */}
                  <text x={branch.x} y={zhY} textAnchor="middle" fontSize={10.5}
                    fill={isHL ? '#e0f2fe' : 'rgba(148,163,184,0.68)'}
                    fontWeight="700"
                    style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ease ${delay + 0.12}s, fill 0.3s ease` }}>
                    {branch.city}
                  </text>

                  {/* Region badge */}
                  <rect x={branch.x - 27} y={badgeY} width={54} height={16} rx={4}
                    fill={isHL ? 'rgba(34,211,238,0.12)' : 'rgba(34,211,238,0.05)'}
                    stroke={isHL ? 'rgba(34,211,238,0.36)' : 'rgba(34,211,238,0.16)'}
                    strokeWidth="0.8"
                    style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ease ${delay + 0.16}s, fill 0.3s ease` }} />
                  <text x={branch.x} y={badgeY + 11} textAnchor="middle" fontSize={7.5}
                    fill={isHL ? '#a5f3fc' : 'rgba(148,163,184,0.58)'}
                    fontWeight="700" letterSpacing="0.10em"
                    style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ease ${delay + 0.16}s, fill 0.3s ease` }}>
                    {branch.region}
                  </text>
                </g>
              );
            })}

            {/* ── C: Satellite service chips per branch ── */}
            {subBranches.map((branch, i) => {
              const tags = SATELLITE_TAGS[branch.city];
              if (!tags) return null;
              const isHL = highlightedCity === branch.city;
              const delay = 2.4 + i * 0.18;
              return (
                <g key={`sat_${branch.city}`} style={{ pointerEvents: 'none' }}>
                  {tags.map((tag, j) => {
                    const tx = branch.x + tag.dx;
                    const ty = branch.y + tag.dy;
                    // Connector dot midpoint
                    const mx = branch.x + tag.dx * 0.58;
                    const my = branch.y + tag.dy * 0.58;
                    return (
                      <g key={j} style={{ opacity: inView ? 1 : 0,
                        transition: `opacity 0.5s ease ${delay + j * 0.10}s` }}>
                        {/* Faint connector line from node edge → chip */}
                        <line
                          x1={branch.x + tag.dx * 0.58}
                          y1={branch.y + tag.dy * 0.58}
                          x2={tx} y2={ty}
                          stroke={isHL ? 'rgba(34,211,238,0.28)' : 'rgba(34,211,238,0.13)'}
                          strokeWidth="0.65" strokeDasharray="2 5"
                        />
                        {/* Chip background */}
                        <rect x={tx - 26} y={ty - 9} width={52} height={18} rx={4}
                          fill={isHL ? 'rgba(34,211,238,0.14)' : 'rgba(34,211,238,0.06)'}
                          stroke={isHL ? 'rgba(34,211,238,0.38)' : 'rgba(34,211,238,0.16)'}
                          strokeWidth="0.7"
                        />
                        {/* Chip text */}
                        <text x={tx} y={ty + 5} textAnchor="middle" fontSize={7.5}
                          fill={isHL ? '#a5f3fc' : 'rgba(148,163,184,0.58)'}
                          fontWeight="700" letterSpacing="0.08em">
                          {tag.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Faint network watermark */}
            <text x={440} y={734} textAnchor="middle" fontSize={10} fontWeight="900"
              letterSpacing="0.44em" fill="rgba(34,211,238,0.050)"
              style={{ pointerEvents: 'none', userSelect: 'none' }}>
              GEYUN NETWORK
            </text>
          </svg>
        </div>

        {/* ═══ RIGHT · Branch detail card ═══ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBranch.city}
            initial={{ opacity: 0, x: 22, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -14, scale: 0.98 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="glass-panel relative overflow-hidden rounded-[2.4rem] flex flex-col"
            style={{ minHeight: 580 }}
          >
            {/* Photo */}
            <div className="relative h-72 flex-shrink-0 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{ filter: 'contrast(1.1) saturate(1.12) brightness(0.88)' }}
              >
                <Image
                  src={activeBranch.image}
                  alt={activeBranch.city}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width:1024px) 100vw, 38vw"
                />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(2,8,23,0.97) 0%, rgba(6,18,44,0.55) 40%, rgba(8,25,50,0.22) 70%, transparent 100%)',
                }}
              />
              <div
                className="absolute inset-x-0 h-px pointer-events-none"
                style={{
                  top: '50%',
                  background: activeBranch.isHQ
                    ? 'linear-gradient(90deg, transparent, rgba(244,179,91,0.45), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(34,211,238,0.45), transparent)',
                  animation: 'scan-x 3.8s linear infinite',
                }}
              />
              <div className="absolute top-4 right-4 rounded-full border border-cyan-400/25 bg-slate-950/72 px-3 py-1 text-[9px] font-black tracking-[0.22em] text-cyan-300 backdrop-blur-xl uppercase">
                {activeBranch.region}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className={`text-[9px] font-black tracking-[0.35em] uppercase ${activeBranch.isHQ ? 'text-amber-300' : 'text-cyan-300'}`}>
                  {activeBranch.en}
                </p>
                <h3 className="mt-1 font-display text-[1.75rem] font-black text-white leading-tight">
                  {activeBranch.city}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-4 p-5">
              <p className="text-sm leading-7 text-slate-300">{activeBranch.desc}</p>
              <div className="flex flex-wrap gap-2">
                {activeBranch.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide ${
                      activeBranch.isHQ
                        ? 'border-amber-400/25 bg-amber-400/[0.08] text-amber-200'
                        : 'border-cyan-400/22 bg-cyan-400/[0.08] text-cyan-200'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Node switcher */}
              <div className="mt-auto border-t border-white/[0.06] pt-4">
                <p className="mb-2 text-[9px] font-black tracking-[0.24em] text-slate-500 uppercase">
                  Network Nodes
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {BRANCHES.map((b) => (
                    <button
                      key={b.city}
                      type="button"
                      onClick={() => setActiveCity(b.city)}
                      className={`rounded-xl px-2 py-2 text-[10px] font-bold transition-all border ${
                        activeCity === b.city
                          ? b.isHQ
                            ? 'border-amber-400/55 bg-amber-400/10 text-amber-200'
                            : 'border-cyan-400/45 bg-cyan-400/10 text-cyan-100'
                          : 'border-white/[0.07] bg-white/[0.03] text-slate-400 hover:border-cyan-400/25 hover:text-slate-200'
                      }`}
                    >
                      {b.cityShort}
                      {b.isHQ ? <span className="ml-0.5 text-amber-300">★</span> : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═══ Branch Command Wall ═══ */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {BRANCHES.map((branch, i) => {
          const isHL = highlightedCity === branch.city;
          return (
            <motion.button
              key={branch.city}
              type="button"
              onClick={() => setActiveCity(branch.city)}
              onMouseEnter={() => setHoverCity(branch.city)}
              onMouseLeave={() => setHoverCity(null)}
              className="group relative h-40 overflow-hidden rounded-2xl border transition-all duration-300"
              style={{
                borderColor: isHL
                  ? branch.isHQ ? 'rgba(244,179,91,0.7)' : 'rgba(34,211,238,0.6)'
                  : 'rgba(255,255,255,0.07)',
                boxShadow: isHL
                  ? branch.isHQ
                    ? '0 0 28px rgba(244,179,91,0.25), inset 0 0 20px rgba(244,179,91,0.06)'
                    : '0 0 28px rgba(34,211,238,0.25), inset 0 0 20px rgba(34,211,238,0.06)'
                  : 'none',
                opacity: hoverCity && !isHL ? 0.45 : 1,
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                style={{ filter: 'contrast(1.12) saturate(1.1) brightness(0.82)' }}
              >
                <Image src={branch.image} alt={branch.city} fill className="object-cover object-center" sizes="18vw" />
              </div>
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to top, rgba(2,6,20,0.96) 0%, rgba(4,14,36,0.72) 42%, rgba(6,20,44,0.30) 70%, transparent 100%)',
                  opacity: isHL ? 0.78 : 0.92,
                }}
              />
              {isHL && (
                <div
                  className="absolute inset-x-0 h-px pointer-events-none"
                  style={{
                    top: '38%',
                    background: branch.isHQ
                      ? 'linear-gradient(90deg, transparent, rgba(244,179,91,0.55), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(34,211,238,0.55), transparent)',
                    animation: 'scan-x 2.6s linear infinite',
                  }}
                />
              )}
              <div className="absolute inset-x-0 bottom-0 p-2.5 flex flex-col gap-0.5">
                <span className={`text-[7.5px] font-black tracking-[0.22em] uppercase ${branch.isHQ ? 'text-amber-300/80' : 'text-cyan-400/80'}`}>
                  {branch.en.split(' ')[0]}
                </span>
                <span className="text-[12px] font-black text-white leading-tight">{branch.city}</span>
                <span
                  className={`mt-0.5 self-start rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wide ${
                    branch.isHQ
                      ? 'bg-amber-400/15 text-amber-200 border border-amber-400/25'
                      : 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/20'
                  }`}
                >
                  {branch.region}
                </span>
              </div>
              <div
                className="absolute inset-x-0 bottom-0 h-0.5 transition-opacity duration-300"
                style={{
                  background: branch.isHQ ? '#f4b35b' : '#22d3ee',
                  opacity: isHL ? 1 : 0,
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* ═══ Stats bar ═══ */}
      <div className="glow-line mt-4 overflow-hidden rounded-2xl border border-cyan-400/[0.1] bg-slate-950/70 backdrop-blur-xl">
        <div className="flex flex-wrap">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex-1 min-w-[100px] border-r border-white/[0.05] last:border-r-0 px-4 py-4 text-center"
            >
              <p className="text-[9px] font-black tracking-[0.22em] uppercase text-cyan-400/60">{stat.label}</p>
              <p className="mt-1 text-base font-black text-white leading-tight">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
