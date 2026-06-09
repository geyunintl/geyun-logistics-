export function Button({
  children,
  href,
  variant = 'primary',
  className = '',
}: {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'ghost' | 'dark';
  className?: string;
}) {
  const styles = {
    primary: 'bg-cyan-300 text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.35)] hover:bg-white',
    ghost: 'border border-cyan-200/30 bg-white/5 text-white hover:border-cyan-200/70 hover:bg-white/10',
    dark: 'bg-slate-950 text-white border border-white/10 hover:border-cyan-200/50',
  };
  const base = `inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-bold transition duration-300 hover:-translate-y-1 ${styles[variant]} ${className}`;
  if (href) return <a className={base} href={href}>{children}</a>;
  return <button className={base}>{children}</button>;
}
