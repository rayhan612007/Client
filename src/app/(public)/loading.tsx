export default function PublicLoading() {
  return (
    <div className="container-page py-12 sm:py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="w-full max-w-xl space-y-4">
          <div className="skeleton h-6 w-44 rounded-full" />
          <div className="skeleton h-10 w-full max-w-md" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-4/5" />
        </div>
        <div className="skeleton h-9 w-40 rounded-full" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card"
          >
            <div className="skeleton h-44 w-full rounded-none" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-3.5 w-2/3" />
              <div className="skeleton h-3.5 w-full" />
              <div className="skeleton h-3.5 w-4/5" />
              <div className="skeleton mt-4 h-10 w-full" />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only" role="status">
        Loading page content
      </span>
    </div>
  );
}
