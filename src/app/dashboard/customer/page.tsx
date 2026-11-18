'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Booking } from '@/lib/auth-shared';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/badges';
import { EmptyState } from '@/components/EmptyState';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Plus,
  Wrench,
} from 'lucide-react';

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
  const active = bookings.filter((b) =>
    ['requested', 'accepted', 'in-progress'].includes(b.status),
  ).length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const recent = bookings.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer workspace"
        title="Overview"
        description="Track your repair requests, monitor progress and pay only once the job is done."
        icon={ClipboardList}
        actions={
          <Link
            href="/services"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
          >
            <Plus className="size-4" />
            New repair request
          </Link>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total requests"
            value={total}
            icon={ClipboardList}
            accent="blue"
            hint="All repair requests you have created"
          />
          <StatCard
            label="Active jobs"
            value={active}
            icon={Wrench}
            accent="amber"
            hint="Requested, accepted or in progress"
          />
          <StatCard
            label="Completed jobs"
            value={completed}
            icon={CheckCircle2}
            accent="emerald"
            hint="Ready to review and pay if unpaid"
          />
        </div>
      )}

      <section className="rounded-2xl border border-border/70 bg-card shadow-xs" data-aos="fade-up">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Recent requests</h2>
            <p className="text-xs text-muted-foreground">Your latest five repair jobs.</p>
          </div>
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Wrench}
              title="No repair requests yet"
              description="Browse verified technicians and send your first repair request — there is no upfront cost."
              action={
                <Link
                  href="/services"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Browse services
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {recent.map((booking) => (
              <li key={booking._id}>
                <Link
                  href="/dashboard/customer/bookings"
                  className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-muted/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={booking.serviceImage}
                    alt=""
                    className="h-12 w-16 shrink-0 rounded-xl object-cover ring-1 ring-border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{booking.serviceTitle}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{booking.technicianName}</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="size-3" />
                        {new Date(booking.preferredDate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
