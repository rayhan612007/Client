'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Service, CATEGORIES } from '@/lib/auth-shared';

const STEPS = [
  { icon: '🔍', title: 'Find a Service', text: 'Browse verified technicians by device and category.' },
  { icon: '📨', title: 'Send a Request', text: 'Describe the problem and pick a preferred date.' },
  { icon: '🔧', title: 'Technician Fixes It', text: 'Track the job step by step until it is completed.' },
  { icon: '💳', title: 'Pay After Completion', text: 'Only pay online once the work is delivered.' },
];

const TRUST = [
  { value: '100%', label: 'Verified Technicians' },
  { value: 'Step-by-step', label: 'Job Tracking' },
  { value: 'After Service', label: 'Payment Only' },
  { value: '7', label: 'Repair Categories' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ data: Service[] }>('/api/services')
      .then((res) => setFeatured(res.data.slice(0, 6)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center">
          <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
            Broken Device? Get It Fixed by Verified Technicians
          </h1>
          <p className="max-w-2xl text-blue-100">
            Smartphone, laptop, AC, refrigerator, TV or washing machine — book a repair, track every
            step, and pay only after the job is done.
          </p>
          <Link
            href="/services"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow hover:bg-blue-50"
          >
            Browse Services
          </Link>
        </div>
      </section>

      {/* Featured services */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured Services</h2>
            <p className="text-gray-500">The 6 latest approved services on FixMate</p>
          </div>
          <Link href="/services" className="text-sm font-semibold text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-8 text-center text-gray-500">
            No services yet. Technicians are joining — check back soon!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <Link
                key={s._id}
                href={`/services/${s._id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title} className="h-44 w-full object-cover" />
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{s.category}</span>
                  <h3 className="mt-1 font-semibold group-hover:text-blue-600">{s.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {s.serviceMode} · {s.technicianName}
                  </p>
                  <p className="mt-auto pt-3 font-bold text-gray-900">Starting at ${s.basePrice}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">How FixMate Works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <p className="text-4xl" aria-hidden>{s.icon}</p>
                <h3 className="mt-3 font-semibold">
                  {i + 1}. {s.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories + trust */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-center text-3xl font-bold">Popular Categories</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/services?category=${encodeURIComponent(c)}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 p-4 text-center text-sm font-medium hover:border-blue-400 hover:text-blue-600"
            >
              <span aria-hidden>{c === 'Smartphone' ? '📱' : c === 'Laptop & PC' ? '💻' : c === 'AC' ? '❄️' : c === 'Refrigerator' ? '🧊' : c === 'TV' ? '📺' : c === 'Washing Machine' ? '🌀' : '⚡'}</span>
              {c}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-3xl bg-blue-600 p-8 text-white sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.label} className="text-center">
              <p className="text-3xl font-bold">{t.value}</p>
              <p className="text-sm text-blue-100">{t.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
