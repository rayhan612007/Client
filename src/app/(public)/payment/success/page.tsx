'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [amount, setAmount] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    api<{ data: { amount: number; transactionId?: string } }>(`/api/payments/verify?session_id=${sessionId}`)
      .then((res) => {
        setAmount(res.data.amount);
        setTransactionId(res.data.transactionId ?? null);
        toast.success('Payment recorded successfully');
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Verification failed'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-6xl" aria-hidden>✅</p>
      <h1 className="mt-4 text-3xl font-bold text-green-600">Payment Successful!</h1>
      {loading ? (
        <div className="mx-auto mt-6 h-20 w-full max-w-sm animate-pulse rounded-2xl bg-gray-100" />
      ) : (
        <div className="mt-6 rounded-2xl border border-gray-200 p-6">
          <p className="text-gray-600">Amount paid</p>
          <p className="text-3xl font-bold">{amount !== null ? `$${amount}` : '—'}</p>
          {transactionId && <p className="mt-2 break-all text-xs text-gray-400">Transaction ID: {transactionId}</p>}
        </div>
      )}
      <Link href="/dashboard/customer/bookings" className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Back to My Bookings
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-20" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
