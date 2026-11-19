
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import type { Role } from '@/lib/auth-shared';
import { toast } from 'sonner';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Clipboard,
  DollarSign,
  Folder,
  Home,
  Layout,
  LogOut,
  Plus,
  ShieldCheck,
  User,
  Users,
  WrenchIcon,
  type LucideIcon,
} from 'lucide-react';

type MenuItem = { href: string; label: string; icon: LucideIcon };

const MENUS: Record<Role, MenuItem[]> = {
  customer: [
    { href: '/dashboard/customer', label: 'Overview', icon: Layout },
    { href: '/dashboard/customer/bookings', label: 'My Bookings', icon: Clipboard },
    { href: '/dashboard/customer/payments', label: 'Payments', icon: DollarSign },
  ],
  technician: [
    { href: '/dashboard/technician', label: 'Overview', icon: Layout },
    { href: '/dashboard/technician/add-service', label: 'Add Service', icon: Plus },
    { href: '/dashboard/technician/my-services', label: 'My Services', icon: Folder },
    { href: '/dashboard/technician/requests', label: 'Requests', icon: ShieldCheck },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Overview', icon: Users },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
    { href: '/dashboard/admin/services', label: 'Service Approval', icon: ShieldCheck },
    { href: '/dashboard/admin/bookings', label: 'All Bookings', icon: Clipboard },
    { href: '/dashboard/admin/transactions', label: 'Transactions', icon: DollarSign },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  customer: 'Customer',
  technician: 'Technician',
  admin: 'Administrator',
};

function isItemActive(pathname: string, href: string, role: Role) {
  if (pathname === href) return true;
  if (href === `/dashboard/${role}`) return false;
  return pathname.startsWith(`${href}/`);
}

function DashboardLoading() {
  return (
    <div className="flex min-h-svh w-full">
      <div className="hidden w-64 flex-col gap-4 border-r bg-sidebar p-4 md:flex">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="mt-6 space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-full rounded-md" />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-1 items-center justify-center p-8">
          <div
            role="status"
            aria-label="Loading dashboard"
            className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
          />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user as
    | { name?: string; email: string; image?: string; role?: Role }
    | undefined;
  const role: Role = user?.role ?? 'customer';
  const menu = MENUS[role];
  const hasAccess =
    pathname === '/dashboard' ||
    pathname === '/dashboard/profile' ||
    pathname.startsWith(`/dashboard/${role}`);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!hasAccess) {
      toast.info('You were redirected to your own dashboard');
      router.replace(`/dashboard/${role}`);
    }
  }, [hasAccess, isPending, pathname, role, router, user]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success('Logged out successfully');
      router.replace('/');
      router.refresh();
    } catch {
      toast.error('Failed to logout');
    }
  };

  if (isPending || !user || !hasAccess) {
    return <DashboardLoading />;
  }

  const avatarUrl =
    user.image ||
    `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(user.name || 'User')}`;

  const pageTitle =
    [...menu, { href: '/dashboard/profile', label: 'Update Profile', icon: User }]
      .filter((item) => isItemActive(pathname, item.href, role))
      .sort((a, b) => b.href.length - a.href.length)[0]?.label ?? 'Dashboard';

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="pb-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild tooltip="FixMate home">
                <Link href="/">
                  <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
                    <WrenchIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-base font-semibold tracking-tight">
                      FixMate
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      Repair service platform
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Home">
                    <Link href="/">
                      <Home />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        isActive={isItemActive(pathname, item.href, role)}
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Update Profile"
                    isActive={pathname === '/dashboard/profile'}
                  >
                    <Link href="/dashboard/profile">
                      <User />
                      <span>Update Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Sign Out" onClick={handleLogout}>
                    <LogOut />
                    <span>Sign Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild tooltip={user.name || 'Account'}>
                <Link href="/dashboard/profile">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt=""
                    className="size-8 shrink-0 rounded-lg object-cover"
                  />
                  <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-medium">
                      {user.name || 'Account'}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      {user.email}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="md:min-h-svh">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{pageTitle}</p>
            <p className="truncate text-xs text-muted-foreground">
              {ROLE_LABEL[role]} workspace
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={user.name || 'User'}
                className="size-8 shrink-0 rounded-full object-cover ring-1 ring-border"
              />
              <div className="min-w-0 max-w-24 sm:max-w-36">
                <p className="truncate text-xs font-semibold text-foreground">
                  {user.name || 'Account'}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {ROLE_LABEL[role]}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex w-full flex-1 flex-col p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}