import Link from 'next/link';
import {
  WrenchIcon,
  XIcon,
  FacebookIcon,
  LinkedinIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ShieldCheckIcon,
  ClockIcon,
  DollarSignIcon,
} from '@/components/Icons';

const CATEGORIES = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

const PLATFORM_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Browse Services' },
  { href: '/about', label: 'How It Works' },
  { href: '/sign-up', label: 'Become a Technician' },
  { href: '/sign-in', label: 'Sign In to Account' },
];

const TRUST = [
  {
    icon: ShieldCheckIcon,
    title: '100% Verified Techs',
    description: 'Every specialist is ID and skill verified',
    tile: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: DollarSignIcon,
    title: 'Pay After Completion',
    description: 'Zero upfront fees; pay only when satisfied',
    tile: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: ClockIcon,
    title: 'Fast Response Times',
    description: 'Same-day inspection & rapid turnaround',
    tile: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    icon: WrenchIcon,
    title: '30-Day Service Warranty',
    description: 'Guaranteed parts and reliable workmanship',
    tile: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  },
];

const SOCIALS = [
  { href: 'https://x.com', label: 'X (formerly Twitter)', icon: XIcon },
  { href: 'https://facebook.com', label: 'Facebook', icon: FacebookIcon },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: LinkedinIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-muted-foreground">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-border bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
          {TRUST.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-3.5"
                data-aos="fade-up"
                data-aos-delay={index * 70}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.tile}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="lg:col-span-4" data-aos="fade-up">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
                <WrenchIcon className="h-5 w-5 text-white" />
              </span>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Fix<span className="text-primary">Mate</span>
              </span>
            </Link>
            <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              FixMate is Bangladesh&apos;s smart on-demand repair service platform. We connect
              device owners with certified technicians for transparent, tracked, and guaranteed
              repairs with zero upfront risk.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="70">
            <p className="text-sm font-semibold tracking-wide text-foreground uppercase">
              Platform
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="lg:col-span-3" data-aos="fade-up" data-aos-delay="140">
            <p className="text-sm font-semibold tracking-wide text-foreground uppercase">
              Repair Categories
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="transition hover:text-foreground"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3" data-aos="fade-up" data-aos-delay="210">
            <p className="text-sm font-semibold tracking-wide text-foreground uppercase">
              Contact & Support
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
                <span>Mirpur-10, Dhaka 1216, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                <a href="tel:+8801700000000" className="transition hover:text-foreground">
                  +880 1700-000000
                  <span className="ml-1 text-xs text-muted-foreground">(24/7)</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
                <a
                  href="mailto:support@fixmate.com"
                  className="transition hover:text-foreground"
                >
                  support@fixmate.com
                </a>
              </li>
            </ul>

            <div className="mt-5 rounded-xl border border-border bg-background/60 p-3 text-xs">
              <p className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                Stripe Test Payments
              </p>
              <p className="mt-1 font-mono text-muted-foreground">4242 4242 4242 4242</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-border bg-muted/30 py-5 text-xs">
        <div
          className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-muted-foreground sm:flex-row sm:px-6"
          data-aos="fade-up"
          data-aos-delay="260"
        >
          <p>© {new Date().getFullYear()} FixMate Technologies Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="transition hover:text-foreground">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="transition hover:text-foreground">Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span className="transition hover:text-foreground">Warranty Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
