'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Booking, BookingStatus } from '@/lib/auth-shared';
import { StatusBadge, PayBadge } from '@/components/badges';

type Filter = BookingStatus | 'all';

const FILTERS: Filter[] = ['all', 'requested', 'accepted', 'in-progress', 'completed', 'rejected', 'cancelled'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    api<{ data: Booking[] }>('/api/bookings/admin/all')
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const shown = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <span className="text-sm text-gray-500">{bookings.length} bookings</span>
      </div>

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
          <p className="text-5xl" aria-hidden>📋</p>
          <p className="mt-3 font-semibold">No {filter === 'all' ? '' : filter} bookings</p>
          <p className="mt-1 text-sm text-gray-500">Bookings on the platform will show up here.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((b) => (
                <tr key={b._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.serviceImage} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{b.serviceTitle}</p>
                        <p className="text-xs text-gray-400">{b.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {b.customerName}
                    <br />
                    <span className="text-xs text-gray-400">{b.customerEmail}</span>
                  </td>
                  <td className="px-4 py-3">
                    {b.technicianName}
                    <br />
                    <span className="text-xs text-gray-400">{b.technicianEmail}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(b.preferredDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PayBadge paid={b.paymentStatus === 'paid'} />
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ${(b.finalAmount || b.basePrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
