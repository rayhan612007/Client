'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Role } from '@/lib/auth-shared';
import { toast } from 'sonner';

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
    toast.success('Signed out');
    setMenuOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span aria-hidden>🔧</span> FixMate
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {PUBLIC_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isPublicActive(l.href) ? 'font-semibold text-blue-600' : 'text-gray-700 hover:text-blue-600'}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* desktop auth area */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full ring-2 ring-transparent hover:ring-blue-300"
                aria-label="Profile menu"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'U')}
                  alt={user.name || 'avatar'}
                  className="h-9 w-9 rounded-full object-cover"
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
                  <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                  <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                  <div className="mt-3 flex flex-col gap-1 text-sm">
                    <Link href={DASHBOARD_PATH[role]} onClick={() => setMenuOpen(false)} className="rounded px-2 py-1 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setMenuOpen(false)} className="rounded px-2 py-1 hover:bg-gray-100">
                      Update Profile
                    </Link>
                    <button onClick={signOut} className="rounded px-2 py-1 text-left text-red-600 hover:bg-red-50">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                Sign In
              </Link>
              <Link href="/sign-up" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-gray-100 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {PUBLIC_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded px-2 py-1.5 hover:bg-gray-100">
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={DASHBOARD_PATH[role]} onClick={() => setOpen(false)} className="rounded px-2 py-1.5 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="rounded px-2 py-1.5 hover:bg-gray-100">
                  Update Profile
                </Link>
                <button onClick={signOut} className="rounded px-2 py-1.5 text-left text-red-600 hover:bg-red-50">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setOpen(false)} className="rounded px-2 py-1.5 hover:bg-gray-100">
                  Sign In
                </Link>
                <Link href="/sign-up" onClick={() => setOpen(false)} className="rounded bg-blue-600 px-2 py-1.5 text-white">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
