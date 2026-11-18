'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Service, ApprovalStatus } from '@/lib/auth-shared';
import { ApprovalBadge } from '@/components/badges';
import { toast } from 'sonner';

type Filter = ApprovalStatus | 'all';

/** Pending is the default filter so new services are easy to find. */
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
      await api(`/api/services/${id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(`Service ${approvalStatus}`);
      setConfirm(null);
      setServices((cur) => cur.map((s) => (s._id === id ? { ...s, approvalStatus } : s)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusyId(null);
    }
  }

  // Show pending first whenever the full list is visible
  const shown =
    filter === 'all'
      ? [...services].sort((a, b) =>
          a.approvalStatus === b.approvalStatus ? 0 : a.approvalStatus === 'pending' ? -1 : b.approvalStatus === 'pending' ? 1 : 0,
        )
      : services.filter((s) => s.approvalStatus === filter);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Service Approval</h1>
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  const pendingCount = services.filter((s) => s.approvalStatus === 'pending').length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Service Approval</h1>
        {pendingCount > 0 && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {pendingCount} awaiting review
          </span>
        )}
      </div>

      {/* approval status filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-12 text-center">
          <p className="text-5xl" aria-hidden>✅</p>
          <p className="mt-3 font-semibold">No {filter === 'all' ? '' : filter} services</p>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'pending' ? 'All caught up — nothing is waiting for approval.' : 'Services will appear here once they match this status.'}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((s) => (
                <tr key={s._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{s.title}</p>
                        <p className="text-xs text-gray-400">
                          {s.serviceMode} · {s.serviceArea}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{s.category}</td>
                  <td className="px-4 py-3">
                    {s.technicianName}
                    <br />
                    <span className="text-xs text-gray-400">{s.technicianEmail}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">${s.basePrice}</td>
                  <td className="px-4 py-3">
                    <ApprovalBadge status={s.approvalStatus} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {s.approvalStatus !== 'approved' && (
                        <button
                          disabled={busyId === s._id}
                          onClick={() => decide(s._id, 'approved')}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {s.approvalStatus !== 'rejected' && (
                        <button
                          disabled={busyId === s._id}
                          onClick={() => setConfirm({ id: s._id, title: s.title })}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* reject confirmation modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl" aria-hidden>🚫</p>
            <h2 className="mt-2 text-lg font-bold">Reject this service?</h2>
            <p className="mt-1 text-sm text-gray-500">
              <span className="font-semibold">{confirm.title}</span> will not appear on public pages.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 rounded-lg border border-gray-300 py-2 font-semibold hover:bg-gray-50"
              >
                Keep Reviewing
              </button>
              <button
                disabled={busyId === confirm.id}
                onClick={() => decide(confirm.id, 'rejected')}
                className="flex-1 rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {busyId === confirm.id ? 'Rejecting…' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
