import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-7xl" aria-hidden>🔧🧰</p>
      <h1 className="text-3xl font-bold">404 — Page Not Found</h1>
      <p className="text-gray-500">This page seems to be broken. Don&apos;t worry, we can fix that!</p>
      <Link href="/" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Back to Home
      </Link>
    </div>
  );
}
