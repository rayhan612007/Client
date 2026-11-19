export default function DashboardLoading() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="space-y-3">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-9 w-72 max-w-full" />
        <div className="skeleton h-4 w-full max-w-lg" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/70 bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className="skeleton h-3.5 w-20" />
              <div className="skeleton size-9 rounded-xl" />
            </div>
            <div className="skeleton mt-4 h-8 w-24" />
            <div className="skeleton mt-2 h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <div className="skeleton h-5 w-48" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="skeleton size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-1/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
              <div className="skeleton h-7 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only" role="status">
        Loading dashboard
      </span>
    </div>
  );
}
