import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The single heading pattern used by every marketing section:
 * eyebrow pill → bold display title → relaxed subtitle (optional action link).
 * Keeping this in one component guarantees identical type scale and rhythm
 * across Home, Services, About and the auth pages.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
  align = 'center',
  tone = 'light',
  as = 'h2',
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  as?: 'h1' | 'h2';
  action?: ReactNode;
  className?: string;
}) {
  const centered = align === 'center';
  const dark = tone === 'dark';
  const Heading = as;

  return (
    <div
      data-aos="fade-up"
      className={cn(
        'flex flex-col gap-5',
        centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('min-w-0', centered && 'flex flex-col items-center')}>
        {eyebrow && (
          <span className={dark ? 'eyebrow-dark' : 'eyebrow'}>
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {eyebrow}
          </span>
        )}
        <Heading
          className={cn(
            'mt-3 text-3xl font-bold tracking-tight sm:text-4xl',
            dark ? 'text-white' : 'text-foreground',
          )}
        >
          {title}
        </Heading>
        {description && (
          <p
            className={cn(
              'mt-4 text-base leading-relaxed sm:text-lg',
              centered && 'max-w-2xl',
              dark ? 'text-slate-300' : 'text-muted-foreground',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
