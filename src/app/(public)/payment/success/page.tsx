'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, Receipt, ShieldCheck } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [amount, setAmount] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));

  useEffect(() => {
    if (!sessionId) return;
    api<{ data: { amount: number; transactionId?: string } }>(
      `/api/payments/verify?session_id=${sessionId}`,
    )
      .then((res) => {
        setAmount(res.data.amount);
        setTransactionId(res.data.transactionId ?? null);
        toast.success('Payment recorded successfully');
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Verification failed'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-40" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-lg flex-col items-center justify-center px-4 py-16 text-center" data-aos="zoom-in">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/25 dark:text-emerald-400">
          <CheckCircle2 className="size-8" />
        </span>
        <p className="mt-5 text-[11px] font-semibold tracking-[0.16em] text-emerald-600 uppercase dark:text-emerald-400">
          Payment confirmed
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Payment successful</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thank you! Your repair job is now marked as paid and your technician has been notified.
        </p>

        <div className="mt-8 w-full rounded-2xl border border-border/70 bg-card p-6 text-card-foreground shadow-lg shadow-slate-900/[0.03]">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              Verifying your payment...
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  <Receipt className="size-4" />
                  Amount paid
                </span>
                <span className="text-2xl font-semibold tracking-tight tabular-nums">
                  {amount !== null ? `$${amount}` : '—'}
                </span>
              </div>
              {transactionId && (
                <p className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>Transaction ID</span>
                  <span className="truncate font-mono text-foreground/70">{transactionId}</span>
                </p>
              )}
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-500/10 p-3 text-left text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
                This payment was processed securely by Stripe. A receipt has been sent to your email.
              </p>
            </>
          )}
        </div>

        <Link
          href="/dashboard/customer/bookings"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
        >
          Back to my bookings
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
