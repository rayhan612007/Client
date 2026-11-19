'use client';

import 'aos/dist/aos.css';
import AOS from 'aos';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Initialises AOS once per app and re-scans after client-side navigations.
 * AOS ships its own MutationObserver, so asynchronously rendered cards
 * (bookings, services, payments) get picked up automatically.
 *
 * Tuning notes: 600ms with an ease-out curve reads as premium rather than
 * slow, and `once` keeps long pages calm while scrolling back up.
 */
export function AOSProvider() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      offset: 80,
      delay: 0,
      once: true,
      mirror: false,
      anchorPlacement: 'top-bottom',
      disable: () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }, []);

  useEffect(() => {
    AOS.refreshHard();
  }, [pathname]);

  return null;
}
