'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, getToken } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import { Service, Role } from '@/lib/auth-shared';
import { toast } from 'sonner';
import {
  WrenchIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  ArrowRightIcon,
  CalendarIcon,
  PhoneIcon,
} from '@/components/Icons';

function RequestFormModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // min = today (formatted YYYY-MM-DD)
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
      toast.success('Repair request sent successfully!');
      onClose();
      router.push('/dashboard/customer/bookings');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
              New Repair Request
            </span>
            <h2 className="text-xl font-bold text-slate-900">{service.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-blue-50/70 p-3.5 text-xs text-blue-800 leading-relaxed border border-blue-100">
          🛡️ <strong>Zero advance payment:</strong> You will only pay the final agreed amount after the technician completes the repair and you verify it works.
        </div>

        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
          {/* Read-Only Name & Email */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              Customer Name
              <input
                readOnly
                value={session?.user?.name ?? ''}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 cursor-not-allowed"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Customer Email
              <input
                readOnly
                value={session?.user?.email ?? ''}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 cursor-not-allowed"
              />
            </label>
          </div>

          {/* Contact Phone */}
          <label className="text-xs font-semibold text-slate-700">
            Contact Phone Number *
            <div className="relative mt-1">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="017XXXXXXXX"
              />
            </div>
          </label>

          {/* Address */}
          <label className="text-xs font-semibold text-slate-700">
            Service / Pickup Address *
            <div className="relative mt-1">
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="House #, Road #, Area, City"
              />
            </div>
          </label>

          {/* Preferred Date */}
          <label className="text-xs font-semibold text-slate-700">
            Preferred Date * (Today or Future)
            <div className="relative mt-1">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                required
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </label>

          {/* Problem Description */}
          <label className="text-xs font-semibold text-slate-700">
            Problem Description * <span className="text-slate-400 font-normal">(Min 20 characters)</span>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Explain what is wrong with your device, when it started, and any symptoms..."
            />
          </label>
          {description.length > 0 && description.trim().length < 20 && (
            <p className="text-xs text-rose-500 font-medium -mt-2">
              {20 - description.trim().length} more characters required
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? 'Submitting...' : 'Submit Request'}
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
      // logged-out → sign in and redirect back
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
      toast.info('Only customers can request a repair service');
      return;
    }
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="h-96 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <WrenchIcon className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Service Not Found</h1>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          This repair service listing may be pending admin approval, marked unavailable, or removed.
        </p>
        <Link
          href="/services"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <span>Browse Available Services</span>
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Breadcrumb nav */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/services" className="hover:text-blue-600">
          Services
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{service.title}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Left Column: Image, Info & Description */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Service Image Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.title}
              className="h-80 w-full object-cover sm:h-[420px]"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                {service.category}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                  service.serviceMode === 'Home Visit'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/30'
                }`}
              >
                {service.serviceMode === 'Home Visit' ? '🏡 Home Visit' : '🏬 Shop Drop-off'}
              </span>
            </div>
          </div>

          {/* Service Title & Metadata */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {service.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-blue-600" />
                Service Area: <strong className="text-slate-700">{service.serviceArea}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-amber-500" />
                Duration: <strong className="text-slate-700">{service.estimatedDuration}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <ShieldCheckIcon className="h-4 w-4" />
                30-Day Warranty Included
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">What This Repair Service Includes</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
              {service.description}
            </p>
          </div>

          {/* Technician Profile Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md">
                {service.technicianName?.charAt(0) || 'T'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{service.technicianName}</h3>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                    Verified Technician
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{service.technicianEmail}</p>
                <p className="text-xs text-slate-400 mt-1">Specialized in {service.category} repairs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Box */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-lg shadow-slate-200/50">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Starting Base Price
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">${service.basePrice}</span>
                <span className="text-xs text-slate-400">USD</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Final amount confirmed by technician upon job inspection.
              </p>
            </div>

            {/* Quick Highlights */}
            <ul className="mt-5 space-y-3 text-xs text-slate-600">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-slate-400" />
                  Estimated Time:
                </span>
                <span className="font-semibold text-slate-900">{service.estimatedDuration}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <WrenchIcon className="h-4 w-4 text-slate-400" />
                  Service Mode:
                </span>
                <span className="font-semibold text-slate-900">{service.serviceMode}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-slate-400" />
                  Coverage Area:
                </span>
                <span className="font-semibold text-slate-900">{service.serviceArea}</span>
              </li>
            </ul>

            {/* Zero Upfront Guarantee */}
            <div className="mt-5 rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-800 leading-relaxed border border-emerald-100">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                Pay After Service Guarantee
              </p>
              <p className="mt-1 text-[11px] text-emerald-700">
                You pay zero today. After the repair is completed, test your device and pay via Stripe test card.
              </p>
            </div>

            {/* Request Button */}
            <button
              onClick={onRequestClick}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              <span>Request Repair Service</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Request Modal */}
      {showForm && <RequestFormModal service={service} onClose={() => setShowForm(false)} />}
    </div>
  );
}
