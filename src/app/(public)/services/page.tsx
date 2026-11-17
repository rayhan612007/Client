'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Service, CATEGORIES } from '@/lib/auth-shared';

function ServicesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const category = searchParams.get('category') ?? '';
  const serviceMode = searchParams.get('serviceMode') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';

  const fetchServices = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    const q = searchParams.get('search');
    if (q) params.set('search', q);
    if (category) params.set('category', category);
    if (serviceMode) params.set('serviceMode', serviceMode);
    if (sort && sort !== 'newest') params.set('sort', sort);
    api<{ data: Service[] }>(`/api/services?${params.toString()}`)
      .then((res) => setServices(res.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [searchParams, category, serviceMode, sort]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // filters persist in the URL → survive reload (server-side filtering)
  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/services?${params.toString()}`);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam('search', search.trim());
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Browse Services</h1>
      <p className="text-gray-500">All approved services, search and filtering handled by the server</p>

      {/* search / filter / sort bar */}
      <form onSubmit={onSearch} className="mt-6 grid gap-3 rounded-2xl border border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or category…"
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setParam('category', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={serviceMode}
          onChange={(e) => setParam('serviceMode', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">Any service mode</option>
          <option value="Home Visit">Home Visit</option>
          <option value="Shop Drop-off">Shop Drop-off</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setParam('sort', e.target.value === 'newest' ? '' : e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </form>

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-gray-50 p-12 text-center">
          <p className="text-5xl" aria-hidden>🔍</p>
          <p className="mt-3 font-semibold">No services found</p>
          <p className="mt-1 text-sm text-gray-500">Try a different search or filter.</p>
          <Link href="/services" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s) => (
            <Link
              key={s._id}
              href={`/services/${s._id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt={s.title} className="h-40 w-full object-cover" />
              <div className="flex flex-1 flex-col p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">{s.category}</span>
                <h3 className="mt-1 line-clamp-2 font-semibold group-hover:text-blue-600">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{s.serviceMode}</p>
                <p className="text-sm text-gray-500">📍 {s.serviceArea}</p>
                <p className="text-sm text-gray-500">by {s.technicianName}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="font-bold">${s.basePrice}</span>
                  <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10" />}>
      <ServicesList />
    </Suspense>
  );
}
