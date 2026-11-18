'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Booking, BookingStatus } from '@/lib/auth-shared';
import { StatCard } from '@/components/StatCard';

interface AdminStats {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
}

const STATUSES: BookingStatus[] = ['requested', 'accepted', 'in-progress', 'completed', 'rejected', 'cancelled'];

const STATUS_BAR: Record<BookingStatus, string> = {
  requested: 'bg-blue-500',
  accepted: 'bg-indigo-500',
  'in-progress': 'bg-amber-500',
  completed: 'bg-green-500',
  rejected: 'bg-red-500',
  cancelled: 'bg-gray-400',
};

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<{ data: AdminStats }>('/api/admin/stats'),
      api<{ data: Booking[] }>('/api/bookings/admin/all'),
    ])
      .then(([s, b]) => {
        setStats(s.data);
        setBookings(b.data);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const counts = STATUSES.map((status) => ({
    status,
    count: bookings.filter((b) => b.status === status).length,
  }));
  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <Link
          href="/dashboard/admin/services"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          Review Pending Services
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon="👥" />
            <StatCard label="Total Technicians" value={stats?.totalTechnicians ?? 0} icon="🔧" />
            <StatCard label="Pending Services" value={stats?.pendingServices ?? 0} icon="⏳" />
          </div>

          {/* Bookings by status chart */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Bookings by Status</h2>
              <span className="text-xs text-gray-400">{bookings.length} total</span>
            </div>
            {bookings.length === 0 ? (
              <p className="mt-6 text-center text-sm text-gray-500">No bookings on the platform yet.</p>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                {counts.map(({ status, count }) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-xs font-semibold capitalize text-gray-600">{status}</span>
                    <div className="h-5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${STATUS_BAR[status]}`}
                        style={{ width: `${Math.max((count / maxCount) * 100, count > 0 ? 6 : 0)}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-xs font-bold text-gray-700">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Link href="/dashboard/admin/users" className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
              <p className="text-2xl" aria-hidden>🧑‍💼</p>
              <p className="mt-2 font-semibold">Manage Users</p>
              <p className="text-xs text-gray-500">Change customer / technician / admin roles</p>
            </Link>
            <Link href="/dashboard/admin/bookings" className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
              <p className="text-2xl" aria-hidden>📋</p>
              <p className="mt-2 font-semibold">All Bookings</p>
              <p className="text-xs text-gray-500">Monitor every repair job on the platform</p>
            </Link>
            <Link href="/dashboard/admin/transactions" className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
              <p className="text-2xl" aria-hidden>💰</p>
              <p className="mt-2 font-semibold">Transactions</p>
              <p className="text-xs text-gray-500">Track Stripe revenue and payment IDs</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
