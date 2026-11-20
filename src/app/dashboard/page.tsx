'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Role } from '@/lib/auth-shared';

export default function DashboardIndex() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    const user = session?.user as { role?: Role } | undefined;
    if (!user) {
      router.replace('/sign-in?next=%2Fdashboard');
      return;
    }
    router.replace(`/dashboard/${user.role ?? 'customer'}`);
  }, [isPending, session, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}
