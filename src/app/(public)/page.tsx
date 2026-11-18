'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Service, CATEGORIES } from '@/lib/auth-shared';
import {
  WrenchIcon,
  SparklesIcon,
  SearchIcon,
  ShieldCheckIcon,
  ClockIcon,
  DollarSignIcon,
  AwardIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  MapPinIcon,
  ChevronDownIcon,
  UserCheckIcon,
  HeadphonesIcon,
  HelpCircleIcon,
  CheckIcon,
  SmartphoneIcon,
  LaptopIcon,
  SnowflakeIcon,
  RefrigeratorIcon,
  TvIcon,
  WashingMachineIcon,
  ZapIcon,
} from '@/components/Icons';

/* Category metadata with icons, tags and typical starting price */
const CATEGORY_META = [
  {
    name: 'Smartphone',
    icon: SmartphoneIcon,
    color: 'from-blue-500 to-cyan-500',
    lightColor: 'bg-blue-50 text-blue-600',
    price: '$25',
    desc: 'Screen, Battery, Camera & Logic Board',
  },
  {
    name: 'Laptop & PC',
    icon: LaptopIcon,
    color: 'from-indigo-500 to-purple-500',
    lightColor: 'bg-indigo-50 text-indigo-600',
    price: '$35',
    desc: 'Keyboard, RAM/SSD, OS & Motherboard',
  },
  {
    name: 'AC',
    icon: SnowflakeIcon,
    color: 'from-sky-500 to-blue-600',
    lightColor: 'bg-sky-50 text-sky-600',
    price: '$30',
    desc: 'Gas Refill, Master Clean & Compressor',
  },
  {
    name: 'Refrigerator',
    icon: RefrigeratorIcon,
    color: 'from-cyan-500 to-teal-500',
    lightColor: 'bg-cyan-50 text-cyan-600',
    price: '$40',
    desc: 'Cooling Fix, Gas Charge & Thermostat',
  },
  {
    name: 'TV',
    icon: TvIcon,
    color: 'from-violet-500 to-pink-500',
    lightColor: 'bg-violet-50 text-violet-600',
    price: '$30',
    desc: 'Display Panel, Backlight & Sound Card',
  },
  {
    name: 'Washing Machine',
    icon: WashingMachineIcon,
    color: 'from-blue-600 to-indigo-600',
    lightColor: 'bg-blue-50 text-blue-600',
    price: '$35',
    desc: 'Drum Repair, Motor, Belt & Drainage',
  },
  {
    name: 'Electrical',
    icon: ZapIcon,
    color: 'from-amber-500 to-orange-500',
    lightColor: 'bg-amber-50 text-amber-600',
    price: '$20',
    desc: 'Short Circuit, DB Box & Wiring Inspection',
  },
];

/* Supported Brand Badges */
const BRANDS = [
  { name: 'Apple', tag: 'iPhone & Mac' },
  { name: 'Samsung', tag: 'Galaxy & Home' },
  { name: 'Sony', tag: 'TV & Audio' },
  { name: 'LG', tag: 'AC & Appliances' },
  { name: 'Dell', tag: 'Laptops & PCs' },
  { name: 'HP', tag: 'Notebooks' },
  { name: 'Whirlpool', tag: 'Refrigerators' },
  { name: 'Asus', tag: 'ROG & ZenBook' },
  { name: 'Lenovo', tag: 'ThinkPad' },
  { name: 'Gree', tag: 'AC Specialist' },
];

/* 4-Step Process */
const STEPS = [
  {
    step: '01',
    title: 'Find a Service',
    description: 'Browse verified technicians, upfront pricing, and real customer reviews across 7 categories.',
    tag: 'Upfront Quotes',
  },
  {
    step: '02',
    title: 'Send a Request',
    description: 'Describe the issue and pick your preferred date & time. Zero deposit or advance payment needed.',
    tag: 'No Advance Fee',
  },
  {
    step: '03',
    title: 'Technician Fixes It',
    description: 'Track your repair status live: Requested → Accepted → In Progress → Completed.',
    tag: 'Live Step Tracker',
  },
  {
    step: '04',
    title: 'Pay After Completion',
    description: 'Inspect and test your repaired device. Pay online securely via Stripe only when 100% satisfied.',
    tag: 'Stripe Escrow Safe',
  },
];

