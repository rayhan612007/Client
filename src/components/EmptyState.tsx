import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-aos="fade-up"
      className={cn(
        "relative overflow-hidden rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-xs",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-40" />
      <div className="relative mx-auto flex max-w-sm flex-col items-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-border">
          <Icon className="size-6" />
        </span>
        <p className="mt-4 text-base font-semibold tracking-tight">{title}</p>
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
