'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Booking } from '@/lib/auth-shared';
import { StatusBadge, PayBadge } from '@/components/badges';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  Plus,
  XCircle,
} from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

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
    let active = true;
    api<{ data: Booking[] }>('/api/bookings/my')
      .then((res) => {
        if (active) setBookings(res.data);
      })
      .catch(() => {
        if (active) setBookings([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function payNow(booking: Booking) {
    setPayingId(booking._id);
    try {
      const res = await api<{ url: string }>('/api/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ bookingId: booking._id }),
      });
      if (res.url) window.location.assign(res.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPayingId(null);
    }
  }

  async function cancelBooking(id: string) {
    setCancelling(true);
    try {
      await api(`/api/bookings/${id}/cancel`, { method: 'PATCH' });
      toast.success('Booking cancelled');
      setCancelId(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cancel failed');
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer workspace"
        title="My bookings"
        description="Every repair request, its live status and payment state in one place."
        icon={ClipboardList}
        actions={
          <Link
            href="/services"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
          >
            <Plus className="size-4" />
            New request
          </Link>
        }
      />

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No bookings yet"
          description="Browse repair services and send your first request. You won't pay anything until the job is completed."
          action={
            <Link
              href="/services"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Browse services
            </Link>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Preferred date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
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
                      <p className="truncate text-xs text-muted-foreground">{booking.category}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground/80">
                  {booking.technicianName}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell className="font-semibold tabular-nums">
                  ${booking.paymentStatus === 'paid' ? booking.finalAmount : booking.basePrice}
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <PayBadge paid={booking.paymentStatus === 'paid'} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {booking.status === 'requested' && (
                      <button
                        onClick={() => setCancelId(booking._id)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-500/25 px-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-400"
                      >
                        <XCircle className="size-3.5" />
                        Cancel
                      </button>
                    )}
                    {booking.status === 'completed' && booking.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => payNow(booking)}
                        disabled={payingId === booking._id}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 text-xs font-semibold text-white shadow-sm shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:opacity-50"
                      >
                        <CreditCard className="size-3.5" />
                        {payingId === booking._id ? 'Redirecting...' : 'Pay now'}
                      </button>
                    )}
                    {booking.status === 'completed' && booking.paymentStatus === 'paid' && (
                      <span className="text-xs font-medium text-muted-foreground">Settled</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={Boolean(cancelId)}
        title="Cancel this booking?"
        description="The technician will be notified and this request cannot be restored."
        confirmLabel="Yes, cancel"
        cancelLabel="Keep booking"
        tone="danger"
        icon={XCircle}
        loading={cancelling}
        onConfirm={() => cancelId && cancelBooking(cancelId)}
        onClose={() => setCancelId(null)}
      />
    </div>
  );
}
