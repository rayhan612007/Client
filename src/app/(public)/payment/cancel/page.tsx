import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-6xl" aria-hidden>💳</p>
      <h1 className="mt-4 text-3xl font-bold">Payment Cancelled</h1>
      <p className="mt-2 text-gray-500">
        No worries — nothing was charged. You can pay anytime from your bookings.
      </p>
      <Link href="/dashboard/customer/bookings" className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Try Again — Back to My Bookings
      </Link>
    </div>
  );
}
