'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Booking, BookingStatus, STATUS_LABEL } from '@/lib/auth-shared';
import { StatusBadge, PayBadge } from '@/components/badges';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { FilterPills } from '@/components/FilterPills';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClipboardList } from 'lucide-react';

type Filter = BookingStatus | 'all';

const STATUSES: BookingStatus[] = [
  'requested',
  'accepted',
  'in-progress',
  'completed',
  'rejected',
  'cancelled',
];

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const rawStatus = searchParams.get('status') ?? 'all';
  const filter: Filter =
    rawStatus !== 'all' && (STATUSES as readonly string[]).includes(rawStatus)
      ? (rawStatus as BookingStatus)
      : 'all';

  useEffect(() => {
    api<{ data: Booking[] }>('/api/admin/bookings')
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  function setFilter(next: Filter) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === 'all') params.delete('status');
    else params.set('status', next);
    const qs = params.toString();
    router.replace(`/dashboard/admin/bookings${qs ? `?${qs}` : ''}`, {
      scroll: false,
    });
  }

  const shown = useMemo(
    () =>
      filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter),
    [bookings, filter],
  );

  const filterOptions = [
    { value: 'all' as Filter, label: 'All', count: bookings.length },
    ...STATUSES.map((status) => ({
      value: status as Filter,
      label: STATUS_LABEL[status],
      count: bookings.filter((booking) => booking.status === status).length,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="All bookings"
        description="Monitor every repair job across customers and technicians."
        icon={ClipboardList}
        actions={
          <span className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-3 text-xs font-semibold text-muted-foreground tabular-nums">
            {bookings.length} bookings
          </span>
        }
      />

      <FilterPills options={filterOptions} value={filter} onChange={setFilter} />

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      ) : shown.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={`No ${filter === 'all' ? '' : STATUS_LABEL[filter]} bookings`}
          description="Bookings on the platform will show up here."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                  <div className="flex min-w-[220px] items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={booking.serviceImage}
                      alt=""
                      className="h-11 w-14 rounded-lg object-cover ring-1 ring-border"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{booking.serviceTitle}</p>
                      <p className="text-xs text-muted-foreground">{booking.category}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-foreground/80">{booking.customerName}</p>
                  <p className="truncate text-xs text-muted-foreground">{booking.customerEmail}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-foreground/80">{booking.technicianName}</p>
                  <p className="truncate text-xs text-muted-foreground">{booking.technicianEmail}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(booking.preferredDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <PayBadge paid={booking.paymentStatus === 'paid'} />
                </TableCell>
                <TableCell className="font-semibold tabular-nums">
                  ${(booking.finalAmount || booking.basePrice).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-80 max-w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="skeleton h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="skeleton h-64 w-full" />
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<BookingsSkeleton />}>
      <BookingsContent />
    </Suspense>
  );
}
