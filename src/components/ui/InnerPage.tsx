import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

const pageMap = {
  '美线专线': ['至尊12日达 / 尊享15日达', '美森限时达卡派', '美东闪电达卡派', 'FBA预约入仓'],
  '海外仓服务': ['一件代发', '退件换标', 'SKU上架', '本土尾程派送'],
  '服务网络': ['义乌总部', '深圳/泉州/武汉/太原/长沙', '洛杉矶/纽约', '欧洲与墨西哥延伸'],
  '仓储实力': ['国内入仓', '分拣贴标', '打包装柜', '海外仓衔接'],
  '关于歌运': ['2017年成立', '1000万注册资金', '专注美线', '科技化跨境物流'],
  '联系我们': ['物流方案生成器', '美线渠道咨询', '海外仓方案', '大货项目沟通'],
};

export function InnerPage({ title, eyebrow, description }: { title: keyof typeof pageMap; eyebrow: string; description: string }) {
  return (
    <main className="pt-36">
      <section className="container-x pb-24">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <GlassCard className="min-h-72">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">GEYUN LOGISTICS</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {pageMap[title].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="font-bold text-white">{item}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">页面核心内容已组件化预留，后续可从 data 文件扩展为完整详情模块。</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button href="/contact">获取方案</Button>
              <Button href="/" variant="ghost">返回首页</Button>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
