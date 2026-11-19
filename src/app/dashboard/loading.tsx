import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[50vh] w-full items-center justify-center"
    >
      <Loader2 className="size-9 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Loading dashboard</span>
    </div>
  );
}
