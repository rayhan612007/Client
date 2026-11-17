import Link from 'next/link';

const CATEGORIES = ['Smartphone', 'Laptop & PC', 'AC', 'Refrigerator', 'TV', 'Washing Machine', 'Electrical'];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-lg font-bold text-white">
            <span aria-hidden>🔧</span> FixMate
          </p>
          <p className="mt-2 text-sm">
            Broken device? Get it fixed by verified technicians — and pay only after the job is done.
          </p>
          <div className="mt-3 flex gap-3">
            <a href="https://x.com" aria-label="X (Twitter)" className="hover:text-white">
              𝕏
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-white">
              f
            </a>
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Quick Links</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Popular Categories</p>
          <ul className="mt-2 grid grid-cols-2 gap-1 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c}>
                <Link href={`/services?category=${encodeURIComponent(c)}`} className="hover:text-white">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <ul className="mt-2 text-sm">
            <li>support@fixmate.com</li>
            <li>+880 1XXX-XXXXXX</li>
            <li>Mirpur, Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} FixMate. All rights reserved.
      </div>
    </footer>
  );
}
