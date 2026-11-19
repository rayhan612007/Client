import Link from 'next/link';
import { SectionHeading } from '@/components/SectionHeading';
import {
  WrenchIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  ClockIcon,
  HeadphonesIcon,
  DollarSignIcon,
} from '@/components/Icons';

const STATS = [
  { value: '7', label: 'Repair categories' },
  { value: '100%', label: 'Verified technicians' },
  { value: '$0', label: 'Upfront payment' },
  { value: '30', label: 'Day warranty' },
];

const STANDARDS = [
  {
    title: 'Pay-After-Service',
    body: 'No advance deposits or blind card charges — pay once you have tested the repair.',
  },
  {
    title: 'Verified Specialists',
    body: 'Every technician passes identity and technical skill checks before listing.',
  },
  {
    title: 'Live Status Pipeline',
    body: 'Real-time milestones from Requested all the way to Completed.',
  },
  {
    title: '30-Day Guarantee',
    body: 'Complete peace of mind on both replaced parts and technician labour.',
  },
];

const ROLES = [
  {
    step: '01',
    title: 'Customers',
    icon: UserCheckIcon,
    accent: 'bg-primary/10 text-primary',
    body: 'Browse approved repair services across 7 categories, submit requests with a clear problem description, track the work in real time and pay securely via Stripe test checkout.',
    path: '/dashboard/customer',
  },
  {
    step: '02',
    title: 'Technicians',
    icon: WrenchIcon,
    accent: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    body: 'List repair services with image uploads, manage incoming customer requests, advance job statuses through the linear pipeline and finalise amounts on delivery.',
    path: '/dashboard/technician',
  },
  {
    step: '03',
    title: 'Admins',
    icon: ShieldCheckIcon,
    accent: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    body: 'Approve or reject service listings, manage users and roles, monitor every repair booking and inspect all Stripe revenue transactions.',
    path: '/dashboard/admin',
  },
];

const VALUES = [
  {
    icon: DollarSignIcon,
    title: 'Radical transparency',
    body: 'Base prices are public, final amounts are agreed in-app, and you never pay before the job is done.',
  },
  {
    icon: ClockIcon,
    title: 'Respect for your time',
    body: 'Same-day responses, flexible visit modes and a live tracker so you are never left guessing.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Human support',
    body: 'A real care team by phone and email for every booking, concern and warranty claim.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#070c1a] py-20 text-white sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 25%, black 10%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 25%, black 10%, transparent 75%)',
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />

        <div className="container-page relative text-center" data-aos="fade-up">
          <span className="eyebrow-dark">
            <SparklesIcon className="h-3.5 w-3.5" />
            Our Mission &amp; Vision
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            Transforming device repair
            <span className="mt-2 block bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
              with zero upfront risk.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            FixMate is a role-based on-demand repair marketplace. We connect smartphone,
            computer and appliance owners with vetted technicians through a transparent,
            trackable workflow where you pay only after completion.
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-5 backdrop-blur-md"
              >
                <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] font-medium text-slate-400 sm:text-xs">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div data-aos="fade-right">
            <span className="eyebrow">The Problem We Solve</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              No more uncertainty when getting things fixed
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Finding a trustworthy technician for an expensive smartphone, laptop or home
              AC has always been stressful. Customers hand over devices with no idea what
              is happening, pay before inspecting the work, or face unexpected extra
              charges.
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              FixMate reimagines that experience: every job has a clear, trackable status
              pipeline, and customers pay only after testing their repaired equipment.
            </p>
          </div>

          <div
            data-aos="fade-left"
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-md shadow-slate-200/50 sm:p-7 dark:shadow-black/20"
          >
            <h3 className="border-b border-border/60 pb-3 text-base font-bold text-foreground">
              The FixMate Standard
            </h3>
            <ul className="mt-4 space-y-3.5">
              {STANDARDS.map((item) => (
                <li key={item.title} className="flex items-start gap-2.5 text-sm">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-muted-foreground">
                    <strong className="font-semibold text-foreground">
                      {item.title}:
                    </strong>{' '}
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-y border-border bg-card py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Role-Based Architecture"
            icon={ShieldCheckIcon}
            title="Three Roles, One Unified Ecosystem"
            description="Our architecture protects each stakeholder with dedicated dashboards, permissions and workflows."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {ROLES.map((role, index) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.title}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                  className="flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-background p-6 shadow-xs transition duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex size-12 items-center justify-center rounded-2xl ${role.accent}`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-xs font-bold text-muted-foreground/60">
                        {role.step}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                      {role.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {role.body}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs font-semibold text-primary">
                    <span className="truncate">{role.path}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="What Drives Us"
          icon={SparklesIcon}
          title="Principles Behind Every Booking"
          description="Simple commitments that shape how FixMate hires technicians, prices work and handles your devices."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                data-aos="fade-up"
                data-aos-delay={i * 70}
                className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 py-16 text-center text-white">
          <div className="animate-gradient-pan pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-white/15 blur-[90px]" />

          <div className="relative px-4 sm:px-6" data-aos="fade-up">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Join the repair revolution today
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-blue-100">
              Whether you need a phone screen fixed or want to offer your professional
              skills, FixMate is ready for you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/services" className="btn-light sm:px-8">
                Browse Services
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/sign-up" className="btn-ghost-light sm:px-8">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
