import { cn } from '@/lib/cn';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn('mb-10 max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.34em] text-cyan-300">{eyebrow}</p>
      <h2 className="font-display text-3xl font-black leading-tight tracking-[-0.04em] text-white md:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">{description}</p> : null}
    </div>
  );
}
