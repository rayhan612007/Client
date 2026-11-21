'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Service, CATEGORIES } from '@/lib/auth-shared';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { AOSProvider } from '@/components/AOSProvider';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { SearchIcon, WrenchIcon, ArrowRightIcon, CheckIcon } from '@/components/Icons';

const PAGE_SIZE = 8;

type ServicePage = {
  data: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
};

function pageList(current: number, total: number): (number | 'dots')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const visible = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => visible.add(n));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => visible.add(n));

  const sorted = [...visible].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const result: (number | 'dots')[] = [];
  sorted.forEach((n, index) => {
    if (index > 0 && n - sorted[index - 1] > 1) result.push('dots');
    result.push(n);
  });
  return result;
}

function ServicesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<ServicePage['pagination'] | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const category = searchParams.get('category') ?? '';
  const serviceMode = searchParams.get('serviceMode') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const pageParam = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const page = Number.isSafeInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      const params = new URLSearchParams();
      const q = searchParams.get('search');
      if (q) params.set('search', q);
      if (category) params.set('category', category);
      if (serviceMode) params.set('serviceMode', serviceMode);
      if (sort && sort !== 'newest') params.set('sort', sort);
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));

      try {
        const res = await api<ServicePage>(`/api/services?${params.toString()}`);
        if (!active) return;
        setServices(res.data);
        setPagination(res.pagination);
        if (res.pagination.page !== page) {
          const corrected = new URLSearchParams(searchParams.toString());
          corrected.set('page', String(res.pagination.page));
          router.replace(`/services?${corrected.toString()}`);
        }
      } catch {
        if (active) {
          setServices([]);
          setPagination(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [searchParams, category, serviceMode, sort, page, router]);

  // filters persist in the URL → survive reload (server-side filtering)
  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    const query = params.toString();
    router.push(query ? `/services?${query}` : '/services');
  }

  function goToPage(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (next > 1) params.set('page', String(next));
    else params.delete('page');
    const query = params.toString();
    router.push(query ? `/services?${query}` : '/services');
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam('search', search.trim());
  }

  function clearAllFilters() {
    setSearch('');
    router.push('/services');
  }

  const hasFilters = Boolean(search || category || serviceMode || (sort && sort !== 'newest'));
  const total = pagination?.total ?? services.length;
  const first = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const last = pagination ? first + services.length - 1 : services.length;

  return (
    <div className="container-page py-12 sm:py-16">
      {/* Page title + live counter */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Verified Repair Marketplace"
          icon={WrenchIcon}
          title="Browse All Services"
          description="Discover verified repair specialists across Dhaka. Every search, filter and sort runs live on the server — with zero upfront deposit."
          className="flex-1"
        />
        {!loading && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {total} {total === 1 ? 'service' : 'services'} available
          </div>
        )}
      </div>

      {/* Server-side search, filter & sort toolbar */}
      <div className="panel mt-8 p-4 sm:p-5" data-aos="fade-up">
        <form onSubmit={onSearch} className="grid items-center gap-3 sm:grid-cols-2 lg:grid-cols-12">
          <div className="relative sm:col-span-2 lg:col-span-4">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category..."
              aria-label="Search services"
              className="w-full rounded-xl border border-input bg-muted/40 py-2.5 pr-3 pl-10 text-sm text-foreground transition placeholder:text-muted-foreground focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/20 focus:outline-none"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={category}
              onChange={(e) => setParam('category', e.target.value)}
              aria-label="Filter by category"
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm text-foreground transition focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={serviceMode}
              onChange={(e) => setParam('serviceMode', e.target.value)}
              aria-label="Filter by service mode"
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm text-foreground transition focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              <option value="">Any Service Mode</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={sort}
              onChange={(e) =>
                setParam('sort', e.target.value === 'newest' ? '' : e.target.value)
              }
              aria-label="Sort services"
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm text-foreground transition focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/20 focus:outline-none"
            >
              <option value="">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </form>

        {hasFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 text-xs">
            <span className="font-semibold text-muted-foreground">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                Search: &ldquo;{search}&rdquo;
                <button
                  type="button"
                  aria-label="Clear search filter"
                  onClick={() => {
                    setSearch('');
                    setParam('search', '');
                  }}
                  className="transition hover:text-primary/70"
                >
                  ×
                </button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                Category: {category}
                <button
                  type="button"
                  aria-label="Clear category filter"
                  onClick={() => setParam('category', '')}
                  className="transition hover:text-primary/70"
                >
                  ×
                </button>
              </span>
            )}
            {serviceMode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-1 font-medium text-indigo-600 dark:text-indigo-400">
                Mode: {serviceMode}
                <button
                  type="button"
                  aria-label="Clear service mode filter"
                  onClick={() => setParam('serviceMode', '')}
                  className="transition hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
            {sort && sort !== 'newest' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-medium text-foreground/80">
                Sort: {sort === 'price-asc' ? 'Price Low-High' : 'Price High-Low'}
                <button
                  type="button"
                  aria-label="Clear sort"
                  onClick={() => setParam('sort', '')}
                  className="transition hover:opacity-70"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="ml-1 font-semibold text-rose-600 transition hover:underline dark:text-rose-400"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Services grid / loading / empty */}
      {loading ? (
        <LoadingSpinner />
      ) : services.length === 0 ? (
        <div
          data-aos="fade-up"
          className="mt-12 rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-xs"
        >
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <SearchIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">No Services Found</h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            We couldn&apos;t find any approved services matching your active filters. Try
            broadening your search or resetting category filters.
          </p>
          <button onClick={clearAllFilters} className="btn-primary mt-6">
            Reset All Filters
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s, index) => (
            <ServiceCard key={s._id} service={s} delay={(index % 4) * 60} />
          ))}
        </div>
      )}

      {!loading && services.length > 0 && (
        <>
          <p className="mt-10 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CheckIcon className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            All listings are admin-approved, ID-verified and covered by a 30-day warranty
          </p>

          {pagination && pagination.total > 0 && (
            <div className="mt-6 flex flex-col items-center gap-4 border-t border-border/60 pt-6 sm:flex-row sm:justify-between">
              <p
                aria-live="polite"
                className="text-center text-xs font-medium text-muted-foreground sm:text-left"
              >
                Showing{' '}
                <span className="font-bold text-foreground">
                  {first}&ndash;{last}
                </span>{' '}
                of <span className="font-bold text-foreground">{pagination.total}</span> services
                <span className="ml-1.5 hidden text-muted-foreground/70 lg:inline">
                  &middot; {PAGE_SIZE} per page
                </span>
              </p>

              {pagination.totalPages > 1 && (
                <nav aria-label="Services pagination" className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!pagination.hasPrev}
                    onClick={() => goToPage(pagination.page - 1)}
                    aria-label="Previous page"
                    className="h-9 gap-1 rounded-xl px-2.5 text-xs font-semibold sm:px-3.5"
                  >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {pageList(pagination.page, pagination.totalPages).map((item, index) =>
                      item === 'dots' ? (
                        <span
                          key={`dots-${index}`}
                          aria-hidden="true"
                          className="flex size-9 items-center justify-center text-xs text-muted-foreground"
                        >
                          &hellip;
                        </span>
                      ) : (
                        <Button
                          key={item}
                          type="button"
                          variant={item === pagination.page ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => goToPage(item)}
                          aria-label={`Page ${item}`}
                          aria-current={item === pagination.page ? 'page' : undefined}
                          className={`size-9 rounded-xl text-xs font-semibold ${
                            item === pagination.page
                              ? 'shadow-md shadow-primary/20'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {item}
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={!pagination.hasNext}
                    onClick={() => goToPage(pagination.page + 1)}
                    aria-label="Next page"
                    className="h-9 gap-1 rounded-xl px-2.5 text-xs font-semibold sm:px-3.5"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="size-4" />
                  </Button>
                </nav>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <AOSProvider />
      <Suspense
        fallback={<LoadingSpinner />}
      >
        <ServicesList />
      </Suspense>
    </>
  );
}
