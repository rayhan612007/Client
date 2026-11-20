import Link from 'next/link';
import { ArrowLeft, ShieldCheck, XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-40" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-lg flex-col items-center justify-center px-4 py-16 text-center" data-aos="zoom-in">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/25 dark:text-rose-400">
          <XCircle className="size-8" />
        </span>
        <p className="mt-5 text-[11px] font-semibold tracking-[0.16em] text-rose-600 uppercase dark:text-rose-400">
          Checkout cancelled
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Payment cancelled</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          No worries — nothing was charged. Your booking is still unpaid and you can pay
          anytime from your bookings dashboard.
        </p>

        <div className="mt-8 flex w-full items-start gap-2 rounded-xl border border-border/70 bg-card p-4 text-left text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
          Your device stays protected: payment is only collected after the repair is completed
          and verified by you.
        </div>

        <Link
          href="/dashboard/customer/bookings"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
        >
          <ArrowLeft className="size-4" />
          Back to my bookings
        </Link>
      </div>
    </div>
  );
}
