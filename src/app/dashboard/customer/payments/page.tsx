'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Payment } from '@/lib/auth-shared';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ data: Payment[] }>('/api/payments/my')
      .then((res) => setPayments(res.data))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Payment History</h1>
      {loading ? (
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-gray-100" />
      ) : payments.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-12 text-center">
          <p className="text-5xl" aria-hidden>🧾</p>
          <p className="mt-3 font-semibold">No payments yet</p>
          <p className="mt-1 text-sm text-gray-500">Your completed and paid jobs will appear here.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{p.serviceTitle}</td>
                  <td className="px-4 py-3">{p.technicianName}</td>
                  <td className="px-4 py-3 font-bold">${p.amount}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-xs text-gray-400">{p.transactionId}</td>
                  <td className="px-4 py-3">{new Date(p.paidAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
