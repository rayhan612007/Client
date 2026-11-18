'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Booking, Service } from '@/lib/auth-shared';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/badges';
import { EmptyState } from '@/components/EmptyState';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FolderOpen,
  Plus,
  Wrench,
} from 'lucide-react';

export default function TechnicianOverview() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<{ data: Service[] }>('/api/services/my/all'),
      api<{ data: Booking[] }>('/api/bookings/technician'),
    ])
      .then(([serviceRes, bookingRes]) => {
        setServices(serviceRes.data);
        setBookings(bookingRes.data);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const approved = services.filter((service) => service.approvalStatus === 'approved').length;
  const pendingRequests = bookings.filter((booking) => booking.status === 'requested').length;
  const recent = bookings.slice(0, 5);

  const quickLinks = [
    {
      href: '/dashboard/technician/add-service',
      label: 'Add a service',
      description: 'Publish a new repair offering',
      icon: Plus,
    },
    {
      href: '/dashboard/technician/my-services',
      label: 'My services',
      description: 'Edit pricing and availability',
      icon: FolderOpen,
    },
    {
      href: '/dashboard/technician/requests',
      label: 'Manage requests',
      description: 'Accept and update jobs',
      icon: ClipboardList,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Technician workspace"
        title="Overview"
        description="A snapshot of your service catalogue and incoming repair requests."
        icon={Wrench}
        actions={
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Add service
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
            label="Total services"
            value={services.length}
            icon={FolderOpen}
            accent="blue"
            hint="Listings in your catalogue"
          />
          <StatCard
            label="Approved services"
            value={approved}
            icon={CheckCircle2}
            accent="emerald"
            hint="Visible on the public marketplace"
          />
          <StatCard
            label="Pending requests"
            value={pendingRequests}
            icon={ClipboardList}
            accent="amber"
            hint="Waiting for your response"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-border/70 bg-card shadow-xs lg:col-span-3" data-aos="fade-up">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Recent requests</h2>
              <p className="text-xs text-muted-foreground">Latest jobs assigned to you.</p>
            </div>
            <Link
              href="/dashboard/technician/requests"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Manage all
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
                icon={ClipboardList}
                title="No requests yet"
                description="New customer requests will appear here as soon as they book one of your services."
              />
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {recent.map((booking) => (
                <li key={booking._id} className="flex items-center gap-4 px-5 py-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={booking.serviceImage}
                    alt=""
                    className="h-12 w-16 shrink-0 rounded-xl object-cover ring-1 ring-border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{booking.serviceTitle}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {booking.customerName} ·{' '}
                      {new Date(booking.preferredDate).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs lg:col-span-2" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-base font-semibold tracking-tight">Quick actions</h2>
          <p className="text-xs text-muted-foreground">Keep your business moving.</p>
          <div className="mt-4 space-y-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3 transition hover:border-primary/30 hover:bg-muted/50"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
