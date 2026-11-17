'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Booking } from '@/lib/auth-shared';
import { StatCard } from '@/components/StatCard';

export default function CustomerOverview() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ data: Booking[] }>('/api/bookings/my')
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const total = bookings.length;
  const active = bookings.filter((b) => ['requested', 'accepted', 'in-progress'].includes(b.status)).length;
  const completed = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Customer Overview</h1>
      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Requests" value={total} icon="📨" />
          <StatCard label="Active Jobs" value={active} icon="🔧" />
          <StatCard label="Completed Jobs" value={completed} icon="✅" />
        </div>
      )}
    </div>
  );
}