/* Diagnostic Issues Helper */
const DIAGNOSTIC_ISSUES = [
  {
    id: 'phone-screen',
    category: 'Smartphone',
    label: 'Cracked Phone Screen',
    symptom: 'Touch unresponsive, lines or ink bleed on display',
    recommendation: 'Full OEM OLED/LCD glass assembly replacement',
    time: '45 - 60 mins',
    price: 'Starting at $30',
  },
  {
    id: 'laptop-power',
    category: 'Laptop & PC',
    label: 'Laptop Won’t Turn On',
    symptom: 'Dead power, blinking LED, no fan spin or charging light',
    recommendation: 'DC-in jack check, charging IC or motherboard repair',
    time: '2 - 4 hours',
    price: 'Starting at $35',
  },
  {
    id: 'ac-cooling',
    category: 'AC',
    label: 'AC Not Cooling / Warm Air',
    symptom: 'Blower running but room stays warm, ice on copper pipes',
    recommendation: 'Refrigerant leak detection & R32/R410 gas refill',
    time: '1 - 2 hours',
    price: 'Starting at $35',
  },
  {
    id: 'fridge-frost',
    category: 'Refrigerator',
    label: 'Fridge Defrost / Overheating',
    symptom: 'Freezer cool but lower section warm, clicking compressor sound',
    recommendation: 'Defrost timer, bi-metal thermostat or relay replacement',
    time: '2 - 3 hours',
    price: 'Starting at $40',
  },
  {
    id: 'washing-spin',
    category: 'Washing Machine',
    label: 'Washing Machine Won’t Spin',
    symptom: 'Fills water but drum won’t spin, loud vibrating motor noise',
    recommendation: 'Drive belt replacement, capacitor or motor clutch repair',
    time: '1 - 2 hours',
    price: 'Starting at $35',
  },
];

/* Why Choose FixMate */
const TRUST_POINTS = [
  {
    icon: ShieldCheckIcon,
    title: '100% Pay-After-Service',
    description: 'Your money stays safe. Pay online with Stripe test card only after the technician finishes the job and you inspect it.',
    badge: 'Zero Risk',
  },
  {
    icon: UserCheckIcon,
    title: 'Verified & Vetted Specialists',
    description: 'Every technician undergoes government ID verification, background checks, and technical skill scrutiny before approval.',
    badge: '100% Verified',
  },
  {
    icon: AwardIcon,
    title: '30-Day Service Warranty',
    description: 'All repairs come with a complimentary 30-day warranty on workmanship and installed spare parts.',
    badge: 'Warranty Backed',
  },
  {
    icon: DollarSignIcon,
    title: 'Transparent Starting Prices',
    description: 'Clear base prices upfront with no hidden surcharge. The agreed quote upon completion is what you pay.',
    badge: 'No Surprises',
  },
  {
    icon: ClockIcon,
    title: 'Home Visit & Drop-Off Options',
    description: 'Choose convenient on-site doorstep visits for heavy appliances or secure shop drop-offs for precision micro-soldering.',
    badge: 'Flexible Modes',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Customer Care',
    description: 'Prompt support via phone and email to guide your booking, resolve concerns, and ensure smooth delivery.',
    badge: '24/7 Assistance',
  },
];

