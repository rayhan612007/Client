'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { Service, ApprovalStatus, APPROVAL_LABEL } from '@/lib/auth-shared';
import { ApprovalBadge } from '@/components/badges';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FilterPills } from '@/components/FilterPills';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Check, ShieldCheck, XCircle } from 'lucide-react';

type Filter = ApprovalStatus | 'all';

const FILTERS: Filter[] = ['pending', 'approved', 'rejected', 'all'];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');
  const [confirm, setConfirm] = useState<{ id: string; title: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    api<{ data: Service[] }>('/api/services/admin/all')
      .then((res) => setServices(res.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  async function decide(id: string, approvalStatus: 'approved' | 'rejected') {
    setBusyId(id);
    try {
      await api(`/api/admin/services/${id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(`Service ${approvalStatus}`);
      setConfirm(null);
      setServices((current) =>
        current.map((service) =>
          service._id === id ? { ...service, approvalStatus } : service,
        ),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusyId(null);
    }
  }

  const shown = useMemo(() => {
    if (filter === 'all') {
      return [...services].sort((a, b) =>
        a.approvalStatus === b.approvalStatus
          ? 0
          : a.approvalStatus === 'pending'
            ? -1
            : b.approvalStatus === 'pending'
              ? 1
              : 0,
      );
    }
    return services.filter((service) => service.approvalStatus === filter);
  }, [services, filter]);

  const pendingCount = services.filter((service) => service.approvalStatus === 'pending').length;

  const filterOptions = FILTERS.map((value) => ({
    value,
    label: value === 'all' ? 'All' : APPROVAL_LABEL[value],
    count:
      value === 'all'
        ? services.length
        : services.filter((service) => service.approvalStatus === value).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="Service approval"
        description="Approve verified listings or reject services that do not meet platform standards."
        icon={ShieldCheck}
        actions={
          pendingCount > 0 ? (
            <span className="inline-flex h-10 items-center rounded-xl bg-amber-500/10 px-3 text-xs font-semibold text-amber-700 ring-1 ring-amber-500/20 ring-inset dark:text-amber-300">
              {pendingCount} awaiting review
            </span>
          ) : (
            <span className="inline-flex h-10 items-center rounded-xl bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/20 ring-inset dark:text-emerald-300">
              All caught up
            </span>
          )
        }
      />

      <FilterPills options={filterOptions} value={filter} onChange={setFilter} />

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      ) : shown.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={`No ${filter === 'all' ? '' : APPROVAL_LABEL[filter]} services`}
          description={
            filter === 'pending'
              ? 'All caught up — nothing is waiting for approval right now.'
              : 'Services will appear here once they match this status.'
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((service) => (
              <TableRow key={service._id}>
                <TableCell>
                  <div className="flex min-w-[220px] items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.image}
                      alt=""
                      className="h-11 w-14 rounded-lg object-cover ring-1 ring-border"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{service.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {service.serviceMode} · {service.serviceArea}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground/80">{service.category}</TableCell>
                <TableCell>
                  <p className="text-sm text-foreground/80">{service.technicianName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {service.technicianEmail}
                  </p>
                </TableCell>
                <TableCell className="font-semibold tabular-nums">${service.basePrice}</TableCell>
                <TableCell>
                  <ApprovalBadge status={service.approvalStatus} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(service.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {service.approvalStatus !== 'approved' && (
                      <button
                        disabled={busyId === service._id}
                        onClick={() => decide(service._id, 'approved')}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 text-xs font-semibold text-white shadow-sm shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:opacity-50"
                      >
                        <Check className="size-3.5" />
                        Approve
                      </button>
                    )}
                    {service.approvalStatus !== 'rejected' && (
                      <button
                        disabled={busyId === service._id}
                        onClick={() => setConfirm({ id: service._id, title: service.title })}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-500/25 px-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/10 disabled:opacity-50 dark:text-rose-400"
                      >
                        <XCircle className="size-3.5" />
                        Reject
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Reject this service?"
        description={
          <>
            <span className="font-semibold text-foreground">{confirm?.title}</span> will be hidden
            from public pages. The technician can edit and resubmit it for review.
          </>
        }
        confirmLabel="Yes, reject"
        cancelLabel="Keep reviewing"
        tone="danger"
        icon={XCircle}
        loading={Boolean(confirm) && busyId === confirm?.id}
        onConfirm={() => confirm && decide(confirm.id, 'rejected')}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}
