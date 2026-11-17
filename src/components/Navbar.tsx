'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Role } from '@/lib/auth-shared';
import { toast } from 'sonner';
import { WrenchIcon, ShieldCheckIcon, UserCheckIcon, ArrowRightIcon } from '@/components/Icons';

const PUBLIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'How It Works' },
];

const DASHBOARD_PATH: Record<Role, string> = {
  customer: '/dashboard/customer',
  technician: '/dashboard/technician',
  admin: '/dashboard/admin',
};

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = session?.user as
    | { name?: string; email: string; image?: string; role?: Role }
    | undefined;
  const role = user?.role ?? 'customer';
  const isPublicActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  async function signOut() {
    await authClient.signOut();
    toast.success('Signed out successfully');
    setMenuOpen(false);
    setOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <WrenchIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Fix<span className="text-blue-600">Mate</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-medium tracking-wide uppercase text-slate-400 -mt-1">
              Repair Platform
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-slate-50/80 p-1 md:flex">
          {PUBLIC_LINKS.map((l) => {
            const active = isPublicActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                  active
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth / User Action Area */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-xs hover:border-blue-400 hover:shadow-sm transition"
                aria-label="Profile menu"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.image || 'https://ui-avatars.com/api/?background=2563eb&color=fff&name=' + encodeURIComponent(user.name || 'User')}
                  alt={user.name || 'avatar'}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                />
                <div className="flex flex-col text-left">
                  <span className="max-w-[110px] truncate text-xs font-semibold text-slate-800">
                    {user.name || 'Account'}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {role}
                  </span>
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
                  <div className="border-b border-slate-100 pb-3">
                    <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      <ShieldCheckIcon className="h-3.5 w-3.5 text-blue-600" />
                      {role.charAt(0).toUpperCase() + role.slice(1)} Account
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-1 text-sm font-medium">
                    <Link
                      href={DASHBOARD_PATH[role]}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      <span>Dashboard Overview</span>
                      <ArrowRightIcon className="h-4 w-4 text-slate-400" />
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      <span>Update Profile</span>
                      <UserCheckIcon className="h-4 w-4 text-slate-400" />
                    </Link>
                    <button
                      onClick={signOut}
                      className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                    >
                      <span>Sign Out</span>
                      <span aria-hidden>🚪</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md transition"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-4 backdrop-blur-md md:hidden shadow-lg">
          <div className="flex flex-col gap-1.5">
            {PUBLIC_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isPublicActive(l.href)
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="my-2 border-t border-slate-100" />

            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.image || 'https://ui-avatars.com/api/?background=2563eb&color=fff&name=' + encodeURIComponent(user.name || 'User')}
                    alt={user.name || 'avatar'}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{role}</p>
                  </div>
                </div>
                <Link
                  href={DASHBOARD_PATH[role]}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Update Profile
                </Link>
                <button
                  onClick={signOut}
                  className="rounded-xl px-3.5 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
