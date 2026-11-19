import Link from 'next/link';
import type { Service } from '@/lib/auth-shared';
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
} from '@/components/Icons';

/**
 * The one service card used by both the Home featured grid and the Browse
 * Services grid — identical size, spacing and CTA so the marketplace always
 * looks uniform. Cards stretch to equal height inside any grid.
 */
export function ServiceCard({
  service,
  delay,
}: {
  service: Service;
  delay?: number;
}) {
  const isHome = service.serviceMode === 'Home Visit';

  return (
    <Link
      href={`/services/${service._id}`}
      data-aos="fade-up"
      {...(typeof delay === 'number' ? { 'data-aos-delay': delay } : {})}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-[transform,border-color,box-shadow] duration-1000 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      {/* Uniform banner */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/55 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
          {service.category}
        </span>
        <span
          className={`absolute top-3 right-3 rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ${isHome
              ? 'border-emerald-400/40 bg-emerald-950/85 text-emerald-300'
              : 'border-indigo-400/40 bg-indigo-950/85 text-indigo-300'
            }`}
        >
          {isHome ? 'Home Visit' : 'Shop Drop-off'}
        </span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-medium text-white/90">
          <MapPinIcon className="h-3.5 w-3.5" />
          {service.serviceArea}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
            {service.estimatedDuration}
          </span>
          <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
            <CheckIcon className="h-3.5 w-3.5" />
            Verified
          </span>
        </div>

        <h3 className="mt-2.5 line-clamp-1 text-base font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
          {service.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-4 flex items-center gap-2.5 border-t border-border/60 pt-3.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary transition-transform duration-300 group-hover:scale-105">
            {service.technicianImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={service.technicianImage}
                alt={`${service.technicianName} profile`}
                className="size-full rounded-full object-cover"
              />
            ) : (
              service.technicianName?.charAt(0) || 'T'
            )}
          </span>
          <span className="truncate text-sm font-medium text-foreground/90">
            {service.technicianName}
          </span>
        </div>

        {/* Price + CTA pinned to the bottom so every card ends on the same line */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/60 pt-4">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Starting at
            </p>
            <p className="text-xl font-extrabold tracking-tight text-foreground">
              ${service.basePrice}
            </p>
          </div>
          <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition duration-200 group-hover:bg-primary/90">
            View Details
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
