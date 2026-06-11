'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/context/LangContext';

/* ─── Types ──────────────────────────────────────────────────────────── */
type Color = 'cyan' | 'amber' | 'slate';
type Channel = { name: string; time: string; badge: string; color: Color };
type PlanData = { channels: Channel[]; warehouses: string[]; hint: string };

/* ─── Plan database (5 countries × 3 priorities) ─────────────────────── */
const PLANS: Record<string, Record<string, PlanData>> = {
  美国: {
    平衡方案: {
      channels: [
        { name: '美线普通专线海运', time: '20–35 天', badge: '推荐', color: 'cyan' },
        { name: 'FBA 海运头程', time: '25–35 天', badge: '稳定', color: 'slate' },
        { name: '美线快船专线', time: '12–19 天', badge: '时效保障', color: 'amber' },
      ],
      warehouses: ['洛杉矶仓', '新泽西仓', 'Amazon FBA'],
      hint: '支持 FBA 及海外仓两种交货方式，舱位稳定，义乌直发。',
    },
    时效优先: {
      channels: [
        { name: '美线空运快件', time: '5–8 天', badge: '最快', color: 'amber' },
        { name: '美线快船专线', time: '18–22 天', badge: '推荐', color: 'cyan' },
        { name: 'FBA 海运头程', time: '25–35 天', badge: '稳定', color: 'slate' },
      ],
      warehouses: ['洛杉矶仓', '新泽西仓'],
      hint: '时效优先建议空运或快船，与多家航司直采，舱位有保障。',
    },
    成本优先: {
      channels: [
        { name: 'FBA 海运整柜', time: '28–38 天', badge: '最优价', color: 'amber' },
        { name: '海运拼柜 LCL', time: '30–40 天', badge: '灵活', color: 'cyan' },
        { name: '美线专线海运', time: '22–30 天', badge: '推荐', color: 'slate' },
      ],
      warehouses: ['洛杉矶仓', '新泽西仓', 'Amazon FBA'],
      hint: '货量满 15CBM 以上整柜性价比最高，拼柜适合小批量测款。',
    },
  },
  英国: {
    平衡方案: {
      channels: [
        { name: '英线专线海运', time: '25–32 天', badge: '推荐', color: 'cyan' },
        { name: 'UK FBA 头程', time: '28–35 天', badge: '稳定', color: 'slate' },
        { name: '英线快船专线', time: '20–25 天', badge: '时效保障', color: 'amber' },
      ],
      warehouses: ['英国本土仓', 'Amazon UK FBA'],
      hint: '含 VAT 合规申报，Amazon UK 入仓预约全程跟进。',
    },
    时效优先: {
      channels: [
        { name: '英线空运快件', time: '4–7 天', badge: '最快', color: 'amber' },
        { name: '英线快船专线', time: '20–25 天', badge: '推荐', color: 'cyan' },
        { name: 'UK FBA 头程', time: '28–35 天', badge: '稳定', color: 'slate' },
      ],
      warehouses: ['英国本土仓', 'Amazon UK FBA'],
      hint: '英国脱欧后清关需 EORI 号，我们提供一站式合规清关服务。',
    },
    成本优先: {
      channels: [
        { name: '英线海运整柜', time: '30–40 天', badge: '最优价', color: 'amber' },
        { name: '英线拼柜 LCL', time: '32–42 天', badge: '灵活', color: 'cyan' },
        { name: '英线专线海运', time: '25–32 天', badge: '推荐', color: 'slate' },
      ],
      warehouses: ['英国本土仓', 'Amazon UK FBA'],
      hint: 'VAT 合规清关全程跟进，规避英国海关扣货风险。',
    },
  },
  '德国/欧洲': {
    平衡方案: {
      channels: [
        { name: '欧线专线海运', time: '28–35 天', badge: '推荐', color: 'cyan' },
        { name: 'Amazon DE FBA', time: '30–40 天', badge: '稳定', color: 'slate' },
        { name: '欧线快船专线', time: '22–28 天', badge: '时效保障', color: 'amber' },
      ],
      warehouses: ['德国仓', '波兰仓', 'Amazon EU FBA'],
      hint: '覆盖 Amazon EU 多站点入仓，支持泛欧计划 EFN 调配。',
    },
    时效优先: {
      channels: [
        { name: '欧线空运快件', time: '5–9 天', badge: '最快', color: 'amber' },
        { name: '欧线快船专线', time: '22–28 天', badge: '推荐', color: 'cyan' },
        { name: '欧线 FBA 头程', time: '30–40 天', badge: '稳定', color: 'slate' },
      ],
      warehouses: ['德国仓', '波兰仓', 'Amazon DE FBA'],
      hint: '欧盟统一市场，支持德国/法国/波兰仓配，VAT 全程托管。',
    },
    成本优先: {
      channels: [
        { name: '欧线海运整柜', time: '32–42 天', badge: '最优价', color: 'amber' },
        { name: '欧线拼柜 LCL', time: '35–45 天', badge: '灵活', color: 'cyan' },
        { name: '欧线专线海运', time: '28–35 天', badge: '推荐', color: 'slate' },
      ],
      warehouses: ['德国仓', '波兰仓', 'Amazon DE FBA'],
      hint: '欧洲多国仓储网络，VAT 合规清关，多平台仓配兼容。',
    },
  },
  澳大利亚: {
    平衡方案: {
      channels: [
        { name: '澳线专线海运', time: '18–25 天', badge: '推荐', color: 'cyan' },
        { name: '澳线海运整柜', time: '22–30 天', badge: '稳定', color: 'slate' },
        { name: '澳线空运快件', time: '6–10 天', badge: '时效', color: 'amber' },
      ],
      warehouses: ['悉尼仓', '墨尔本仓'],
      hint: '澳洲清关合规申报，本土尾程派送覆盖全澳主要城市。',
    },
    时效优先: {
      channels: [
        { name: '澳线空运快件', time: '6–10 天', badge: '最快', color: 'amber' },
        { name: '澳线快船专线', time: '18–22 天', badge: '推荐', color: 'cyan' },
        { name: '澳线海运整柜', time: '22–30 天', badge: '稳定', color: 'slate' },
      ],
      warehouses: ['悉尼仓', '墨尔本仓'],
      hint: '澳洲关税较高，建议提前规划商业发票与清关文件。',
    },
    成本优先: {
      channels: [
        { name: '澳线海运整柜', time: '22–30 天', badge: '最优价', color: 'amber' },
        { name: '澳线海运拼柜', time: '25–35 天', badge: '灵活', color: 'cyan' },
        { name: '澳线专线海运', time: '18–25 天', badge: '推荐', color: 'slate' },
      ],
      warehouses: ['悉尼仓', '墨尔本仓'],
      hint: '整柜性价比高，适合货量充足的卖家批量出货。',
    },
  },
  日本: {
    平衡方案: {
      channels: [
        { name: '日本专线海运', time: '10–15 天', badge: '推荐', color: 'cyan' },
        { name: 'Amazon JP FBA', time: '12–18 天', badge: '稳定', color: 'slate' },
        { name: '日本空运快件', time: '3–5 天', badge: '时效', color: 'amber' },
      ],
      warehouses: ['东京仓', 'Amazon JP FBA'],
      hint: '中日航线密集，时效稳定，支持亚马逊日本站 FBA 入仓。',
    },
    时效优先: {
      channels: [
        { name: '日本空运快件', time: '3–5 天', badge: '最快', color: 'amber' },
        { name: '日本快船专线', time: '8–12 天', badge: '推荐', color: 'cyan' },
        { name: 'Amazon JP FBA', time: '12–18 天', badge: '稳定', color: 'slate' },
      ],
      warehouses: ['东京仓', 'Amazon JP FBA'],
      hint: '日本清关文件要求严格，建议提前准备正确的货物描述。',
    },
    成本优先: {
      channels: [
        { name: '日本海运整柜', time: '12–18 天', badge: '最优价', color: 'amber' },
        { name: '日本海运拼柜', time: '14–20 天', badge: '灵活', color: 'cyan' },
        { name: '日本专线海运', time: '10–15 天', badge: '推荐', color: 'slate' },
      ],
      warehouses: ['东京仓', '大阪仓'],
      hint: '日本市场对品质要求极高，清关文件需完整规范。',
    },
  },
};

