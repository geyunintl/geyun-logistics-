'use client';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { useLang } from '@/context/LangContext';

/* ─── Data ─────────────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: '客户发货需求', en: 'INQUIRY',   x: 90,   y: 370, above: false, desc: '确认货量、目的地与时效，一对一定制方案规划' },
  { id: 2, label: '国内入仓',     en: 'INBOUND',   x: 248,  y: 318, above: true,  desc: '到货验收、体积称重、异常快速登记处理' },
  { id: 3, label: '分拣贴标',     en: 'LABELING',  x: 396,  y: 268, above: false, desc: 'SKU 精准分拣、FBA 标签、箱唛全程管控' },
  { id: 4, label: '订舱出运',     en: 'DEPARTURE', x: 560,  y: 218, above: true,  desc: '海运/空运订舱、报关、装柜全程监装出运' },
  { id: 5, label: '海外清关',     en: 'CUSTOMS',   x: 724,  y: 266, above: false, desc: '目的港清关、税单处理、异常情况快速应对' },
  { id: 6, label: '海外仓/卡派',  en: 'DELIVERY',  x: 872,  y: 312, above: true,  desc: '卡车派送或海外仓收货上架、本土分发协同' },
  { id: 7, label: 'FBA 签收',     en: 'RECEIVED',  x: 1020, y: 362, above: false, desc: 'FBA/住宅地址/商业地址签收' },
];

/* ─── SVG constants ─────────────────────────────────────────────────── */
// Cubic bezier that passes exactly through all 7 node coordinates
const PATH =
  'M 90,370 C 145,355 195,330 248,318 C 295,307 355,278 396,268 ' +
  'C 440,255 510,220 560,218 C 610,216 675,252 724,266 ' +
  'C 768,278 828,298 872,312 C 916,326 970,348 1020,362';

const WAVES = [
  'M 360,302 Q 420,290 480,302 Q 540,314 600,302 Q 660,290 720,302 Q 754,308 760,309',
  'M 360,326 Q 420,314 480,326 Q 540,338 600,326 Q 660,314 720,326 Q 754,332 760,333',
  'M 360,350 Q 420,338 480,350 Q 540,362 600,350 Q 660,338 720,350 Q 754,356 760,357',
  'M 360,374 Q 420,362 480,374 Q 540,386 600,374 Q 660,362 720,374 Q 754,380 760,381',
  'M 360,398 Q 420,386 480,398 Q 540,410 600,398 Q 660,386 720,398 Q 754,404 760,405',
];

const nodeColor = (i: number) =>
  i === 0 ? '#f4b35b' : i === 6 ? '#818cf8' : '#22d3ee';

const nodeGlowId = (i: number) =>
  i === 0 ? 'fl-gg' : i === 6 ? 'fl-ig' : 'fl-ng';

