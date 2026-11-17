'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Booking } from '@/lib/auth-shared';
import { StatusBadge, PayBadge } from '@/components/badges';
import { toast } from 'sonner';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api<{ data: Booking[] }>('/api/bookings/my');
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

  async function payNow(booking: Booking) {
    setPayingId(booking._id);
    try {
      const res = await api<{ url: string }>('/api/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ bookingId: booking._id }),
      });
      if (res.url) window.location.href = res.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPayingId(null);
    }
  }

  async function cancelBooking(id: string) {
    setCancelId(null);
    try {
      await api(`/api/bookings/${id}/cancel`, { method: 'PATCH' });
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cancel failed');
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center">
        <p className="text-5xl" aria-hidden>📭</p>
        <p className="mt-3 font-semibold">No bookings yet</p>
        <p className="mt-1 text-sm text-gray-500">Browse services and send your first repair request.</p>
        <a href="/services" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Browse Services
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Technician</th>
              <th className="px-4 py-3">Preferred Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.serviceImage} alt="" className="h-10 w-14 rounded-lg object-cover" />
                    <span className="font-medium">{b.serviceTitle}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{b.technicianName}</td>
                <td className="px-4 py-3">{new Date(b.preferredDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {b.paymentStatus === 'paid' ? <b>${b.finalAmount}</b> : <>${b.basePrice}</>}
                </td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3"><PayBadge paid={b.paymentStatus === 'paid'} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {b.status === 'requested' && (
                      <button
                        onClick={() => setCancelId(b._id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    )}
                    {b.status === 'completed' && b.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => payNow(b)}
                        disabled={payingId === b._id}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {payingId === b._id ? 'Redirecting…' : 'Pay Now'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* cancel confirmation modal */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setCancelId(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl" aria-hidden>⚠️</p>
            <h2 className="mt-2 text-lg font-bold">Cancel this booking?</h2>
            <p className="mt-1 text-sm text-gray-500">This can&apos;t be undone.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 rounded-lg border border-gray-300 py-2 font-semibold hover:bg-gray-50">
                Keep Booking
              </button>
              <button onClick={() => cancelBooking(cancelId)} className="flex-1 rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