const DEFAULT_PLAN: PlanData = {
  channels: [
    { name: '国际海运整柜/拼柜', time: '视目的港', badge: '主推', color: 'cyan' },
    { name: '国际空运快件', time: '5–12 天', badge: '时效', color: 'amber' },
    { name: '专线/卡派', time: '视距离', badge: '灵活', color: 'slate' },
  ],
  warehouses: ['海外仓（视目的地）', '本土尾程派送'],
  hint: '提交需求后，专属顾问将根据目的地为您匹配最优渠道与仓储方案。',
};

/* ─── Helpers ────────────────────────────────────────────────────────── */
const BADGE_CLS: Record<Color, string> = {
  cyan:  'border-cyan-300/25  bg-cyan-300/[0.08]  text-cyan-300',
  amber: 'border-amber-300/25 bg-amber-300/[0.08] text-amber-300',
  slate: 'border-slate-400/25 bg-slate-400/[0.08] text-slate-300',
};

const INPUT_CLS =
  'h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:bg-slate-950/90';

const SELECT_CLS =
  'h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-cyan-400/60 cursor-pointer';

const COUNTRIES  = ['美国', '英国', '德国/欧洲', '澳大利亚', '日本', '加拿大', '其他'];
const CARGO_TYPES = ['普货（非带电）', '带电/锂电池', '大件货', '服装鞋包', '家居用品', '其他'];
const PRIORITIES  = ['平衡方案', '时效优先', '成本优先'] as const;

