import { cn } from '@/lib/cn';

export function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('glass-panel rounded-[2rem] p-6', className)}>{children}</div>;
}
