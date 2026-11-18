import Link from 'next/link';
import { ArrowLeft, Compass, Wrench } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-50" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-border/70 bg-card p-8 text-card-foreground shadow-xl shadow-slate-900/[0.03]" data-aos="zoom-in">
        <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Wrench className="size-8" />
        </span>
        <p className="mt-5 text-6xl font-black tracking-tighter text-transparent bg-gradient-to-br from-primary to-cyan-500 bg-clip-text">
          404
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This page seems to be missing. Don&apos;t worry — we can fix that.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>
          <Link
            href="/services"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold transition hover:bg-muted"
          >
            <Compass className="size-4" />
            Browse services
          </Link>
        </div>
      </div>
    </div>
  );
}
