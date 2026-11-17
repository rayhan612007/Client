'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Service } from '@/lib/auth-shared';
import { StatCard } from '@/components/StatCard';

export default function TechnicianOverview() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api<{ data: Service[] }>('/api/services/my/all'), api<{ data: unknown[] }>('/api/bookings/technician')])
      .then(([s, b]) => {
        setServices(s.data);
        setBookings(b.data);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const pendingRequests = bookings.filter((b) => (b as { status?: string }).status === 'requested').length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Technician Overview</h1>
      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Services" value={services.length} icon="🔧" />
          <StatCard label="Approved Services" value={services.filter((s) => s.approvalStatus === 'approved').length} icon="✅" />
          <StatCard label="Pending Requests" value={pendingRequests} icon="📨" />
        </div>
      )}
    </div>
  );
}
