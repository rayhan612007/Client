import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  actions,
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-aos="fade-up"
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <div className="mt-1 flex items-center gap-3">
          {Icon && (
            <span className="hidden size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:flex">
              <Icon className="size-5" />
            </span>
          )}
          <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
            {title}
          </h1>
        </div>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
