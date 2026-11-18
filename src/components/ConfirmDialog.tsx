'use client';

import { useEffect, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "danger" | "warning" | "primary";

const TONES: Record<Tone, { icon: string; confirm: string }> = {
  danger: {
    icon: "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400",
    confirm:
      "bg-rose-600 text-white shadow-sm shadow-rose-600/25 hover:bg-rose-500 focus-visible:ring-rose-500/40",
  },
  warning: {
    icon: "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400",
    confirm:
      "bg-amber-500 text-white shadow-sm shadow-amber-500/25 hover:bg-amber-400 focus-visible:ring-amber-500/40",
  },
  primary: {
    icon: "bg-primary/10 text-primary ring-primary/20",
    confirm:
      "bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90 focus-visible:ring-primary/40",
  },
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  icon: Icon = AlertTriangle,
  loading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
  icon?: LucideIcon;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const palette = TONES[tone];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl animate-in-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1",
              palette.icon,
            )}
          >
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
            {description && (
              <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60",
              palette.confirm,
            )}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
