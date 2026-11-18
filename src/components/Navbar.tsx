'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Role } from '@/lib/auth-shared';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
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
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
            <WrenchIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              Fix<span className="text-primary">Mate</span>
            </span>
            <span className="-mt-1 hidden text-[10px] font-medium tracking-wide text-muted-foreground uppercase sm:inline-block">
              Repair Platform
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-muted/60 p-1 md:flex">
          {PUBLIC_LINKS.map((l) => {
            const active = isPublicActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-background font-semibold text-primary shadow-xs'
                    : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
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
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1 pr-3 pl-1 shadow-xs transition hover:border-primary/50 hover:shadow-sm"
                  aria-label="Profile menu"
                  aria-expanded={menuOpen}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.image || 'https://ui-avatars.com/api/?background=2563eb&color=fff&name=' + encodeURIComponent(user.name || 'User')}
                    alt={user.name || 'avatar'}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-background"
                  />
                  <div className="flex flex-col text-left">
                    <span className="max-w-[110px] truncate text-xs font-semibold text-foreground">
                      {user.name || 'Account'}
                    </span>
                    <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                      {role}
                    </span>
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-xl">
                    <div className="border-b border-border pb-3">
                      <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        <ShieldCheckIcon className="h-3.5 w-3.5" />
                        {role.charAt(0).toUpperCase() + role.slice(1)} Account
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-1 text-sm font-medium">
                      <Link
                        href={DASHBOARD_PATH[role]}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-foreground/80 transition hover:bg-muted hover:text-primary"
                      >
                        <span>Dashboard Overview</span>
                        <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-foreground/80 transition hover:bg-muted hover:text-primary"
                      >
                        <span>Update Profile</span>
                        <UserCheckIcon className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <button
                        onClick={signOut}
                        className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                      >
                        <span>Sign Out</span>
                        <span aria-hidden>🚪</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <ThemeToggle />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-muted hover:text-primary"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-md"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <ThemeToggle />
            </div>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="border-t border-border bg-background/95 px-4 py-4 shadow-lg backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1.5">
            {PUBLIC_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isPublicActive(l.href)
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-foreground/80 hover:bg-muted'
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="my-2 border-t border-border" />

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
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{role}</p>
                  </div>
                </div>
                <Link
                  href={DASHBOARD_PATH[role]}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3.5 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3.5 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
                >
                  Update Profile
                </Link>
                <button
                  onClick={signOut}
                  className="rounded-xl px-3.5 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-border py-2.5 text-center text-sm font-semibold text-foreground/80 hover:bg-muted"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
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
