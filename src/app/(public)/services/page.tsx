'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Service, CATEGORIES } from '@/lib/auth-shared';
import {
  SearchIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  WrenchIcon,
} from '@/components/Icons';

function ServicesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const category = searchParams.get('category') ?? '';
  const serviceMode = searchParams.get('serviceMode') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    const q = searchParams.get('search');
    if (q) params.set('search', q);
    if (category) params.set('category', category);
    if (serviceMode) params.set('serviceMode', serviceMode);
    if (sort && sort !== 'newest') params.set('sort', sort);

    api<{ data: Service[] }>(`/api/services?${params.toString()}`)
      .then((res) => {
        if (active) setServices(res.data);
      })
      .catch(() => {
        if (active) setServices([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [searchParams, category, serviceMode, sort]);

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

  function clearAllFilters() {
    setSearch('');
    router.push('/services');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <WrenchIcon className="h-3.5 w-3.5" />
            <span>Verified Repair Marketplace</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Browse All Services
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Discover verified repair specialists across Dhaka. All searching, filtering and sorting are handled live on the server with zero upfront deposit.
          </p>
        </div>

        {/* Counter Badge */}
        {!loading && (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs self-start md:self-auto">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span>{services.length} {services.length === 1 ? 'service' : 'services'} available</span>
          </div>
        )}
      </div>

      {/* Server-Side Search, Filter & Sort Toolbar (Challenge 1) */}
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <form onSubmit={onSearch} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 items-center">
          {/* Keyword Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-4">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category..."
              className="w-full rounded-xl border border-input bg-muted/40 py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={category}
              onChange={(e) => setParam('category', e.target.value)}
              className="w-full rounded-xl border border-input bg-muted/40 py-2.5 px-3 text-sm text-foreground focus:border-ring focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Service Mode Filter */}
          <div className="lg:col-span-3">
            <select
              value={serviceMode}
              onChange={(e) => setParam('serviceMode', e.target.value)}
              className="w-full rounded-xl border border-input bg-muted/40 py-2.5 px-3 text-sm text-foreground focus:border-ring focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
            >
              <option value="">Any Service Mode</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>
          </div>

          {/* Sort By Price / Newest */}
          <div className="lg:col-span-2">
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value === 'newest' ? '' : e.target.value)}
              className="w-full rounded-xl border border-input bg-muted/40 py-2.5 px-3 text-sm text-foreground focus:border-ring focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/20 transition"
            >
              <option value="">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </form>

        {/* Active Filter Tags */}
        {(category || serviceMode || search || (sort && sort !== 'newest')) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs">
            <span className="font-semibold text-slate-500">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-blue-700">
                Search: &ldquo;{search}&rdquo;
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setParam('search', '');
                  }}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-blue-700">
                Category: {category}
                <button type="button" onClick={() => setParam('category', '')} className="hover:text-blue-900">
                  ×
                </button>
              </span>
            )}
            {serviceMode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-indigo-700">
                Mode: {serviceMode}
                <button type="button" onClick={() => setParam('serviceMode', '')} className="hover:text-indigo-900">
                  ×
                </button>
              </span>
            )}
            {sort && sort !== 'newest' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-700">
                Sort: {sort === 'price-asc' ? 'Price Low-High' : 'Price High-Low'}
                <button type="button" onClick={() => setParam('sort', '')} className="hover:text-slate-900">
                  ×
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-600 hover:underline ml-1"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Services Grid or Loading / Empty State */}
      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <SearchIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-800">No Services Found</h2>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            We couldn&apos;t find any approved services matching your active filters. Try broadening your search or resetting category filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s) => (
            <Link
              key={s._id}
              href={`/services/${s._id}`}
              className="group flex flex-col h-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              {/* Image banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                    {s.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md ${
                      s.serviceMode === 'Home Visit'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {s.serviceMode === 'Home Visit' ? '🏡 Home' : '🏬 Shop'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 truncate">
                    <MapPinIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {s.serviceArea}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                    {s.estimatedDuration}
                  </span>
                </div>

                <h3 className="mt-2 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {s.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                  {s.description}
                </p>

                {/* Technician metadata */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                      {s.technicianName?.charAt(0) || 'T'}
                    </div>
                    <span className="text-xs font-medium text-slate-700 truncate max-w-[110px]">
                      {s.technicianName}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
                    <StarIcon className="h-3 w-3 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="mt-auto border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400">Starting at</span>
                    <p className="text-base font-extrabold text-slate-900">${s.basePrice}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white group-hover:bg-blue-600 transition">
                    <span>View</span>
                    <ArrowRightIcon className="h-3 w-3" />
                  </span>
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
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16" />}>
      <ServicesList />
    </Suspense>
  );
}