/* ─── QR placeholder (replace with real image when ready) ───────────── */
function QrCode() {
  return (
    <div className="relative shrink-0 h-[106px] w-[106px] overflow-hidden rounded-2xl border border-cyan-300/20 bg-white">
      <Image
        src="/assets/geyun/wechat-qr.png"
        alt="微信二维码"
        fill
        className="object-cover"
        sizes="106px"
      />
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────── */
export function QuoteGenerator() {
  const { lang, t } = useLang();
  const [country,    setCountry]    = useState('美国');
  const [cargoType,  setCargoType]  = useState('普货（非带电）');
  const [volume,     setVolume]     = useState('');
  const [priority,   setPriority]   = useState<typeof PRIORITIES[number]>('平衡方案');
  const [name,       setName]       = useState('');
  const [contact,    setContact]    = useState('');
  const [submitted,  setSubmitted]  = useState(false);

  const plan = PLANS[country]?.[priority] ?? DEFAULT_PLAN;
  const planKey = `${country}-${priority}`;
  /* hasElectric: cargoType state is always Chinese key */
  const hasElectric = cargoType.includes('带电');

  /* Build display values for plan panel */
  const displayCountry  = t.quote.countryMap[country]   ?? country;
  const displayPriority = t.quote.priorityMap[priority] ?? priority;
  const planHint = lang === 'zh'
    ? plan.hint
    : (t.quote.planData.hints[planKey] ?? t.quote.planData.hints['default'] ?? plan.hint);

  return (
    <section id="quote" className="container-x py-28">
      <div className="relative overflow-hidden rounded-[3rem] border border-cyan-200/15 bg-slate-950/78 p-6 shadow-[0_0_100px_rgba(34,211,238,.13)] md:p-10">
        <div className="absolute inset-0 hero-grid opacity-25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,.14),transparent_24rem),radial-gradient(circle_at_82%_58%,rgba(244,179,91,.10),transparent_22rem)]" />

        <div className="relative grid gap-10 lg:grid-cols-[1fr_1fr]">

          {/* ── Left: Form ── */}
          <div>
            <SectionHeading
              eyebrow={t.quote.eyebrow}
              title={t.quote.title}
              description={t.quote.description}
            />

            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="mt-2 grid gap-4 md:grid-cols-2"
            >
              {/* 目的国家 */}
              <label>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">{t.quote.fields.country}</span>
                <select className={SELECT_CLS} value={country} onChange={(e) => { setCountry(e.target.value); setSubmitted(false); }}>
                  {COUNTRIES.map((c, i) => <option key={c} value={c}>{t.quote.countries[i] ?? c}</option>)}
                </select>
              </label>

              {/* 货物类型 */}
              <label>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">{t.quote.fields.cargo}</span>
                <select className={SELECT_CLS} value={cargoType} onChange={(e) => setCargoType(e.target.value)}>
                  {CARGO_TYPES.map((c, i) => <option key={c} value={c}>{t.quote.cargoTypes[i] ?? c}</option>)}
                </select>
              </label>

              {/* 预计货量 */}
              <label className="md:col-span-2">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">{t.quote.fields.volume}</span>
                <input
                  className={INPUT_CLS}
                  placeholder={t.quote.fields.volumePlaceholder}
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                />
              </label>

              {/* 方案偏好 — pill group */}
              <div className="md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">{t.quote.fields.priority}</span>
                <div className="flex gap-2">
                  {PRIORITIES.map((p, i) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setPriority(p); setSubmitted(false); }}
                      className={`flex-1 rounded-xl border py-2.5 text-sm font-black transition ${
                        priority === p
                          ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-300'
                          : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      {t.quote.priorities[i] ?? p}
                    </button>
                  ))}
                </div>
              </div>

              {/* 姓名 */}
              <label>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">{t.quote.fields.name}</span>
                <input className={INPUT_CLS} placeholder={t.quote.fields.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
              </label>

              {/* 电话/微信 */}
              <label>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">{t.quote.fields.contact}</span>
                <input className={INPUT_CLS} placeholder={t.quote.fields.contactPlaceholder} value={contact} onChange={(e) => setContact(e.target.value)} />
              </label>

              {/* Submit */}
              <div className="md:col-span-2 pt-1">
                <Button className="energy-button w-full">{t.quote.fields.submit}</Button>
              </div>
            </form>
          </div>

          {/* ── Right: Dynamic plan card ── */}
          <div className="glass-reflect relative overflow-hidden rounded-[2.4rem] border border-cyan-200/15 bg-cyan-300/[0.04] p-6 backdrop-blur-xl">
            <div className="absolute right-[-6rem] top-[-6rem] size-64 rounded-full bg-cyan-300/15 blur-3xl pointer-events-none" />

            {/* Submitted banner */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3"
                >
                  <span className="text-emerald-400">✓</span>
                  <p className="text-sm font-bold text-emerald-300">{t.quote.plan.submitted}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Plan content — animates on country/priority change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={planKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                {/* Header */}
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300/70">{t.quote.plan.header}</p>
                <h3 className="mt-1.5 font-display text-2xl font-black text-white">
                  {displayCountry}
                  <span className="ml-2 text-lg font-bold text-slate-400">· {displayPriority}</span>
                </h3>

                {/* Channels */}
                <div className="mt-5 space-y-2.5">
                  {plan.channels.map((ch) => {
                    const chName  = lang === 'zh' ? ch.name  : (t.quote.planData.channelNames[ch.name]  ?? ch.name);
                    const chBadge = lang === 'zh' ? ch.badge : (t.quote.planData.badgeNames[ch.badge]   ?? ch.badge);
                    return (
                      <div key={ch.name} className="flex items-center gap-3 rounded-xl border border-white/8 bg-slate-950/50 px-4 py-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <span className="font-bold text-white text-sm">{chName}</span>
                        </div>
                        <span className="shrink-0 text-xs text-slate-400">{ch.time}</span>
                        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-black ${BADGE_CLS[ch.color]}`}>
                          {chBadge}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Warehouses */}
                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">{t.quote.plan.warehouseLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.warehouses.map((w) => {
                      const wName = lang === 'zh' ? w : (t.quote.planData.warehouseNames[w] ?? w);
                      return (
                        <span key={w} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-300">
                          {wName}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Electric goods warning */}
                {hasElectric && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-xs leading-5 text-amber-200"
                  >
                    {t.quote.plan.electricWarning}
                  </motion.div>
                )}

                {/* Hint */}
                <div className="mt-4 rounded-xl border border-cyan-200/12 bg-cyan-200/[0.04] px-4 py-3 text-xs leading-5 text-slate-400">
                  💡 {planHint}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── WeChat CTA ── */}
            <div className="mt-6 border-t border-white/[0.07] pt-5">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{t.quote.wechat.label}</p>
              <div className="flex items-start gap-4">
                <QrCode />
                <div className="flex flex-col justify-center gap-2 pt-1">
                  <p className="font-black text-white text-sm">{t.quote.wechat.title}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-amber-300">{t.quote.wechat.phone}</span>
                  </div>
                  {t.quote.wechat.items.map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span className="text-xs text-slate-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
