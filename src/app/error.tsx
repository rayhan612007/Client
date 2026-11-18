'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-50" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-border/70 bg-card p-8 text-card-foreground shadow-xl shadow-slate-900/[0.03]" data-aos="zoom-in">
        <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/25 dark:text-rose-400">
          <AlertTriangle className="size-8" />
        </span>
        <p className="mt-5 text-[11px] font-semibold tracking-[0.16em] text-rose-600 uppercase dark:text-rose-400">
          Unexpected error
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 line-clamp-4 text-sm leading-relaxed break-words text-muted-foreground">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
        >
          <RotateCcw className="size-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