/* Frequently Asked Questions */
const FAQS = [
  {
    q: 'How does the Pay-After-Service model work?',
    a: 'When you submit a repair request, you pay $0 upfront. The technician accepts, works on your device, and only sets the final amount once the work is completed. A "Pay Now" button then appears on your bookings dashboard so you can pay securely via Stripe after testing your device.',
  },
  {
    q: 'How are technicians verified on FixMate?',
    a: 'Every technician must submit their national ID/passport, trade certification, workshop address, and phone number. FixMate admins manually inspect and approve service listings before they appear on the public marketplace.',
  },
  {
    q: 'Can I cancel my repair request if plans change?',
    a: 'Yes! You can cancel any repair request at any time while its status is still "Requested". Once a technician has accepted and begun work, you can coordinate with them directly via their contact info.',
  },
  {
    q: 'What is the difference between Home Visit and Shop Drop-off?',
    a: 'Home Visit means the technician visits your home or office with portable tools (ideal for AC, TV, Refrigerator, and Washing Machines). Shop Drop-off allows you to deliver your device directly to the technician’s verified service center.',
  },
  {
    q: 'Are replacement parts covered by a warranty?',
    a: 'Yes. All completed repair services booked through FixMate carry a standard 30-day service warranty covering both technician workmanship and replaced hardware components.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMode, setSelectedMode] = useState('');

  // Diagnostic Widget State
  const [activeIssue, setActiveIssue] = useState(DIAGNOSTIC_ISSUES[0]);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    api<{ data: Service[] }>('/api/services')
      .then((res) => setFeatured((res.data ?? []).slice(0, 6)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedMode) params.set('serviceMode', selectedMode);
    router.push(`/services?${params.toString()}`);
  }

  return (
    <div className="bg-slate-50/50 text-slate-900">
      {/* =========================================================================
          SECTION 1: HERO SECTION WITH INTERACTIVE SEARCH & TRUST PANEL
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#070c1a] text-white">
        {/* Backdrop: grid, glows, top highlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 75% 65% at 50% 25%, black 20%, transparent 78%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 75% 65% at 50% 25%, black 20%, transparent 78%)',
          }}
        />
        <div className="pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/4 -right-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:py-28">
          <div>
            {/* Hero content */}
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Verified technicians across 7 repair categories
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
                Broken device?
                <span className="mt-2 block bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  Fixed by verified experts.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                Book trusted local technicians for phones, laptops, ACs, fridges, TVs and
                washing machines. Track every milestone and{' '}
                <strong className="font-semibold text-slate-200">
                  pay only after the repair is complete
                </strong>
                .
              </p>

              {/* Search card */}
              <form
                onSubmit={handleSearchSubmit}
                className="mt-8 rounded-2xl bg-white p-2.5 shadow-2xl shadow-blue-950/40 ring-1 ring-white/20"
              >
                <div className="grid gap-2 sm:grid-cols-12">
                  <div className="relative sm:col-span-4">
                    <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search e.g. iPhone screen"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search services"
                      className="h-11 w-full rounded-xl border border-transparent bg-slate-100 pr-3 pl-10 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      aria-label="Filter by category"
                      className="h-11 w-full rounded-xl border border-transparent bg-slate-100 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">All categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value)}
                      aria-label="Filter by service mode"
                      className="h-11 w-full rounded-xl border border-transparent bg-slate-100 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Any mode</option>
                      <option value="Home Visit">Home Visit</option>
                      <option value="Shop Drop-off">Shop Drop-off</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-white"
                    >
                      <span>Search</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Trending searches */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-500">Trending:</span>
                {[
                  { label: 'iPhone Screen', cat: 'Smartphone' },
                  { label: 'MacBook Motherboard', cat: 'Laptop & PC' },
                  { label: 'AC Master Clean', cat: 'AC' },
                  { label: 'Fridge Gas', cat: 'Refrigerator' },
                  { label: 'TV Backlight', cat: 'TV' },
                ].map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag.label);
                      setSelectedCategory(tag.cat);
                      router.push(
                        `/services?category=${encodeURIComponent(tag.cat)}&search=${encodeURIComponent(tag.label)}`,
                      );
                    }}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-slate-300 transition hover:border-blue-400/40 hover:bg-white/10 hover:text-white"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              {/* Trust notes */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-400" />
                  ID-verified technicians
                </span>
                <span className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-400" />
                  No upfront payment
                </span>
                <span className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-emerald-400" />
                  30-day warranty
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: BRAND & APPLIANCE COVERAGE STRIP
         ========================================================================= */}
      <section className="border-y border-slate-200/80 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold tracking-wider uppercase text-slate-400">
            Certified Repair Specialists for All Major Global Brands
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {BRANDS.map((b) => (
              <div
                key={b.name}
                className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50/60 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-blue-400 hover:text-blue-600 transition"
              >
                <span>{b.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({b.tag})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: POPULAR CATEGORIES (ALL 7 SPEC CATEGORIES)
         ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <WrenchIcon className="h-3.5 w-3.5" />
              <span>Explore Categories</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Popular Repair Categories
            </h2>
            <p className="mt-2 text-slate-500 max-w-xl">
              Select your appliance or device to view verified technicians, upfront base pricing, and home visit options.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            <span>All Services</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORY_META.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div>
                  {/* Category Radiant Icon */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${cat.color} text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-800">Starting from {cat.price}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition">
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Bonus "Can't Find Yours?" Card */}
          <Link
            href="/services"
            className="flex flex-col justify-between rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 hover:border-blue-400 hover:bg-blue-50/40 transition"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-600">
                <HelpCircleIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Need Custom Service?</h3>
              <p className="mt-1 text-xs text-slate-500">
                Browse our full directory or request a custom diagnosis from our verified technician network.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600">
              <span>View All Services Directory</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: DYNAMIC FEATURED SERVICES (6 APPROVED SERVICES)
         ========================================================================= */}
      <section className="bg-white py-16 sm:py-20 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <SparklesIcon className="h-3.5 w-3.5" />
                <span>Verified & Approved Listings</span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Featured Repair Services
              </h2>
              <p className="mt-2 text-slate-500 max-w-xl">
                Handpicked top-rated repair services from certified technicians with verified customer reviews.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-xs hover:border-blue-400 hover:text-blue-600 transition"
            >
              <span>Explore All Services</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-3xl bg-slate-100" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-slate-900">No services available yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Approved services will appear here as technicians join the platform.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((s) => (
                <Link
                  key={s._id}
                  href={`/services/${s._id}`}
                  className="group flex flex-col h-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                >
                  {/* Service Banner Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={s.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        {s.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ${
                          s.serviceMode === 'Home Visit'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {s.serviceMode === 'Home Visit' ? '🏡 Home Visit' : '🏬 Shop Drop-off'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Service Area & Duration */}
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

                    {/* Title */}
                    <h3 className="mt-2.5 line-clamp-1 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {s.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                      {s.description}
                    </p>

                    {/* Technician Info */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                          {s.technicianName?.charAt(0) || 'T'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{s.technicianName}</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Verified Specialist</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                        <StarIcon className="h-3.5 w-3.5 fill-current" />
                        <span>4.9</span>
                      </div>
                    </div>

                    {/* Price & Action Button */}
                    <div className="mt-auto border-t border-slate-100 pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-medium uppercase text-slate-400">Starting at</span>
                        <p className="text-lg font-extrabold text-slate-900">${s.basePrice}</p>
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white group-hover:bg-blue-600 transition">
                        <span>Details</span>
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: HOW FIXMATE WORKS (4-STEP VISUAL WORKFLOW)
         ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <ClockIcon className="h-3.5 w-3.5" />
            <span>Simple & Trackable Flow</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            How FixMate Works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            A transparent 4-stage journey engineered to eliminate guesswork, eliminate advance fees, and give you complete control.
          </p>
        </div>

        {/* 4-Step Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:border-blue-400 hover:shadow-lg transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-blue-600 tracking-tight">{s.step}</span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                    {s.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{s.description}</p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-blue-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Verified Step</span>
              </div>
            </div>
          ))}
        </div>

        {/* Escrow Banner Note */}
        <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-center text-xs text-emerald-800 font-medium">
          🛡️ <strong>FixMate Promise:</strong> You never hand over payment until the technician completes the repair and you verify your device works properly.
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: INTERACTIVE ISSUE DIAGNOSTIC FINDER ("WHAT'S WRONG?")
         ========================================================================= */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md">
              <SparklesIcon className="h-3.5 w-3.5" />
              <span>Instant Problem Diagnostic</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              What Is Wrong With Your Device?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-400 text-sm">
              Click common symptoms below for an instant preliminary diagnosis, estimated turnaround time, and matching technician bookings.
            </p>
          </div>

          {/* Interactive Picker */}
          <div className="mt-10 grid gap-6 lg:grid-cols-12 items-start">
            {/* Left Button Pills */}
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              {DIAGNOSTIC_ISSUES.map((issue) => {
                const active = activeIssue.id === issue.id;
                return (
                  <button
                    key={issue.id}
                    onClick={() => setActiveIssue(issue)}
                    className={`flex items-center justify-between rounded-2xl p-4 text-left transition-all ${
                      active
                        ? 'border border-blue-400/50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                        : 'border border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                        {issue.category}
                      </span>
                      <p className="text-sm font-bold text-white">{issue.label}</p>
                    </div>
                    <span className="text-xs font-semibold opacity-80">Check →</span>
                  </button>
                );
              })}
            </div>

            {/* Right Diagnostic Result Card */}
            <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-slate-950/90 p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Category: {activeIssue.category}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-white">{activeIssue.label}</h3>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  {activeIssue.price}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Symptom Analysis:
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{activeIssue.symptom}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Recommended Fix:
                  </p>
                  <p className="mt-1 text-sm text-emerald-300 font-medium">
                    {activeIssue.recommendation}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400">Typical Repair Time</span>
                    <p className="text-sm font-bold text-white">{activeIssue.time}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400">Warranty Included</span>
                    <p className="text-sm font-bold text-emerald-400">30-Day Guarantee</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/services?category=${encodeURIComponent(activeIssue.category)}`}
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition"
                >
                  Find {activeIssue.category} Specialists
                </Link>
                <Link
                  href="/services"
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
                >
                  Browse All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WHY CHOOSE FIXMATE (6 CORE TRUST & QUALITY PILLARS)
         ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            <span>Built On Complete Trust</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Why FixMate is the Smart Choice
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            We solved the traditional problems of hidden fees, missing device parts, and poor workmanship through strict platform rules.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_POINTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:border-blue-400 hover:shadow-lg transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.description}</p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckIcon className="h-3.5 w-3.5" />
                  <span>Guaranteed Feature</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FREQUENTLY ASKED QUESTIONS (ACCORDION)
         ========================================================================= */}
      <section className="bg-white py-16 sm:py-20 border-t border-slate-200/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <HelpCircleIcon className="h-3.5 w-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2 text-slate-500 text-sm">
              Everything you need to know about booking, payment safety, and technician warranties.
            </p>
          </div>

          <div className="mt-10 space-y-3.5">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/50 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:text-blue-600 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-600 border-t border-slate-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: DUAL MARKETPLACE CTA (BECOME A TECHNICIAN PARTNER)
         ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]" />

          <div className="relative grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
                Technician Partnership Program
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Are You a Skilled Repair Professional?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Join FixMate to get high-paying customer repair requests in your local area. Enjoy zero listing fees, secure automated Stripe payouts, and complete control over your working schedule.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                  Daily Local Requests
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                  Direct Stripe Bank Payouts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                  No Upfront Listing Fee
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
              >
                <span>Register as Technician</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: FINAL CONVERSION BANNER (READY TO REPAIR?)
         ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
            Ready to Get Your Device Restored Today?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100 text-sm sm:text-base leading-relaxed">
            Browse our catalog of verified technicians across Dhaka and beyond. Remember: zero advance fees and you only pay after complete satisfaction.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/services"
              className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-700 shadow-xl hover:bg-blue-50 transition"
            >
              Browse All Services Now
            </Link>
            <Link
              href="/sign-up"
              className="w-full sm:w-auto rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
