'use client';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl" aria-hidden>⚠️</p>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-gray-500">{error.message || 'An unexpected error occurred. Please try again.'}</p>
      <button onClick={reset} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Try Again
      </button>
    </div>
  );
}
