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
  CheckIcon,
  CheckCircleIcon,
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
      toast.success('Repair request sent successfully!', {
        action: {
          label: 'My Bookings',
          onClick: () => router.push('/dashboard/customer/bookings'),
        },
      });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSaving(false);
    }
  }

  const fieldClass =
    'mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-in-scale max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
              New Repair Request
            </span>
            <h2 className="mt-0.5 truncate text-xl font-bold text-foreground">
              {service.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close request form"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-muted-foreground/15 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-200/70 bg-emerald-50 p-3.5 text-xs leading-relaxed text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
          <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p>
            <strong className="font-bold">Zero advance payment:</strong> You will only pay
            the final agreed amount after the technician completes the repair and you
            verify it works.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-foreground/80">
              Customer Name
              <input
                readOnly
                value={session?.user?.name ?? ''}
                className="mt-1 w-full cursor-not-allowed rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground"
              />
            </label>
            <label className="text-xs font-semibold text-foreground/80">
              Customer Email
              <input
                readOnly
                value={session?.user?.email ?? ''}
                className="mt-1 w-full cursor-not-allowed rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground"
              />
            </label>
          </div>

          <label className="text-xs font-semibold text-foreground/80">
            Contact Phone Number *
            <div className="relative">
              <PhoneIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="mt-1 w-full rounded-xl border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
              />
            </div>
          </label>

          <label className="text-xs font-semibold text-foreground/80">
            Service / Pickup Address *
            <div className="relative">
              <MapPinIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Road #, Area, City"
                className="mt-1 w-full rounded-xl border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
              />
            </div>
          </label>

          <label className="text-xs font-semibold text-foreground/80">
            Preferred Date *{' '}
            <span className="font-normal text-muted-foreground">(Today or future)</span>
            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground transition focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
              />
            </div>
          </label>

          <label className="text-xs font-semibold text-foreground/80">
            Problem Description *{' '}
            <span className="font-normal text-muted-foreground">(Min 20 characters)</span>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what is wrong with your device, when it started, and any symptoms..."
              className={fieldClass}
            />
          </label>
          {description.length > 0 && description.trim().length < 20 && (
            <p className="-mt-2 text-xs font-medium text-rose-500 dark:text-rose-400">
              {20 - description.trim().length} more characters required
            </p>
          )}

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-50"
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
      <div className="container-page py-12">
        <div className="skeleton mb-6 h-4 w-64" />
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div className="skeleton h-80 w-full sm:h-[420px]" />
            <div className="skeleton h-8 w-2/3" />
            <div className="skeleton h-40 w-full" />
          </div>
          <div className="lg:col-span-4">
            <div className="skeleton h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <WrenchIcon className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Service Not Found</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          This repair service listing may be pending admin approval, marked unavailable,
          or removed.
        </p>
        <Link href="/services" className="btn-primary mt-6">
          Browse Available Services
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-12">
      {/* Breadcrumb nav */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Link href="/" className="transition hover:text-primary">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link href="/services" className="transition hover:text-primary">
          Services
        </Link>
        <span aria-hidden>/</span>
        <span className="max-w-xs truncate font-semibold text-foreground">
          {service.title}
        </span>
      </nav>

      <div className="grid items-start gap-10 lg:grid-cols-12">
        {/* Left column: image, info & description */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <div
            data-aos="fade-up"
            className="relative overflow-hidden rounded-3xl border border-border bg-muted shadow-xs"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.title}
              className="h-80 w-full object-cover sm:h-[420px]"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="absolute top-4 left-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {service.category}
            </span>
            <span
              className={`absolute top-4 right-4 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                service.serviceMode === 'Home Visit'
                  ? 'border-emerald-400/40 bg-emerald-950/80 text-emerald-300'
                  : 'border-indigo-400/40 bg-indigo-950/80 text-indigo-300'
              }`}
            >
              {service.serviceMode === 'Home Visit' ? 'Home Visit' : 'Shop Drop-off'}
            </span>
          </div>

          <div data-aos="fade-up" data-aos-delay="60">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {service.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-primary" />
                Service Area:{' '}
                <strong className="font-semibold text-foreground">
                  {service.serviceArea}
                </strong>
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                Duration:{' '}
                <strong className="font-semibold text-foreground">
                  {service.estimatedDuration}
                </strong>
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheckIcon className="h-4 w-4" />
                30-Day Warranty Included
              </span>
            </div>
          </div>

          <div
            data-aos="fade-up"
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-xs sm:p-7"
          >
            <h2 className="text-base font-bold text-foreground">
              What This Repair Service Includes
            </h2>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {service.description}
            </p>
          </div>

          <div
            data-aos="fade-up"
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-xs sm:p-7"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md">
                {service.technicianImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.technicianImage}
                    alt={`${service.technicianName} profile`}
                    className="size-full rounded-2xl object-cover"
                  />
                ) : (
                  service.technicianName?.charAt(0) || 'T'
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    {service.technicianName}
                  </h3>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                    Verified Technician
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {service.technicianEmail}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Specialized in {service.category} repairs
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Area: {service.technicianArea || 'Not provided'}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.technicianBio || 'No technician bio available.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3" data-aos="fade-up">
            {[
              { icon: ShieldCheckIcon, title: 'Vetted experts', sub: 'ID verified' },
              { icon: ClockIcon, title: 'On-time visits', sub: 'Tracked live' },
              { icon: CheckCircleIcon, title: 'Pay when done', sub: 'Stripe secure' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xs transition duration-300 hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sticky booking box */}
        <div className="sticky top-20 lg:col-span-4">
          <div
            data-aos="fade-left"
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-lg shadow-slate-200/50 sm:p-7 dark:shadow-black/20"
          >
            <div className="border-b border-border/60 pb-5">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Starting Base Price
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-foreground">
                  ${service.basePrice}
                </span>
                <span className="text-xs text-muted-foreground">USD</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Final amount confirmed by technician upon job inspection.
              </p>
            </div>

            <ul className="mt-5 space-y-3 text-xs text-muted-foreground">
              <li className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  Estimated Time:
                </span>
                <span className="font-semibold text-foreground">
                  {service.estimatedDuration}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <WrenchIcon className="h-4 w-4" />
                  Service Mode:
                </span>
                <span className="font-semibold text-foreground">
                  {service.serviceMode}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Coverage Area:
                </span>
                <span className="font-semibold text-foreground">{service.serviceArea}</span>
              </li>
            </ul>

            <div className="mt-5 rounded-2xl border border-emerald-200/70 bg-emerald-50 p-3.5 text-xs leading-relaxed text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
              <p className="flex items-center gap-1.5 font-bold">
                <ShieldCheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Pay After Service Guarantee
              </p>
              <p className="mt-1 text-[11px]">
                You pay zero today. After the repair is completed, test your device and
                pay via Stripe test card.
              </p>
            </div>

            <button
              onClick={onRequestClick}
              disabled={checkingAuth}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary/90 hover:shadow-lg active:translate-y-px disabled:opacity-60"
            >
              {checkingAuth ? 'Checking session...' : 'Request Repair Service'}
              <ArrowRightIcon className="h-4 w-4" />
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <CheckIcon className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              No card details required to request
            </p>
          </div>
        </div>
      </div>

      {showForm && <RequestFormModal service={service} onClose={() => setShowForm(false)} />}
    </div>
  );
}
