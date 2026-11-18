'use client';

import { cn } from '@/lib/utils';

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 rounded-2xl border border-border/70 bg-card p-1.5 shadow-xs',
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition',
              active
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {option.label}
            {typeof option.count === 'number' && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                  active ? 'bg-white/20 text-primary-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
