'use client';

import 'aos/dist/aos.css';
import AOS from 'aos';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Initialises AOS for the public route group and re-scans after navigation.
 * AOS's MutationObserver also picks up asynchronously rendered public content.
 *
 * Tuning notes: 850ms with a restrained trigger zone keeps reveals smooth
 * without delaying interaction; `once` avoids repeating motion on long pages.
 */
export function AOSProvider() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 850,
      easing: 'ease-out-quart',
      offset: 72,
      delay: 0,
      once: true,
      mirror: false,
      anchorPlacement: 'top-bottom',
      disable: () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }, []);

  useEffect(() => {
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      AOS.refreshHard();
      secondFrame = window.requestAnimationFrame(() => AOS.refresh());
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [pathname]);

  return null;
}
