export function GlowTag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">{children}</span>;
}
