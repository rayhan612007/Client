'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Booking, BookingStatus, STATUS_LABEL } from '@/lib/auth-shared';
import { StatusBadge, PayBadge } from '@/components/badges';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { FilterPills } from '@/components/FilterPills';
import { Field } from '@/components/SettingsCard';
import { Input } from '@/components/ui/input';
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
  CheckCircle2,
  ClipboardList,
  Loader2,
  PlayCircle,
  ThumbsDown,
  ThumbsUp,
  Wrench,
  X,
} from 'lucide-react';

type Filter = BookingStatus | 'all';

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [problemDetails, setProblemDetails] = useState<Booking | null>(null);
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [finalAmount, setFinalAmount] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api<{ data: Booking[] }>('/api/bookings/technician');
      setBookings(res.data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    api<{ data: Booking[] }>('/api/bookings/technician')
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

  useEffect(() => {
    if (!problemDetails) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setProblemDetails(null);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [problemDetails]);

  async function updateStatus(id: string, status: BookingStatus, amount?: number) {
    setBusy(true);
    try {
      await api(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          ...(amount !== undefined ? { finalAmount: amount } : {}),
        }),
      });
      toast.success(`Job marked as ${status}`);
      setCompleteId(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusy(false);
    }
  }

  const shown = filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter);

  const filters: { value: Filter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: bookings.length },
    ...(['requested', 'accepted', 'in-progress', 'completed'] as BookingStatus[]).map((status) => ({
      value: status,
      label: STATUS_LABEL[status],
      count: bookings.filter((booking) => booking.status === status).length,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Technician workspace"
        title="Manage requests"
        description="Accept incoming jobs, move them through the pipeline and set the final amount."
        icon={ClipboardList}
      />

      <FilterPills options={filters} value={filter} onChange={setFilter} />

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      ) : shown.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title={`No ${filter === 'all' ? '' : STATUS_LABEL[filter]} requests`}
          description="When customers book your services, their requests will appear here."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact / address</TableHead>
              <TableHead>Problem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                  <div className="flex min-w-[200px] items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={booking.serviceImage}
                      alt=""
                      className="h-11 w-14 rounded-lg object-cover ring-1 ring-border"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{booking.serviceTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.preferredDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground/80">{booking.customerName}</TableCell>
                <TableCell>
                  <p className="text-sm text-foreground/80">{booking.customerPhone}</p>
                  <p className="max-w-[180px] truncate text-xs text-muted-foreground">
                    {booking.address}
                  </p>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => setProblemDetails(booking)}
                    aria-label={`View full problem description for ${booking.serviceTitle}`}
                    className="block max-w-[220px] text-left"
                  >
                    <span className="line-clamp-2 text-xs leading-relaxed text-red-600 dark:text-red-400">
                      {booking.problemDescription}
                    </span>
                  </button>
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
                      <>
                        <button
                          disabled={busy}
                          onClick={() => updateStatus(booking._id, 'accepted')}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 text-xs font-semibold text-white shadow-sm shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:opacity-50"
                        >
                          <ThumbsUp className="size-3.5" />
                          Accept
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => updateStatus(booking._id, 'rejected')}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-500/25 px-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/10 disabled:opacity-50 dark:text-rose-400"
                        >
                          <ThumbsDown className="size-3.5" />
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === 'accepted' && (
                      <button
                        disabled={busy}
                        onClick={() => updateStatus(booking._id, 'in-progress')}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-amber-500 px-2.5 text-xs font-semibold text-white shadow-sm shadow-amber-500/25 transition hover:bg-amber-400 disabled:opacity-50"
                      >
                        <PlayCircle className="size-3.5" />
                        Start work
                      </button>
                    )}
                    {booking.status === 'in-progress' && (
                      <button
                        onClick={() => {
                          setCompleteId(booking._id);
                          setFinalAmount(String(booking.basePrice));
                        }}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Complete
                      </button>
                    )}
                    {['completed', 'rejected', 'cancelled'].includes(booking.status) && (
                      <span className="text-xs font-medium text-muted-foreground">No action</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {problemDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setProblemDetails(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="problem-details-title"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl animate-in-up"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
              <div>
                <h2 id="problem-details-title" className="text-base font-semibold tracking-tight">
                  Problem details
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {problemDetails.serviceTitle} · {problemDetails.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProblemDetails(null)}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close problem details"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/80">
                {problemDetails.problemDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Complete job modal */}
      {completeId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setCompleteId(null)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const amount = Number(finalAmount);
              if (!Number.isFinite(amount) || amount <= 0) {
                toast.error('Final amount must be greater than 0');
                return;
              }
              updateStatus(completeId, 'completed', amount);
            }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl animate-in-up"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Complete this job</h2>
                  <p className="text-xs text-muted-foreground">
                    Set the final amount the customer will pay.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCompleteId(null)}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-5 py-5">
              <Field label="Final amount (USD)" htmlFor="final-amount">
                <Input
                  id="final-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={finalAmount}
                  onChange={(event) => setFinalAmount(event.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </Field>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCompleteId(null)}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-50"
              >
                {busy && <Loader2 className="size-4 animate-spin" />}
                Confirm completed
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
