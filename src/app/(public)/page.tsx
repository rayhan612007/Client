'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Service, CATEGORIES } from '@/lib/auth-shared';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { AOSProvider } from '@/components/AOSProvider';
import {
  WrenchIcon,
  SparklesIcon,
  SearchIcon,
  ShieldCheckIcon,
  ClockIcon,
  DollarSignIcon,
  AwardIcon,
  CheckCircleIcon,
  ArrowRightIcon,
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

const CATEGORY_META = [
  {
    name: 'Smartphone',
    icon: SmartphoneIcon,
    color: 'from-blue-500 to-cyan-500',
    price: '$25',
    desc: 'Screen, battery, camera & logic board',
  },
  {
    name: 'Laptop & PC',
    icon: LaptopIcon,
    color: 'from-indigo-500 to-purple-500',
    price: '$35',
    desc: 'Keyboard, RAM/SSD, OS & motherboard',
  },
  {
    name: 'AC',
    icon: SnowflakeIcon,
    color: 'from-sky-500 to-blue-600',
    price: '$30',
    desc: 'Gas refill, master clean & compressor',
  },
  {
    name: 'Refrigerator',
    icon: RefrigeratorIcon,
    color: 'from-cyan-500 to-teal-500',
    price: '$40',
    desc: 'Cooling fix, gas charge & thermostat',
  },
  {
    name: 'TV',
    icon: TvIcon,
    color: 'from-violet-500 to-pink-500',
    price: '$30',
    desc: 'Display panel, backlight & sound card',
  },
  {
    name: 'Washing Machine',
    icon: WashingMachineIcon,
    color: 'from-blue-600 to-indigo-600',
    price: '$35',
    desc: 'Drum repair, motor, belt & drainage',
  },
  {
    name: 'Electrical',
    icon: ZapIcon,
    color: 'from-amber-500 to-orange-500',
    price: '$20',
    desc: 'Short circuit, DB box & wiring inspection',
  },
];

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

const STEPS = [
  {
    step: '01',
    title: 'Find a Service',
    description:
      'Browse verified technicians with upfront pricing across 7 repair categories.',
    tag: 'Upfront Quotes',
  },
  {
    step: '02',
    title: 'Send a Request',
    description:
      'Describe the issue and pick your preferred date. Zero deposit or advance payment needed.',
    tag: 'No Advance Fee',
  },
  {
    step: '03',
    title: 'Technician Fixes It',
    description:
      'Track every milestone live: Requested → Accepted → In Progress → Completed.',
    tag: 'Live Step Tracker',
  },
  {
    step: '04',
    title: 'Pay After Completion',
    description:
      'Inspect and test your repaired device, then pay securely via Stripe only when satisfied.',
    tag: 'Stripe Secure',
  },
];

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

const TRUST_POINTS = [
  {
    icon: ShieldCheckIcon,
    title: '100% Pay-After-Service',
    description:
      'Your money stays safe. Pay online with Stripe only after the technician finishes and you inspect the job.',
    badge: 'Zero Risk',
    accent: 'bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-400',
  },
  {
    icon: UserCheckIcon,
    title: 'Verified & Vetted Specialists',
    description:
      'Every technician passes ID verification, background checks and a technical skill review before approval.',
    badge: '100% Verified',
    accent: 'bg-indigo-500/10 text-indigo-600 ring-indigo-500/20 dark:text-indigo-400',
  },
  {
    icon: AwardIcon,
    title: '30-Day Service Warranty',
    description:
      'All repairs include a complimentary 30-day warranty on workmanship and installed spare parts.',
    badge: 'Warranty Backed',
    accent: 'bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400',
  },
  {
    icon: DollarSignIcon,
    title: 'Transparent Starting Prices',
    description:
      'Clear base prices upfront with no hidden surcharge — the agreed amount at completion is what you pay.',
    badge: 'No Surprises',
    accent: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400',
  },
  {
    icon: ClockIcon,
    title: 'Home Visit & Drop-Off Options',
    description:
      'Choose on-site doorstep visits for heavy appliances or secure shop drop-offs for precision work.',
    badge: 'Flexible Modes',
    accent: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Customer Care',
    description:
      'Prompt support by phone and email to guide your booking, resolve concerns and ensure smooth delivery.',
    badge: '24/7 Assistance',
    accent: 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400',
  },
];

const FAQS = [
  {
    q: 'How does the Pay-After-Service model work?',
    a: 'When you submit a repair request you pay $0 upfront. The technician accepts the job, works on your device and only sets the final amount once the work is completed. A "Pay Now" button then appears in your bookings dashboard so you can pay securely via Stripe after testing your device.',
  },
  {
    q: 'How are technicians verified on FixMate?',
    a: 'Every technician submits their national ID, trade certification, workshop address and phone number. FixMate admins manually inspect and approve every service listing before it appears on the public marketplace.',
  },
  {
    q: 'Can I cancel my repair request if plans change?',
    a: 'Yes. You can cancel any repair request while its status is still "Requested". Once a technician has accepted and begun work, you can coordinate with them directly through their contact information.',
  },
  {
    q: 'What is the difference between Home Visit and Shop Drop-off?',
    a: 'Home Visit means the technician visits your home or office with portable tools — ideal for AC, TV, refrigerators and washing machines. Shop Drop-off lets you deliver your device directly to the technician’s verified service centre.',
  },
  {
    q: 'Are replacement parts covered by a warranty?',
    a: 'Yes. Every completed repair booked through FixMate carries a standard 30-day service warranty covering both technician workmanship and replaced hardware components.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [activeIssue, setActiveIssue] = useState(DIAGNOSTIC_ISSUES[0]);
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
    <div className="bg-background text-foreground">
      <AOSProvider />
      <section className="relative overflow-hidden bg-[#070c1a] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 30% 20%, black 15%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 70% at 30% 20%, black 15%, transparent 75%)',
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[520px] w-[720px] rounded-full bg-blue-600/25 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-[110px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

        <div className="container-page relative py-16 text-center sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl" data-aos="fade-up">
            <span className="eyebrow-dark">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Verified technicians across 7 repair categories
            </span>

            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.06]">
              Broken device?
              <span className="mt-2 block bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                Fixed by verified experts.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Book trusted local technicians for phones, laptops, ACs, fridges, TVs and
              washing machines. Track every milestone and{' '}
              <strong className="font-semibold text-white">
                pay only after the repair is complete
              </strong>
              .
            </p>

            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto mt-9 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-blue-950/40 backdrop-blur-xl"
            >
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_auto] lg:items-center">
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search e.g. iPhone screen replacement"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search services"
                    className="hero-field pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter by category"
                  className="hero-field [&>option]:bg-slate-900 [&>option]:text-slate-100"
                >
                  <option value="">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  aria-label="Filter by service mode"
                  className="hero-field [&>option]:bg-slate-900 [&>option]:text-slate-100"
                >
                  <option value="">Any mode</option>
                  <option value="Home Visit">Home Visit</option>
                  <option value="Shop Drop-off">Shop Drop-off</option>
                </select>
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 text-sm font-semibold whitespace-nowrap text-white shadow-lg shadow-blue-600/25 transition duration-200 hover:from-blue-400 hover:to-indigo-400 active:translate-y-px focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-[#070c1a] focus:outline-none"
                >
                  <span>Search</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400">Trending:</span>
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
                  onClick={() =>
                    router.push(
                      `/services?category=${encodeURIComponent(tag.cat)}&search=${encodeURIComponent(tag.label)}`,
                    )
                  }
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-slate-300 transition duration-200 hover:border-blue-400/50 hover:bg-white/10 hover:text-white"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            <div className="mx-auto mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs font-medium text-slate-300">
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
      </section>

      <section className="border-b border-border bg-card">
        <div className="container-page py-7">
          <p className="text-center text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Certified repair specialists for all major global brands
          </p>
          <div className="marquee-paused edge-fade-x mt-5 overflow-hidden">
            <div className="animate-marquee flex w-max">
              {[0, 1].map((half) => (
                <div
                  key={half}
                  aria-hidden={half === 1}
                  className="flex shrink-0 items-center gap-2.5 pr-2.5 sm:gap-3 sm:pr-3"
                >
                  {BRANDS.map((b) => (
                    <span
                      key={b.name}
                      className="flex items-baseline gap-1.5 whitespace-nowrap rounded-full border border-border bg-background px-4 py-1.5 text-sm transition-colors duration-200 hover:border-primary/40 hover:text-primary"
                    >
                      <span className="font-bold text-foreground">{b.name}</span>
                      <span className="hidden text-[11px] font-normal text-muted-foreground sm:inline">
                        {b.tag}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Explore Categories"
          icon={WrenchIcon}
          title="Popular Repair Categories"
          description="Select your device or appliance to view verified technicians, upfront base pricing and home visit options."
          align="left"
          action={
            <Link href="/services" className="link-arrow">
              All Services
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_META.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                data-aos="fade-up"
                data-aos-delay={(index % 4) * 60}
                className="group flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <div>
                  <span
                    className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-md shadow-slate-900/10 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-xs font-bold text-foreground">
                    From {cat.price}
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}

          <Link
            href="/services"
            data-aos="fade-up"
            data-aos-delay={(CATEGORY_META.length % 4) * 60}
            className="group flex h-full flex-col justify-between rounded-2xl border border-dashed border-border bg-muted/40 p-6 transition duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:bg-primary/5"
          >
            <div>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-border transition duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                <HelpCircleIcon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                Need a Custom Service?
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Browse the full directory or request a diagnosis from our verified
                technician network.
              </p>
            </div>
            <span className="mt-6 flex items-center gap-1.5 border-t border-border/60 pt-4 text-xs font-bold text-primary">
              View all services
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Verified & Approved Listings"
            icon={SparklesIcon}
            title="Featured Repair Services"
            description="Handpicked services from certified technicians, approved by our admins and ready to book today."
            align="left"
            action={
              <Link href="/services" className="btn-outline">
                Explore All Services
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            }
          />

          {loading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-[24rem]" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="panel mt-12 border-dashed p-12 text-center">
              <p className="text-base font-semibold text-foreground">
                No services available yet
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Approved services will appear here as technicians join the platform.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((s, index) => (
                <ServiceCard key={s._id} service={s} delay={(index % 3) * 80} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Simple & Trackable Flow"
          icon={ClockIcon}
          title="How FixMate Works"
          description="A transparent 4-stage journey engineered to eliminate guesswork, remove advance fees and give you complete control."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, index) => (
            <div
              key={s.step}
              data-aos="fade-up"
              data-aos-delay={index * 70}
              className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-base font-extrabold tracking-tight text-primary">
                  {s.step}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  {s.tag}
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
              <span className="mt-5 flex items-center gap-1.5 border-t border-border/60 pt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon className="h-4 w-4" />
                Verified step
              </span>
            </div>
          ))}
        </div>

        <div
          data-aos="fade-up"
          className="mt-10 flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
          <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p>
            <strong className="font-bold">FixMate Promise:</strong> You never hand over
            payment until the technician completes the repair and you verify your device
            works properly.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#070c1a] py-16 text-white sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 10%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 30%, black 10%, transparent 75%)',
          }}
        />
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-[100px]" />

        <div className="container-page relative">
          <SectionHeading
            eyebrow="Instant Problem Diagnostic"
            icon={SparklesIcon}
            title="What Is Wrong With Your Device?"
            description="Pick a common symptom for an instant preliminary diagnosis, estimated turnaround time and matching technicians."
            tone="dark"
          />

          <div className="mt-12 grid items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-2.5 lg:col-span-5" data-aos="fade-right">
              {DIAGNOSTIC_ISSUES.map((issue) => {
                const active = activeIssue.id === issue.id;
                return (
                  <button
                    key={issue.id}
                    onClick={() => setActiveIssue(issue)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all duration-300 ${
                      active
                        ? 'border-blue-400/50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div>
                      <span
                        className={`text-[10px] font-bold tracking-[0.14em] uppercase ${
                          active ? 'text-blue-200' : 'text-cyan-400'
                        }`}
                      >
                        {issue.category}
                      </span>
                      <p className="mt-0.5 text-sm font-bold text-white">{issue.label}</p>
                    </div>
                    <ArrowRightIcon
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                        active ? 'translate-x-0.5 text-white' : 'text-slate-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div
              key={activeIssue.id}
              className="animate-in-scale rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-xl lg:col-span-7 sm:p-8"
              data-aos="fade-left"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <span className="text-[11px] font-bold tracking-[0.14em] text-blue-400 uppercase">
                    Category: {activeIssue.category}
                  </span>
                  <h3 className="mt-1.5 text-xl font-bold tracking-tight text-white">
                    {activeIssue.label}
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/25">
                  {activeIssue.price}
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
                    Symptom analysis
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                    {activeIssue.symptom}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
                    Recommended fix
                  </p>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-emerald-300">
                    {activeIssue.recommendation}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Typical repair time
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {activeIssue.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Warranty included
                    </p>
                    <p className="mt-1 text-sm font-bold text-emerald-400">
                      30-Day Guarantee
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/services?category=${encodeURIComponent(activeIssue.category)}`}
                  className="btn-primary flex-1 shadow-lg shadow-blue-600/25"
                >
                  Find {activeIssue.category} Specialists
                </Link>
                <Link href="/services" className="btn-ghost-light">
                  Browse All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="Built On Complete Trust"
          icon={ShieldCheckIcon}
          title="Why FixMate Is the Smart Choice"
          description="We solved the traditional problems of hidden fees, missing device parts and poor workmanship through strict platform rules."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_POINTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 70}
                className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`flex size-12 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105 ${item.accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {item.badge}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <span className="mt-5 flex items-center gap-1.5 border-t border-border/60 pt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckIcon className="h-3.5 w-3.5" />
                  Guaranteed feature
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Got Questions?"
            icon={HelpCircleIcon}
            title="Frequently Asked Questions"
            description="Everything you need to know about booking, payment safety and technician warranties."
          />

          <div className="mt-12 space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;
              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index, 5) * 40}
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    isOpen
                      ? 'border-primary/30 bg-background shadow-sm'
                      : 'border-border/70 bg-background/60'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    id={buttonId}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-semibold text-foreground transition-colors duration-200 hover:text-primary sm:text-[15px]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-border/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div
          data-aos="fade-up"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1122] via-[#0d1730] to-indigo-950 p-8 text-white shadow-xl sm:p-12"
        >
          <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-blue-600/25 blur-[100px]" />

          <div className="relative grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="eyebrow-dark">Technician Partnership Program</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Are You a Skilled Repair Professional?
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
                Join FixMate to get high-paying customer repair requests in your local
                area. Enjoy zero listing fees, secure automated Stripe payouts and
                complete control over your schedule.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                  Daily local requests
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                  Direct Stripe payouts
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                  No upfront listing fee
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
              <Link href="/sign-up" className="btn-light">
                Register as Technician
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/about" className="btn-ghost-light">
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 py-16 text-white sm:py-20">
        <div className="animate-gradient-pan pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-white/15 blur-[90px]" />

        <div data-aos="fade-up" className="container-page relative text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Get Your Device Restored Today?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-blue-100">
            Browse verified technicians across Dhaka and beyond. Zero advance fees — you
            only pay after complete satisfaction.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/services" className="btn-light sm:px-8">
              Browse All Services Now
            </Link>
            <Link href="/sign-up" className="btn-ghost-light sm:px-8">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
