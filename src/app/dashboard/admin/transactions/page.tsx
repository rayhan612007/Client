'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Payment } from '@/lib/auth-shared';

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ totalRevenue: number; data: Payment[] }>('/api/payments/admin/all')
      .then((res) => {
        setPayments(res.data);
        setTotalRevenue(res.totalRevenue ?? 0);
      })
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="mt-6 h-24 animate-pulse rounded-2xl bg-gray-100" />
        <div className="mt-4 h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <span className="text-sm text-gray-500">{payments.length} payments</span>
      </div>

      {/* total revenue above the table */}
      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl" aria-hidden>
          💰
        </span>
        <div>
          <p className="text-sm text-green-700">Total Revenue</p>
          <p className="text-2xl font-bold text-green-800">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-12 text-center">
          <p className="text-5xl" aria-hidden>🧾</p>
          <p className="mt-3 font-semibold">No transactions yet</p>
          <p className="mt-1 text-sm text-gray-500">Payments made through Stripe will appear here.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{p.serviceTitle}</td>
                  <td className="px-4 py-3">
                    {p.customerName}
                    <br />
                    <span className="text-xs text-gray-400">{p.customerEmail}</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.technicianName}
                    <br />
                    <span className="text-xs text-gray-400">{p.technicianEmail}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-700">
                    ${p.amount.toFixed(2)} <span className="text-xs font-normal uppercase text-gray-400">{p.currency}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.transactionId}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(p.paidAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
