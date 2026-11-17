'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Booking, BookingStatus } from '@/lib/auth-shared';
import { StatusBadge, PayBadge } from '@/components/badges';
import { toast } from 'sonner';

const FILTERS: (BookingStatus | 'all')[] = ['all', 'requested', 'accepted', 'in-progress', 'completed'];

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [finalAmount, setFinalAmount] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api<{ data: Booking[] }>('/api/bookings/technician');
      setBookings(res.data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: BookingStatus, amount?: number) {
    setBusy(true);
    try {
      await api(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, ...(amount !== undefined ? { finalAmount: amount } : {}) }),
      });
      toast.success(`Job marked as ${status}`);
      setCompleteId(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusy(false);
    }
  }

  const shown = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Manage Requests</h1>
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Requests</h1>

      {/* status filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-12 text-center">
          <p className="text-5xl" aria-hidden>📭</p>
          <p className="mt-3 font-semibold">No {filter === 'all' ? '' : filter} requests</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact / Address</th>
                <th className="px-4 py-3">Problem</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((b) => (
                <tr key={b._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.serviceImage} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      <span className="font-medium">{b.serviceTitle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {b.customerName}
                    <br />
                    <span className="text-xs text-gray-400">{new Date(b.preferredDate).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    {b.customerPhone}
                    <br />
                    <span className="text-xs text-gray-400">{b.address}</span>
                  </td>
                  <td className="max-w-[220px] px-4 py-3"><span className="line-clamp-2 text-xs text-gray-500">{b.problemDescription}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3"><PayBadge paid={b.paymentStatus === 'paid'} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {b.status === 'requested' && (
                        <>
                          <button disabled={busy} onClick={() => updateStatus(b._id, 'accepted')} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                            Accept
                          </button>
                          <button disabled={busy} onClick={() => updateStatus(b._id, 'rejected')} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
                            Reject
                          </button>
                        </>
                      )}
                      {b.status === 'accepted' && (
                        <button disabled={busy} onClick={() => updateStatus(b._id, 'in-progress')} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                          Start Work
                        </button>
                      )}
                      {b.status === 'in-progress' && (
                        <button
                          onClick={() => {
                            setCompleteId(b._id);
                            setFinalAmount(String(b.basePrice));
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* complete modal (final amount) */}
      {completeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setCompleteId(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const amount = Number(finalAmount);
              if (!Number.isFinite(amount) || amount <= 0) {
                toast.error('Final amount must be greater than 0');
                return;
              }
              updateStatus(completeId, 'completed', amount);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6"
          >
            <h2 className="text-lg font-bold">Mark Job Completed</h2>
            <label className="mt-4 block text-sm font-medium">
              Final Amount (USD)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </label>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setCompleteId(null)} className="flex-1 rounded-lg border border-gray-300 py-2 font-semibold hover:bg-gray-50">
                Back
              </button>
              <button type="submit" disabled={busy} className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {busy ? 'Saving…' : 'Confirm Completed'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
