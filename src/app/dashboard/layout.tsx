'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Role } from '@/lib/auth-shared';
import { toast } from 'sonner';

const MENUS: Record<Role, { href: string; label: string }[]> = {
  customer: [
    { href: '/dashboard/customer', label: 'Overview' },
    { href: '/dashboard/customer/bookings', label: 'My Bookings' },
    { href: '/dashboard/customer/payments', label: 'Payments' },
    { href: '/dashboard/profile', label: 'Update Profile' },
  ],
  technician: [
    { href: '/dashboard/technician', label: 'Overview' },
    { href: '/dashboard/technician/add-service', label: 'Add Service' },
    { href: '/dashboard/technician/my-services', label: 'My Services' },
    { href: '/dashboard/technician/requests', label: 'Requests' },
    { href: '/dashboard/profile', label: 'Update Profile' },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Overview' },
    { href: '/dashboard/admin/users', label: 'Users' },
    { href: '/dashboard/admin/services', label: 'Service Approval' },
    { href: '/dashboard/admin/bookings', label: 'All Bookings' },
    { href: '/dashboard/admin/transactions', label: 'Transactions' },
    { href: '/dashboard/profile', label: 'Update Profile' },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Route guard: logged-out → /sign-in (preserving where they wanted to go);
  // logged-in users on another role's route are redirected to their own dashboard.
  useEffect(() => {
    if (isPending) return;
    const user = session?.user as { role?: Role } | undefined;
    if (!user) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
      return;
    }
    const role = user.role ?? 'customer';
    const isOwnSection =
      pathname === '/dashboard' ||
      pathname === '/dashboard/profile' ||
      pathname.startsWith(`/dashboard/${role}`);
    if (!isOwnSection) {
      toast.info('You were redirected to your own dashboard');
      router.replace(`/dashboard/${role}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  const user = session?.user as { name?: string; email: string; image?: string; role?: Role } | undefined;
  const role: Role = user?.role ?? 'customer';
  const menu = MENUS[role];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 p-4 text-gray-200 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link href="/" className="flex items-center gap-2 px-2 py-3 text-lg font-bold text-white">
          <span aria-hidden>🔧</span> FixMate
        </Link>
        <nav className="mt-4 flex flex-col gap-1">
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              onClick={() => setSidebarOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm ${
                pathname === m.href ? 'bg-blue-600 font-semibold text-white' : 'hover:bg-gray-800'
              }`}
            >
              {m.label}
            </Link>
          ))}
        </nav>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <button className="lg:hidden" onClick={() => setSidebarOpen((v) => !v)} aria-label="Toggle sidebar">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div className="ml-auto flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user?.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'U')}
              alt="avatar"
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.name}</p>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
