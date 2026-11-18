'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Booking, BookingStatus } from '@/lib/auth-shared';
import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/PageHeader';
import {
  ArrowRight,
  ClipboardList,
  Clock,
  Receipt,
  ShieldCheck,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
}

const STATUSES: BookingStatus[] = [
  'requested',
  'accepted',
  'in-progress',
  'completed',
  'rejected',
  'cancelled',
];

const STATUS_BAR: Record<BookingStatus, string> = {
  requested: 'bg-blue-500',
  accepted: 'bg-indigo-500',
  'in-progress': 'bg-amber-500',
  completed: 'bg-emerald-500',
  rejected: 'bg-rose-500',
  cancelled: 'bg-zinc-400',
};

const QUICK_LINKS = [
  {
    href: '/dashboard/admin/users',
    label: 'Manage users',
    description: 'Change customer, technician or admin roles',
    icon: UserCog,
    tile: 'bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400',
  },
  {
    href: '/dashboard/admin/services',
    label: 'Service approval',
    description: 'Review and approve technician listings',
    icon: ShieldCheck,
    tile: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
  },
  {
    href: '/dashboard/admin/bookings',
    label: 'All bookings',
    description: 'Monitor every repair job on the platform',
    icon: ClipboardList,
    tile: 'bg-indigo-500/10 text-indigo-600 ring-indigo-500/20 dark:text-indigo-400',
  },
  {
    href: '/dashboard/admin/transactions',
    label: 'Transactions',
    description: 'Track Stripe revenue and payment IDs',
    icon: Receipt,
    tile: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400',
  },
];

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<{ data: AdminStats }>('/api/admin/stats'),
      api<{ data: Booking[] }>('/api/bookings/admin/all'),
    ])
      .then(([statsRes, bookingsRes]) => {
        setStats(statsRes.data);
        setBookings(bookingsRes.data);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const counts = STATUSES.map((status) => ({
    status,
    count: bookings.filter((booking) => booking.status === status).length,
  }));
  const maxCount = Math.max(...counts.map((entry) => entry.count), 1);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="Overview"
        description="Platform health at a glance — users, service approvals and booking activity."
        icon={Users}
        actions={
          <Link
            href="/dashboard/admin/services"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
          >
            <ShieldCheck className="size-4" />
            Review pending services
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
            label="Total users"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            accent="blue"
            hint="Customers, technicians and admins"
          />
          <StatCard
            label="Total technicians"
            value={stats?.totalTechnicians ?? 0}
            icon={Wrench}
            accent="indigo"
            hint="Verified repair specialists"
          />
          <StatCard
            label="Pending services"
            value={stats?.pendingServices ?? 0}
            icon={Clock}
            accent="amber"
            hint="Awaiting your approval"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs lg:col-span-3" data-aos="fade-up">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Bookings by status</h2>
              <p className="text-xs text-muted-foreground">Live distribution across the pipeline.</p>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground tabular-nums">
              {bookings.length} total
            </span>
          </div>

          {bookings.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              No bookings on the platform yet.
            </p>
          ) : (
            <div className="mt-6 flex flex-col gap-3.5">
              {counts.map(({ status, count }) => (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs font-semibold text-muted-foreground capitalize">
                    {status}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${STATUS_BAR[status]} transition-all`}
                      style={{
                        width: `${Math.max((count / maxCount) * 100, count > 0 ? 6 : 0)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs font-bold tabular-nums">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs lg:col-span-2" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-base font-semibold tracking-tight">Administration</h2>
          <p className="text-xs text-muted-foreground">Jump straight to a management area.</p>
          <div className="mt-4 space-y-2">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3 transition hover:border-primary/30 hover:bg-muted/50"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ${link.tile}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{link.label}</span>
                    <span className="block text-xs text-muted-foreground">{link.description}</span>
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
