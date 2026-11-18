'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatAccent = 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet';

const ACCENTS: Record<StatAccent, string> = {
  blue: 'bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400',
  indigo: 'bg-indigo-500/10 text-indigo-600 ring-indigo-500/20 dark:text-indigo-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
  rose: 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400',
  violet: 'bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400',
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'blue',
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  accent?: StatAccent;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-aos="fade-up"
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md',
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-10 -right-8 size-24 rounded-full bg-primary/[0.05] blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
        </div>
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105',
            ACCENTS[accent],
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
      {hint && <p className="relative mt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
