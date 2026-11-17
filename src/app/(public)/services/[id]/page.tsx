'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, getToken } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import { Service, Role } from '@/lib/auth-shared';
import { toast } from 'sonner';

function RequestForm({ service, onClose }: { service: Service; onClose: () => void }) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // min = today
  const today = new Date().toISOString().split('T')[0];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (description.trim().length < 20) {
      toast.error('Problem description must be at least 20 characters');
      return;
    }
    setSaving(true);
    try {
      await api('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service._id,
          customerPhone: phone,
          address,
          preferredDate: date,
          problemDescription: description,
        }),
      });
      toast.success('Repair request sent!');
      onClose();
      router.push('/dashboard/customer/bookings');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">Request Repair — {service.title}</h2>
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
          <label className="text-sm font-medium">
            Name
            <input readOnly value={session?.user?.name ?? ''} className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2" />
          </label>
          <label className="text-sm font-medium">
            Email
            <input readOnly value={session?.user?.email ?? ''} className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2" />
          </label>
          <label className="text-sm font-medium">
            Phone
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" placeholder="01XXXXXXXXX" />
          </label>
          <label className="text-sm font-medium">
            Address
            <input required value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" placeholder="House, street, area" />
          </label>
          <label className="text-sm font-medium">
            Preferred Date
            <input required type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
          </label>
          <label className="text-sm font-medium">
            Problem Description <span className="text-xs text-gray-400">(min 20 characters)</span>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Describe what's wrong with your device…"
            />
          </label>
          {description.length > 0 && description.trim().length < 20 && (
            <p className="text-xs text-red-500">{20 - description.trim().length} more characters needed</p>
          )}
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-300 py-2.5 font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Sending…' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    api<{ data: Service }>(`/api/services/${id}`)
      .then((res) => setService(res.data))
      .catch(() => setService(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function onRequestClick() {
    if (isPending || checkingAuth) return;
    const user = session?.user as { role?: Role } | undefined;
    if (!user) {
      // logged-out → sign in and come back to this page
      setCheckingAuth(true);
      const token = await getToken();
      setCheckingAuth(false);
      if (!token) {
        router.push(`/sign-in?next=/services/${id}`);
        return;
      }
    }
    const role = user?.role;
    if (role && role !== 'customer') {
      toast.info('Only customers can request a repair');
      return;
    }
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-5xl" aria-hidden>🔧</p>
        <h1 className="text-2xl font-bold">Service not found</h1>
        <p className="text-gray-500">It may be pending approval or no longer available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.image} alt={service.title} className="h-72 w-full rounded-2xl object-cover sm:h-96" />
          <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {service.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold">{service.title}</h1>
          <p className="mt-4 whitespace-pre-line text-gray-600">{service.description}</p>
        </div>

        <aside className="flex flex-col gap-4 self-start rounded-2xl border border-gray-200 p-6">
          <p className="text-3xl font-bold text-blue-600">${service.basePrice}</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-600">
            <li>⏱️ <b>Duration:</b> {service.estimatedDuration}</li>
            <li>🏠 <b>Mode:</b> {service.serviceMode}</li>
            <li>📍 <b>Area:</b> {service.serviceArea}</li>
          </ul>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold">Technician</p>
            <p className="text-sm text-gray-600">{service.technicianName}</p>
          </div>
          <button
            onClick={onRequestClick}
            className="rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Request Repair
          </button>
        </aside>
      </div>

      {showForm && <RequestForm service={service} onClose={() => setShowForm(false)} />}
    </div>
  );
}
