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

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6" data-aos="fade-up">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">100% Verified Techs</p>
              <p className="text-xs text-slate-400">Every specialist is ID and skill verified</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSignIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Pay After Completion</p>
              <p className="text-xs text-slate-400">Zero upfront fees; pay only when satisfied</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Fast Response Times</p>
              <p className="text-xs text-slate-400">Same-day inspection & rapid turnaround</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <WrenchIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">30-Day Service Warranty</p>
              <p className="text-xs text-slate-400">Guaranteed parts and reliable workmanship</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5 sm:px-6" data-aos="fade-up">
        {/* Brand Info */}
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
              <WrenchIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Fix<span className="text-blue-500">Mate</span>
            </span>
          </Link>
          <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-slate-400">
            FixMate is Bangladesh&apos;s smart on-demand repair service platform. We connect device owners with certified technicians for transparent, tracked, and guaranteed repairs with zero upfront risk.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white transition"
            >
              <XIcon className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white transition"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white transition"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-white uppercase">Platform</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white transition">
                Browse Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-white transition">
                Become a Technician
              </Link>
            </li>
            <li>
              <Link href="/sign-in" className="hover:text-white transition">
                Sign In to Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Categories */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-white uppercase">Repair Categories</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={`/services?category=${encodeURIComponent(c)}`}
                  className="hover:text-white transition"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-white uppercase">Contact & Support</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <span>Mirpur-10, Dhaka 1216, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2.5">
              <PhoneIcon className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>+880 1700-000000 (24/7 Helpline)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MailIcon className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>support@fixmate.com</span>
            </li>
          </ul>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-200">Stripe Test Payments</p>
            <p className="mt-0.5">Test card: 4242 4242 4242 4242</p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} FixMate Technologies Ltd. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-slate-400">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Warranty Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
