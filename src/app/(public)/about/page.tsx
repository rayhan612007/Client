import Link from 'next/link';
import {
  WrenchIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@/components/Icons';

export default function AboutPage() {
  return (
    <div className="bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 py-20 text-white text-center">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-blue-600/20 blur-[130px]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Transforming Device Repair <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              With Zero Upfront Risk.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
            FixMate is Bangladesh’s role-based on-demand repair service marketplace. We connect smartphone, computer, and appliance owners with vetted technicians through a transparent, trackable workflow where you pay only after completion.
          </p>
        </div>
      </section>

      {/* Why We Built FixMate (The Story) */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              The Problem We Solve
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              No More Uncertainty When Getting Things Fixed
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              In Bangladesh and worldwide, finding a trustworthy technician for your expensive smartphone, laptop, or home AC has always been stressful. Customers often hand over devices with no idea what is happening, pay before inspecting the work, or face unexpected extra charges.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              FixMate fundamentally reimagines this experience: every job has a clear, trackable status pipeline, and customers pay only after testing their repaired equipment.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/50">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              The FixMate Standard
            </h3>
            <ul className="mt-4 space-y-3.5 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <span><strong>Pay-After-Service:</strong> No advance deposits or blind card charges.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <span><strong>Verified Specialists:</strong> Every technician passes skill and identity checks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <span><strong>Live Status Pipeline:</strong> Real-time milestones from request to completion.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <span><strong>30-Day Guarantee:</strong> Complete peace of mind on all parts and labor.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3 Stakeholders Role Breakdown */}
      <section className="border-y border-slate-200/80 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Three Roles, One Unified Ecosystem
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              Our architecture protects each stakeholder with dedicated dashboards and permissions.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {/* Customer Role */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <UserCheckIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">1. Customers</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Browse approved repair services across 7 categories, submit repair requests with problem descriptions, track work in real time, and pay securely via Stripe test checkout.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/60 pt-3 text-xs font-semibold text-blue-600">
                Dashboard: /dashboard/customer
              </div>
            </div>

            {/* Technician Role */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <WrenchIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">2. Technicians</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  List repair services with ImgBB image uploads, manage incoming customer requests, update job statuses through the linear pipeline, and finalize amounts upon delivery.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/60 pt-3 text-xs font-semibold text-indigo-600">
                Dashboard: /dashboard/technician
              </div>
            </div>

            {/* Admin Role */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">3. Admins</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Approve or reject service listings, manage users and roles, monitor all platform repair bookings, and inspect all Stripe revenue transactions and analytics.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-200/60 pt-3 text-xs font-semibold text-purple-600">
                Dashboard: /dashboard/admin
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 text-center text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Join the Repair Revolution Today
          </h2>
          <p className="mt-3 text-sm text-blue-100 max-w-lg mx-auto">
            Whether you need your phone screen fixed or want to offer your professional technical skills, FixMate is ready for you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/services"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-md hover:bg-blue-50 transition"
            >
              Browse Services
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