/* ─── Component ─────────────────────────────────────────────────────── */
export function LogisticsFlow() {
  const { t } = useLang();

  /* Overlay translated label + desc onto static position/id/en data */
  const displaySteps = STEPS.map((s, i) => ({
    ...s,
    label: t.flow.steps[i]?.label ?? s.label,
    desc:  t.flow.steps[i]?.desc  ?? s.desc,
  }));

  return (
    <section className="container-x py-28">
      <SectionHeading
        align="center"
        eyebrow={t.flow.eyebrow}
        title={t.flow.title}
        description={t.flow.description}
      />

      <div className="relative overflow-hidden rounded-[2.8rem] border border-cyan-200/10 bg-slate-950/80 shadow-[0_0_90px_rgba(34,211,238,.10)]">
        <div className="absolute inset-0 hero-grid opacity-[0.07]" />

        {/* Horizontal scroll on narrow screens */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: 780 }}>

            {/* ── Main SVG ── */}
            <svg
              viewBox="0 0 1120 510"
              className="relative w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Flow path – referenced by mpath */}
                <path id="fl-path" d={PATH} />

                {/* Path gradient: gold → cyan → indigo */}
                <linearGradient id="fl-pg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#f4b35b" />
                  <stop offset="48%"  stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>

                {/* Node halos */}
                <radialGradient id="fl-ng" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="fl-gg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#f4b35b" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#f4b35b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="fl-ig" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#818cf8" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </radialGradient>

                {/* Glow filters */}
                <filter id="fl-gf" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="fl-gs" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="2.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* ── Zone backgrounds ── */}
              <rect x="0"   y="0" width="360" height="510" fill="#060d16" />
              <rect x="360" y="0" width="400" height="510" fill="#041018" />
              <rect x="760" y="0" width="360" height="510" fill="#060d1c" />

              {/* Zone labels */}
              <text x="40"   y="44" fill="#f4b35b" fillOpacity="0.32" fontSize="9" fontWeight="900" letterSpacing="4">{t.flow.zoneChina}</text>
              <text x="560"  y="44" fill="#22d3ee" fillOpacity="0.22" fontSize="9" fontWeight="900" letterSpacing="4" textAnchor="middle">{t.flow.zoneOcean}</text>
              <text x="1080" y="44" fill="#818cf8" fillOpacity="0.32" fontSize="9" fontWeight="900" letterSpacing="4" textAnchor="end">{t.flow.zoneOverseas}</text>

              {/* Zone dividers */}
              <line x1="360" y1="58" x2="360" y2="495" stroke="#22d3ee" strokeOpacity="0.07" strokeDasharray="3,9" />
              <line x1="760" y1="58" x2="760" y2="495" stroke="#818cf8" strokeOpacity="0.07" strokeDasharray="3,9" />

              {/* ── Ocean waves ── */}
              {WAVES.map((d, i) => (
                <path key={i} d={d} stroke="#22d3ee" strokeOpacity={0.03 + i * 0.008} strokeWidth="1.2" fill="none" />
              ))}

              {/* ── Landmark silhouettes ── */}

              {/* Factory (China) */}
              <g transform="translate(24,408)" opacity="0.1" fill="#f4b35b">
                <rect x="5"  y="22" width="56" height="46" />
                <rect x="10" y="5"  width="15" height="18" />
                <rect x="35" y="5"  width="15" height="18" />
                <rect x="8"  y="32" width="11" height="13" fill="#060d16" />
                <rect x="25" y="32" width="11" height="13" fill="#060d16" />
                <rect x="42" y="32" width="11" height="13" fill="#060d16" />
                <rect x="22" y="52" width="15" height="16" fill="#060d16" />
              </g>

              {/* Ship (ocean) */}
              <g transform="translate(490,354)" opacity="0.12" fill="#22d3ee">
                <path d="M 0,32 L 90,32 L 83,49 L 7,49 Z" />
                <rect x="18" y="18" width="28" height="15" />
                <rect x="30" y="6"  width="11" height="13" />
                <line x1="36" y1="0"  x2="36" y2="7"  stroke="#22d3ee" strokeWidth="2" />
                <rect x="50" y="14"   width="9"  height="18" fill="#0a3d47" />
              </g>

              {/* Warehouse (Overseas) */}
              <g transform="translate(1036,408)" opacity="0.1" fill="#818cf8">
                <rect x="0"  y="20" width="56" height="44" />
                <polygon points="0,20 28,5 56,20" />
                <rect x="6"  y="32" width="12" height="14" fill="#060d1c" />
                <rect x="36" y="32" width="12" height="14" fill="#060d1c" />
                <rect x="19" y="46" width="16" height="18" fill="#060d1c" />
              </g>

              {/* ── Path glow layers ── */}
              <path d={PATH} stroke="#22d3ee" strokeWidth="24" strokeOpacity="0.020" fill="none" strokeLinecap="round" />
              <path d={PATH} stroke="#22d3ee" strokeWidth="11" strokeOpacity="0.048" fill="none" strokeLinecap="round" />
              <path d={PATH} stroke="#22d3ee" strokeWidth="4.5" strokeOpacity="0.10" fill="none" strokeLinecap="round" />

              {/* ── Main path (gradient dashed) ── */}
              <path d={PATH} stroke="url(#fl-pg)" strokeWidth="2.2" fill="none" strokeDasharray="8,5" strokeLinecap="round" />

              {/* ── Flow particles ── */}
              {/* 1 – cyan, fast */}
              <circle r="3.8" fill="#22d3ee" filter="url(#fl-gf)">
                <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#fl-path" />
                </animateMotion>
              </circle>
              {/* 2 – gold, medium */}
              <circle r="2.6" fill="#f4b35b" opacity="0.85" filter="url(#fl-gs)">
                <animateMotion dur="13s" repeatCount="indefinite" begin="2s" rotate="auto">
                  <mpath href="#fl-path" />
                </animateMotion>
              </circle>
              {/* 3 – white, slow */}
              <circle r="2" fill="#e2e8f0" opacity="0.4">
                <animateMotion dur="18s" repeatCount="indefinite" begin="5.5s">
                  <mpath href="#fl-path" />
                </animateMotion>
              </circle>
              {/* 4 – indigo */}
              <circle r="2.4" fill="#818cf8" opacity="0.75" filter="url(#fl-gs)">
                <animateMotion dur="11s" repeatCount="indefinite" begin="8s" rotate="auto">
                  <mpath href="#fl-path" />
                </animateMotion>
              </circle>

              {/* ── Nodes ── */}
              {displaySteps.map((s, i) => {
                const col   = nodeColor(i);
                const glow  = nodeGlowId(i);
                const above = s.above;
                const connY1 = above ? s.y - 22 : s.y + 22;
                const connY2 = above ? s.y - 62 : s.y + 62;
                const enY    = above ? s.y - 73 : s.y + 77;
                const zhY    = above ? s.y - 85 : s.y + 91;
                const pulseDur = `${2.6 + i * 0.26}s`;

                return (
                  <g key={s.id}>
                    {/* Halo */}
                    <circle cx={s.x} cy={s.y} r="46" fill={`url(#${glow})`} />

                    {/* Pulse ring */}
                    <circle cx={s.x} cy={s.y} r="27" fill="none" stroke={col} strokeWidth="1" strokeOpacity="0.18">
                      <animate attributeName="r"              values="27;36;27"      dur={pulseDur} repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" values="0.18;0.04;0.18" dur={pulseDur} repeatCount="indefinite" />
                    </circle>

                    {/* Node circle */}
                    <circle cx={s.x} cy={s.y} r="20" fill="#060d18" stroke={col} strokeWidth="2" filter="url(#fl-gs)" />

                    {/* Step number */}
                    <text x={s.x} y={s.y + 5} textAnchor="middle" fill={col} fontSize="12" fontWeight="900">
                      {String(i + 1).padStart(2, '0')}
                    </text>

                    {/* Connector dashes */}
                    <line
                      x1={s.x} y1={connY1}
                      x2={s.x} y2={connY2}
                      stroke={col} strokeWidth="1" strokeOpacity="0.28" strokeDasharray="2,4"
                    />

                    {/* EN label */}
                    <text x={s.x} y={enY} textAnchor="middle" fill={col} fontSize="8" fontWeight="800" letterSpacing="2" opacity="0.55">
                      {s.en}
                    </text>

                    {/* ZH label */}
                    <text x={s.x} y={zhY} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
                      {s.label}
                    </text>
                  </g>
                );
              })}

              {/* Watermark */}
              <text x="560" y="505" textAnchor="middle" fill="white" fillOpacity="0.035" fontSize="8.5" letterSpacing="5" fontWeight="800">
                GEYUN INTERNATIONAL LOGISTICS · FULL CHAIN VISIBILITY
              </text>
            </svg>

            {/* ── Description strip ── */}
            <div className="grid grid-cols-7 divide-x divide-white/[0.05] border-t border-white/[0.06]">
              {displaySteps.map((s, i) => {
                const colorClass =
                  i === 0 ? 'text-amber-300' :
                  i === 6 ? 'text-indigo-300' :
                  'text-cyan-300';
                return (
                  <div key={s.id} className="px-4 py-5 text-center">
                    <p className={`mb-1.5 text-[9px] font-black uppercase tracking-widest ${colorClass}`}>
                      {s.label}
                    </p>
                    <p className="text-[11px] leading-[1.5] text-slate-500">{s.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
