'use client';

import 'aos/dist/aos.css';
import AOS from 'aos';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Initialises AOS once per app and re-scans after client-side navigations.
 * AOS ships its own MutationObserver, so asynchronously rendered cards
 * (bookings, services, payments) get picked up automatically.
 */
export function AOSProvider() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      offset: 60,
      once: true,
      mirror: false,
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }, []);

  useEffect(() => {
    AOS.refreshHard();
  }, [pathname]);

  return null;
}
